import Config

env = config_env()
debug? = env in [:test, :dev]

# lock_the_lock
config :lock_the_lock, LockTheLockWeb.Endpoint,
  url: [host: System.fetch_env!("APP_HOST")],
  secret_key_base: System.fetch_env!("APP_SECRET_KEY_BASE"),
  render_errors: [view: LockTheLockWeb.ErrorView, accepts: ~w(html json), layout: false],
  pubsub_server: LockTheLock.PubSub,
  http: [
    port: String.to_integer(System.fetch_env!("APP_PORT")),
    transport_options: [socket_opts: [:inet6]]
  ]

if debug? do
  config :lock_the_lock, LockTheLockWeb.Endpoint,
    debug_errors: true,
    code_reloader: true
else
  config :lock_the_lock, LockTheLockWeb.Endpoint,
    cache_static_manifest: "priv/static/cache_manifest.json",
    check_origin: true,
    server: true
end
