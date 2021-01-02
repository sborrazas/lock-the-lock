use Mix.Config

# lock_the_lock
config :lock_the_lock, LockTheLockWeb.Endpoint,
  debug_errors: true,
  code_reloader: true,
  reloadable_compilers: [:phoenix, :elixir],
  reloadable_apps: [:lock_the_lock],
  live_reload: [
    patterns: [
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
