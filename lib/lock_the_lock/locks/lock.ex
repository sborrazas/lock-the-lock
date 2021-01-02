defmodule LockTheLock.Locks.Lock do

  @derive Jason.Encoder
  defstruct [:id, :username, :index, :timeout]

  @type id :: <<>>

  @type t :: %__MODULE__{
    id: id,
    username: String.t(),
    index: non_neg_integer(),
    timeout: non_neg_integer()
  }

end
