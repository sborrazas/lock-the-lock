use Mix.Config

# lock_the_lock
config :lock_the_lock, LockTheLockWeb.Endpoint,
  cache_static_manifest: "priv/static/cache_manifest.json",
  check_origin: true,
  server: true

# logger
config :logger, level: :info
