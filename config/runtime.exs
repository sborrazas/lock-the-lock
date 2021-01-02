import Config

env = config_env()
debug? = env in [:test, :dev]

# lock_the_lock
config :lock_the_lock,
  locks_secret_key: System.fetch_env!("LOCK_THE_LOCK_LOCKS_SECRET_KEY")

config :lock_the_lock, LockTheLockWeb.Endpoint,
  url: [host: System.fetch_env!("APP_HOST")],
  secret_key_base: System.fetch_env!("APP_SECRET_KEY_BASE"),
  render_errors: [view: LockTheLockWeb.ErrorView, accepts: ~w(html json), layout: false],
  pubsub_server: LockTheLock.PubSub,
  http: [
    port: String.to_integer(System.fetch_env!("APP_PORT")),
    transport_options: [socket_opts: [:inet6]]
  ]
