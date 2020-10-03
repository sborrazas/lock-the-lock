# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.

# General application configuration
use Mix.Config

# Configures the endpoint
config :lock_the_lock, LockTheLockWeb.Endpoint,
  url: [host: "localhost"],
  secret_key_base: "m9uyofMZTKL76t+FzUfc8d6XnNAKpCYhNcBdinFRsYkXQ+g3vst/BJF9yFfUoQnW",
  render_errors: [view: LockTheLockWeb.ErrorView, accepts: ~w(html json), layout: false],
  pubsub_server: LockTheLock.PubSub,
  live_view: [signing_salt: "8BSbWv0O"]

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

# Use Jason for JSON parsing in Phoenix
config :phoenix, :json_library, Jason

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{Mix.env()}.exs"
