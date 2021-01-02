defmodule LockTheLockWeb.API.TokenController do
  use LockTheLockWeb, :controller

  alias Plug.CSRFProtection

  def show(conn, _params) do
    conn
    |> put_status(200)
    |> json(%{"token" => CSRFProtection.get_csrf_token()})
  end
end
