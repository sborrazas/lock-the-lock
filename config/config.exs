use Mix.Config

# logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

# phoenix
config :phoenix, :json_library, Jason

import_config "#{Mix.env()}.exs"
