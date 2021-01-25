defmodule LockTheLockWeb.API.FallbackController do
  @moduledoc """
  Translates controller action results into valid `Plug.Conn` responses.
  See `Phoenix.Controller.action_fallback/1` for more details.
  """
  use LockTheLockWeb, :controller

  alias Ecto.Changeset

  def call(conn, {:error, changeset}) do
    errors =
      Changeset.traverse_errors(changeset, fn {msg, opts} ->
        msg =
          Enum.reduce(opts, msg, fn {key, value}, acc ->
            String.replace(acc, "%{#{key}}", fn _match -> to_string(value) end)
          end)

        %{message: msg, type: Keyword.get(opts, :validation)}
      end)

    conn
    |> put_status(:unprocessable_entity)
    |> json(errors)
  end
end
