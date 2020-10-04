defmodule LockTheLockWeb.Router do
  use LockTheLockWeb, :router

  pipeline :api do
    plug :accepts, ["json"]
    plug :protect_from_forgery
    plug :put_secure_browser_headers
  end

  scope "/", LockTheLockWeb do
    pipe_through :api
  end
end
