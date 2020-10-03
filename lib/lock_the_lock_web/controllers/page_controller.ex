defmodule LockTheLockWeb.PageController do
  use LockTheLockWeb, :controller

  def index(conn, _params) do
    render(conn, "index.html")
  end
end
