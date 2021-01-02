defmodule LockTheLockWeb.API.LockController do
  use LockTheLockWeb, :controller

  action_fallback(LockTheLockWeb.API.FallbackController)

  alias LockTheLock.Services.CreateLock

  def create(conn, params) do
    with {:ok, lock} <- CreateLock.run(params) do
      conn
      |> put_status(201)
      |> json(lock)
    end
  end
end
