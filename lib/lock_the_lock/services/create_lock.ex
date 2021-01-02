defmodule LockTheLock.Services.CreateLock do

  use Ecto.Schema
  import Ecto.Changeset

  alias Ecto.Changeset
  alias LockTheLock.Locks
  alias LockTheLock.Locks.Lock
  alias LockTheLock.Locks.Timeout

  embedded_schema do
    field(:username, :string)
    field(:timeout, :string)
  end

  @required_fields ~w(username)a
  @optional_fields ~w(timeout)a

  @timeout_format Timeout.format()
  @max_username_length 32

  @spec run(map()) :: {:ok, Lock.t()} | {:error, Changeset.t()}
  def run(params) do
    IO.inspect(params)
    res = %__MODULE__{}
    |> cast(params, @required_fields ++ @optional_fields)
    |> validate_required(@required_fields)
    |> validate_length(:username, min: 2, max: @max_username_length)
    |> validate_format(:timeout, @timeout_format)
    |> validate_change(:timeout, fn
      :timeout, "00:00" -> [timeout: "can't be zero"]
      :timeout, _timeout -> []
    end)

    IO.inspect([params, res])

    res
    |> create_lock()
  end

  def create_lock(%Changeset{valid?: false} = changeset), do: {:error, changeset}

  def create_lock(changeset) do
    %__MODULE__{
      username: username,
      timeout: timeout
    } = Changeset.apply_changes(changeset)

    create_lock(username, timeout)
  end

  def create_lock(username, nil), do: {:ok, Locks.create(username)}

  def create_lock(username, timeout), do: {:ok, Locks.create(username, Timeout.parse(timeout))}

end
