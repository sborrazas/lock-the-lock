defmodule LockTheLockWeb.PageController do
  use LockTheLockWeb, :controller

  def index(conn, _params) do
    conn
    |> put_resp_header("content-type", "text/html; charset=utf-8")
    |> Plug.Conn.send_file(200, Application.app_dir(:lock_the_lock, "priv/static/index.html"))
  end
end
