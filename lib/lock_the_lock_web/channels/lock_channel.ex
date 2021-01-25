defmodule LockTheLockWeb.LockChannel do
  use LockTheLockWeb, :channel

  alias Ecto.Changeset
  alias LockTheLock.Locks
  alias LockTheLock.Locks.Lock
  alias LockTheLock.Services.JoinLock
  alias Phoenix.Socket

  intercept ["user_added"]

  def join("locks:" <> lock_id, params, socket) do
    case JoinLock.run(lock_id, params) do
      {:ok, lock_handle, lock_data} ->
        socket = assign(socket, :lock_handle, lock_handle)
        user_id = Lock.user_id(lock_handle)

        send(self(), {:after_join, user_id, lock_data})

        {:ok, Map.put(lock_data, :user_id, user_id), socket}
      {:error, :not_found} ->
        {:error, %{reason: "not_found"}}
      {:error, changeset} ->
        errors =
          Changeset.traverse_errors(changeset, fn {msg, opts} ->
            msg =
              Enum.reduce(opts, msg, fn {key, value}, acc ->
                String.replace(acc, "%{#{key}}", fn _match -> to_string(value) end)
              end)

            %{message: msg, type: Keyword.get(opts, :validation)}
          end)

        {:error, %{reason: "invalid", errors: errors}}
    end
  end

  def handle_in("acquire_lock", _params, %Socket{assigns: assigns} = socket) do
    lock_handle = assigns.lock_handle

    case Locks.acquire_lock(lock_handle) do
      {:ok, locked_at} ->
        broadcast!(socket, "lock_locked", %{user_id: Lock.user_id(lock_handle), timestamp: locked_at})

        {:noreply, socket}
      :already_locked ->
        {:reply, {:error, %{reason: "already_locked"}}, socket}
    end
  end

  def handle_in("release_lock", _params, %Socket{assigns: assigns} = socket) do
    lock_handle = assigns.lock_handle

    case Locks.release_lock(lock_handle) do
      :ok ->
        broadcast!(socket, "lock_unlocked", %{})

        {:noreply, socket}
      :not_locked ->
        {:reply, {:error, %{reason: "not_locked"}}, socket}
    end
  end

  def handle_in("update_timeout", %{timeout: timeout}, %Socket{assigns: assigns} = socket) do
    lock_handle = assigns.lock_handle

    case Locks.update_timeout(lock_handle, timeout) do
      :ok ->
        broadcast!(socket, "timeout_updated", %{timeout: timeout, user_id: Lock.user_id(lock_handle)})

        {:noreply, socket}
      {:error, reason} ->
        {:reply, {:error, reason}, socket}
    end
  end

  def handle_in("update_timeout", _payload, socket) do
    {:reply, {:error, :invalid_timeout}, socket}
  end

  def handle_in("exit_lock", _params, %Socket{assigns: assigns} = socket) do
    lock_handle = assigns.lock_handle

    Locks.exit_lock(lock_handle)

    {:stop, :left, socket}
  end

  def handle_in(_msg, _params, socket) do
    {:noreply, socket}
  end

  def handle_out("user_added", %{id: user_id} = msg, %Socket{assigns: assigns} = socket) do
    lock_handle = assigns.lock_handle

    case Lock.user_id(lock_handle) do
      ^user_id ->
        {:noreply, socket}
      _another_user_id ->
        push(socket, "user_added", msg)

        {:noreply, socket}
    end
  end

  def handle_info({:after_join, user_id, %{users: users}}, socket) do
    %{username: username, number: number} = Enum.find(users, fn
      %{id: ^user_id} -> true
      %{} -> false
    end)

    broadcast!(socket, "user_added", %{id: user_id, username: username, number: number})

    {:noreply, socket}
  end

  def terminate({:shutdown, :closed}, %Socket{assigns: assigns} = socket) do
    lock_handle = assigns.lock_handle

    Locks.exit_lock(lock_handle)

    broadcast!(socket, "user_removed", %{id: Lock.user_id(lock_handle)})
  end
end
