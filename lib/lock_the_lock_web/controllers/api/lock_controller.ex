defmodule LockTheLockWeb.API.LockController do
  use LockTheLockWeb, :controller

  action_fallback(LockTheLockWeb.API.FallbackController)

  alias LockTheLock.Services.CreateLock

  def create(conn, params) do
    with {:ok, lock_id} <- CreateLock.run(params) do
      conn
      |> put_status(201)
      |> json(%{"id" => lock_id})
    end
  end
end
