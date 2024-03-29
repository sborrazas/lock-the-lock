defmodule LockTheLock.Locks.Lock do
  @moduledoc """
  """

  use GenServer

  alias Phoenix.PubSub
  alias LockTheLock.PubSub, as: LockTheLockPubSub

  @type id :: String.t()
  @type lock :: pid()
  @type lock_timeout :: non_neg_integer()
  @type username :: String.t()
  @type lnumber :: non_neg_integer()
  @type user_id :: non_neg_integer()
  @type handle :: {lock(), user_id()}
  @type lock_data :: %{

  }

  @max_users 32
  @max_user_number 59

  @spec user_id(handle()) :: user_id()
  def user_id({_lock, user_id}), do: user_id

  @spec join(id, username, lock_timeout) :: {:ok, handle(), lock_data()} |
                                            {:error, :too_many_users} |
                                            {:error, :username_taken}
  def join(lock_id, username, timeout) do
    lock =
      case GenServer.start(__MODULE__, {lock_id, timeout}, [name: {:global, lock_id}])  do
        {:ok, pid} ->
          # TODO: Attach to supervisor
          pid
        {:error, {:already_started, pid}} -> pid
      end

    case GenServer.call(lock, {:join, username}) do
      {:ok, user_id, lock_data} -> {:ok, {lock, user_id}, lock_data}
      {:error, reason} -> {:error, reason}
    end
  end

  @spec acquire_lock(handle()) :: {:ok, DateTime.t()} | :already_locked
  def acquire_lock({lock, user_id}) do
    GenServer.call(lock, {:acquire_lock, user_id})
  end

  @spec release_lock(handle()) :: {:ok, DateTime.t()} | :not_locked
  def release_lock({lock, user_id}) do
    GenServer.call(lock, {:release_lock, user_id})
  end

  @spec update_timeout(handle(), lock_timeout()) :: :ok | :already_locked
  def update_timeout({lock, _user_id}, timeout) do
    GenServer.call(lock, {:update_timeout, timeout})
  end

  @spec exit_lock(handle()) :: :ok
  def exit_lock({lock, user_id}) do
    GenServer.cast(lock, {:exit_lock, user_id})
  end

  # GenServer Callbacks
  defmodule LockTheLock.Locks.Lock.State do

    defstruct [:lock_id, :counter, :timeout, :users, :locked_by, :locked_at, :timer]

    alias LockTheLock.Locks.Lock

    @type t :: %__MODULE__{
      lock_id: Lock.id(),
      counter: non_neg_integer(),
      timeout: Lock.timeout(),
      users: [{Lock.user_id(), Lock.username(), Lock.lnumber()}],
      locked_by: Lock.user_id() | nil,
      locked_at: DateTime.t() | nil,
      timer: :timer.tref() | nil
    }
  end

  alias LockTheLock.Locks.Lock.State

  @impl true
  def init({lock_id, timeout}) do
    {:ok, %State{lock_id: lock_id,
                 counter: 0,
                 timeout: timeout,
                 users: [],
                 locked_by: nil,
                 locked_at: nil}}
  end

  @impl true
  def handle_call({:join, _username}, _from, %State{users: users} = state) when length(users) >= @max_users do
    {:reply, {:error, :too_many_users}, state}
  end

  def handle_call({:join, username}, _from, %State{users: users, counter: counter} = state) do
    username_taken? = Enum.any?(users, fn
      {_user_id, ^username, _number} -> true
      {_user_id, _username, _number} -> false
    end)

    if username_taken? do
      {:reply, {:error, :username_taken}, state}
    else
      number = find_available_number(users)
      new_counter = counter + 1
      new_state = %State{
        state |
        counter: new_counter,
        users: [{new_counter, username, number} | users]
      }

      {:reply, {:ok, new_counter, extract_data(new_state)}, new_state}
    end
  end

  def handle_call({:acquire_lock, user_id}, _from, %State{locked_by: nil, timeout: 0} = state) do
    locked_at = DateTime.utc_now()

    {:reply, {:ok, locked_at}, %State{state | locked_by: user_id, locked_at: locked_at}}
  end

  def handle_call({:acquire_lock, user_id}, _from, %State{locked_by: nil, timeout: timeout} = state) do
    locked_at = DateTime.utc_now()
    {:ok, tref} = :timer.send_after(timeout * 1_000, :lock_timeout)

    {:reply, {:ok, locked_at}, %State{state | locked_by: user_id, locked_at: locked_at, timer: tref}}
  end

  def handle_call({:acquire_lock, _user_id}, _from, state) do
    {:reply, :already_locked, state}
  end

  def handle_call({:release_lock, _user_id}, _from, %State{locked_by: nil} = state) do
    {:reply, :not_locked, state}
  end

  def handle_call({:release_lock, user_id}, _from, %State{timer: nil, locked_by: user_id} = state) do
    {:reply, :ok, %State{state | locked_by: nil, locked_at: nil}}
  end

  def handle_call({:release_lock, user_id}, _from, %State{timer: tref, locked_by: user_id} = state) do
    :timer.cancel(tref)

    {:reply, :ok, %State{state | timer: nil, locked_by: nil, locked_at: nil}}
  end

  def handle_call({:release_lock, user_id}, _from, state) do
    {:reply, :not_locked, state}
  end

  def handle_call({:update_timeout, timeout}, _from, %State{locked_by: nil} = state) do
    {:reply, :ok, %State{state | timeout: timeout}}
  end

  def handle_call({:update_timeout, _timeout}, _from, state) do
    {:reply, :already_locked, state}
  end

  @impl true
  def handle_cast({:exit_lock, user_id}, %State{users: users} = state) do
    case Enum.reject(users, fn {id, _username, _number} -> id == user_id end) do
      [] -> # No users left
        {:stop, :normal, %State{state | users: []}}
      new_users ->
        {:noreply, %State{state | users: new_users}}
    end
  end

  @impl true
  def handle_info(:lock_timeout, %State{locked_by: nil} = state) do
    {:noreply, state}
  end

  def handle_info(:lock_timeout, %State{lock_id: lock_id} = state) do
    PubSub.broadcast(LockTheLockPubSub, "locks_internal:#{lock_id}", :lock_timeout)

    {:noreply, %State{state | timer: nil, locked_by: nil, locked_at: nil}}
  end

  defp extract_data(state) do
    state
    |> Map.take([:timeout, :users, :locked_by, :locked_at])
    |> Map.update!(:users, fn users ->
      Enum.map(users, fn {id, username, number} ->
        %{id: id, username: username, number: number}
      end)
    end)
  end

  defp find_available_number(users) do
    taken_numbers = Enum.map(users, fn {_id, _username, number} -> number end)

    1..@max_user_number
    |> Enum.reject(fn n -> Enum.member?(taken_numbers, n) end)
    |> Enum.shuffle()
    |> :erlang.hd()
  end
end
