defmodule LockTheLock.Locks.Lock do

  alias LockTheLock.Locks.Timeout

  defstruct [:id, :username, :index]

  @type id :: <<>>

  @type t :: %__MODULE__{
    id: id,
    username: String.t(),
    index: non_neg_integer(),
    timeout: Timeout.t() | nil
  }

end
