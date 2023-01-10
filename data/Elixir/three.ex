defmodule ElixirPoster do
  require Logger
  alias ElixirPoster.PosterData

  def to_hex({r, g, b}) do
    "#" <>
    (r |> :binary.encode_unsigned |> Base.encode16) <>
    (g |> :binary.encode_unsigned |> Base.encode16) <>
    (b |> :binary.encode_unsigned |> Base.encode16)
  end

  def to_hex({r, g, b, a}) do
    "#" <>
    (r |> :binary.encode_unsigned |> Base.encode16) <>
    (g |> :binary.encode_unsigned |> Base.encode16) <>
    (b |> :binary.encode_unsigned |> Base.encode16) <>
    (a |> :binary.encode_unsigned |> Base.encode16)
  end

  def join_code(code) do
    Logger.debug("Joining code...")
    code
    |> String.trim
    |> String.replace(~r/\s*\n+\s*/, " ")
    |> String.replace(~r/\s/," ")
  end

  def load_code(data = %PosterData{code_path: code_path}) do
    Logger.debug("Loading code from '#{code_path}'...")
    code = code_path
    |> File.read!
    |> join_code
    |> String.codepoints
    %{data | code: code}
  end

  def load_image(data = %PosterData{image_path: image_path}) do
    Logger.debug("Loading image from '#{image_path}'...")
    {:ok, image} = Imagineer.load(image_path)
    %{data | image: image}
  end

  def construct_text_elements(data = %PosterData{code: code,
                                                 ratio: ratio,
                                                 image: %{width: width, pixels: pixels}}) do
    Logger.debug("Constructing text elements...")
    text_elements = pixels
    |> List.flatten
    |> Enum.zip(code)
    |> Enum.reduce({1, []}, fn
      {pixel, character}, {i, acc} ->
        x = rem(i, width)
        y = div(i, width)
        fill = to_hex(pixel)
        x_dst = x * ratio
        case {x, acc} do
          {1, _acc} ->
            {i + 1, [{:text, %{x: x_dst, y: y, fill: fill}, character} | acc]}
          {_x, [{:text, element = %{fill: ^fill}, text} | tail]} ->
            {i + 1, [{:text, element, text <> character} | tail]}
          {_x, _acc} ->
            {i + 1, [{:text, %{x: x_dst, y: y, fill: fill}, character} | acc]}
        end
    end)
    |> elem(1)
    %{data | text_elements: text_elements}
  end
