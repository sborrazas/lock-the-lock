defmodule LockTheLockWeb.Router do
  use LockTheLockWeb, :router

  pipeline :api do
    plug :accepts, ["json"]
    plug :fetch_session
    plug :protect_from_forgery
    plug :put_secure_browser_headers
  end

  scope "/api", LockTheLockWeb.API do
    pipe_through :api

    resources "/token", TokenController, singleton: true, only: [:show]

    resources "/locks", LockController, only: [:create]
  end

  scope "/", LockTheLockWeb do
    get("/:lock_id", PageController, :index)
  end
end
