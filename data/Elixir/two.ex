defmodule Openmaize.Authenticate do
  import Plug.Conn
  alias Openmaize.Config

  @behaviour Plug

  @doc false
  def init(opts) do
    {Keyword.get(opts, :repo, Openmaize.Utils.default_repo),
    Keyword.get(opts, :user_model, Openmaize.Utils.default_user_model)}
  end

  @doc false
  def call(conn, {repo, user_model}) do
    get_session(conn, :user_id) |> get_user(conn, repo, user_model)
  end

  defp get_user(nil, conn, _, _), do: assign(conn, :current_user, nil)
  defp get_user(id, conn, repo, user_model) do
    repo.get(user_model, id) |> set_current_user(conn)
  end

  defp set_current_user(nil, conn), do: assign(conn, :current_user, nil)
  defp set_current_user(user, conn) do
    user = Map.drop(user, Config.drop_user_keys)
    assign(conn, :current_user, user)
  end

  defp get_session(conn, key) do
    conn
    |> get_session
    |> Map.get(key)
  end

  defp reset_session(conn, key) do
    # TODO
  end
end
