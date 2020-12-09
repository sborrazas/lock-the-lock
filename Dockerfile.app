FROM elixir:1.11.1

# Install hex
RUN mix local.hex --force

# Install rebar
RUN mix local.rebar --force

# Add github as authorized host
RUN mkdir -p ~/.ssh && ssh-keyscan -t rsa github.com >> ~/.ssh/known_hosts

# Install inotify-tools
RUN apt-get update && \
  apt-get install -y inotify-tools
