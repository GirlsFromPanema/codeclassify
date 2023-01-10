defmodule Ecto.Rut do
  defmacro __using__(opts \\ []) do
    quote bind_quoted: [opts: opts] do
      @model  opts[:model] || __MODULE__
      @app    opts[:app]   || @model |> Module.split |> Enum.drop(-1) |> Module.concat
      @repo   opts[:repo]  || @app |> Module.concat("Repo")

      def changeset(struct, params) do
        Ecto.Changeset.cast(struct, params, [])
      end

      defoverridable [changeset: 2]

      def all,                  do: call(:all,        [@model])
      def delete_all,           do: call(:delete_all, [@model])

      def get(id),              do: call(:get,        [@model, id])
      def get!(id),             do: call(:get!,       [@model, id])

      def get_by(clauses),      do: call(:get_by,     [@model, clauses])
      def get_by!(clauses),     do: call(:get_by!,    [@model, clauses])

      def delete(struct),       do: call(:delete,     [struct])
      def delete!(struct),      do: call(:delete!,    [struct])

      Enum.each [:insert, :insert!], fn method ->
        def unquote(method)(%{__struct__: Ecto.Changeset} = changeset) do
          call(unquote(method), [changeset])
        end

        def unquote(method)(%{__struct__: @model} = struct) do
          struct
          |> Map.from_struct
          |> unquote(method)()
        end

        def unquote(method)(map) when is_map(map) do
          @model
          |> Kernel.struct
          |> changeset(map)
          |> unquote(method)()
        end

        def unquote(method)(keywords) do
          keywords
          |> ExUtils.Keyword.to_map
          |> unquote(method)()
        end
      end

      Enum.each [:update, :update!], fn method ->
        def unquote(method)(%{__struct__: Ecto.Changeset} = changeset) do
          call(unquote(method), [changeset])
        end

        def unquote(method)(%{__struct__: @model} = struct, new \\ nil) do
          [struct, map] =
            cond do
              is_nil(new)               -> [get!(struct.id), Map.from_struct(struct)]
              ExUtils.is_struct?(new)   -> [struct, Map.from_struct(new)]
              ExUtils.is_pure_map?(new) -> [struct, new]
              Keyword.keyword?(new)     -> [struct, ExUtils.Keyword.to_map(new)]
            end

          struct
          |> changeset(map)
          |> unquote(method)()
        end
      end

      defp call(method, args \\ []) do
        apply(@repo, method, args)
      end
    end
  end
