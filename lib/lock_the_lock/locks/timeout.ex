defmodule LockTheLock.Locks.Timeout do

  defstruct [:minutes, :seconds]

  @type t :: %__MODULE__{
    minutes: non_neg_integer(),
    seconds: non_neg_integer()
  }

  @format ~r/\A(\d\d):(\d\d)\z/

  @spec format() :: Regex.t()
  def format, do: @format

  @spec parse(String.t()) :: %__MODULE__{}
  def parse(text) do
    [[_match, minutes, seconds]] = Regex.scan(@format, text)

    %__MODULE__{
      minutes: String.to_integer(minutes),
      seconds: String.to_integer(seconds)
    }
  end
end
