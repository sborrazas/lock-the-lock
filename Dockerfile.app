FROM elixir:1.10.4

# Install hex
RUN mix local.hex --force

# Install rebar
RUN mix local.rebar --force

# Add github as authorized host
RUN mkdir -p ~/.ssh && ssh-keyscan -t rsa github.com >> ~/.ssh/known_hosts
