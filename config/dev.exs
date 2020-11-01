use Mix.Config

# lock_the_lock
config :lock_the_lock, LockTheLockWeb.Endpoint,
  live_reload: [
    patterns: [
      ~r"priv/static/.*(js|css|png|jpeg|jpg|gif|svg)$",
      ~r"priv/gettext/.*(po)$",
      ~r"lib/lock_the_lock_web/(live|views)/.*(ex)$",
      ~r"lib/lock_the_lock_web/templates/.*(eex)$"
    ]
  ]

# logger
config :logger, :console, format: "[$level] $message\n"

# phoenix
config :phoenix,
  stacktrace_depth: 20,
  plug_init_mode: :runtime
