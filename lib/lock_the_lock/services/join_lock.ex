defmodule LockTheLock.Services.JoinLock do

  use Ecto.Schema
  import Ecto.Changeset

  alias Ecto.Changeset
  alias LockTheLock.Locks
  alias LockTheLock.Locks.Lock

  embedded_schema do
    field(:username, :string)
  end

  @required_fields ~w(username)a
  @optional_fields ~w()a

  @max_username_length 32

  @spec run(Lock.id(), map()) :: {:ok, Lock.handle(), Lock.lock_data()} | {:error, :not_found | Changeset.t()}
  def run(lock_id, params) do
    %__MODULE__{}
    |> cast(params, @required_fields ++ @optional_fields)
    |> validate_required(@required_fields)
    |> validate_length(:username, min: 2, max: @max_username_length)
    |> join_lock(lock_id)
  end

  defp join_lock(%Changeset{valid?: false} = changeset, _lock_id), do: {:error, changeset}

  defp join_lock(changeset, lock_id) do
    %__MODULE__{
      username: username
    } = Changeset.apply_changes(changeset)

    case Locks.join(lock_id, username) do
      {:ok, lock_handle, lock_data} -> {:ok, lock_handle, lock_data}
      {:error, :too_many_users} -> {:error, Changeset.add_error(changeset, :base, "too many users in this lock already", [validation: :too_many_users])}
      {:error, :username_taken} -> {:error, Changeset.add_error(changeset, :username, "must be unique", [validation: :unique])}
      {:error, :not_found} -> {:error, :not_found}
    end
  end
end
