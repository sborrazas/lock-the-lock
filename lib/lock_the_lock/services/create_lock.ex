defmodule LockTheLock.Services.CreateLock do

  alias Ecto.Changeset

  @spec run(map()) :: {:ok, map()} | {:error, Changeset.t()}
  def run(params) do
    {:ok, %{}}
  end
end
