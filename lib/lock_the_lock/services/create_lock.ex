defmodule LockTheLock.Services.CreateLock do

  use Ecto.Schema
  import Ecto.Changeset

  alias Ecto.Changeset
  alias LockTheLock.Locks
  alias LockTheLock.Locks.Lock
  alias LockTheLock.Locks.Timeout

  embedded_schema do
    field(:username, :string)
    field(:timeout, :integer)
  end

  @required_fields ~w(username timeout)a
  @optional_fields ~w()a

  @timeout_format Timeout.format()
  @max_username_length 32
  @max_timeout 10 * 60 # 10mins

  @spec run(map()) :: {:ok, Lock.t()} | {:error, Changeset.t()}
  def run(params) do
    IO.inspect(params)
    res = %__MODULE__{}
    |> cast(params, @required_fields ++ @optional_fields)
    |> validate_required(@required_fields)
    |> validate_length(:username, min: 2, max: @max_username_length)
    |> validate_number(:timeout, min: 0, max: @max_timeout)
    |> create_lock()
  end

  def create_lock(%Changeset{valid?: false} = changeset), do: {:error, changeset}

  def create_lock(changeset) do
    %__MODULE__{
      username: username,
      timeout: timeout
    } = Changeset.apply_changes(changeset)

    {:ok, Locks.create(username, timeout)}
  end
end
