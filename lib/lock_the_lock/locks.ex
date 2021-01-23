defmodule LockTheLock.Locks do
  @moduledoc """
  """

  alias LockTheLock.Locks.Lock

  @block_cipher :aes_gcm
  @aad "AES256GCM"
  @iv_size 4
  @tag_size 4

  @spec create_id(Lock.timeout()) :: Lock.id()
  def create_id(timeout) do
    datetime = DateTime.utc_now() |> DateTime.to_unix() |> :binary.encode_unsigned()
    timeout = timeout |> :binary.encode_unsigned()

    encrypt("#{datetime}#{timeout}")
  end

  @spec join(Lock.id(), Lock.username()) :: {:ok, Lock.handle(), Lock.lock_data()} |
                                            {:error, :not_found} |
                                            {:error, :too_many_users} |
                                            {:error, :username_taken}
  def join(lock_id, username) do
    case decrypt(lock_id) do
      {:ok, timeout} ->
        case Lock.join(lock_id, username, timeout) do
          {:ok, handle, lock_data} -> {:ok, handle, lock_data}
          {:error, :too_many_users} -> {:error, :too_many_users}
          {:error, :username_taken} -> {:error, :username_taken}
        end
      :error ->
        {:error, :not_found}
    end
  end

  @spec acquire_lock(Lock.handle()) :: {:ok, DateTime.t()} | :already_locked
  def acquire_lock(handle) do
    Lock.acquire_lock(handle)
  end

  @spec release_lock(Lock.handle()) :: {:ok, DateTime.t()}
  def release_lock(handle) do
    Lock.release_lock(handle)
  end

  @spec update_timeout(Lock.handle(), Lock.timeout()) :: :ok | :already_locked
  def update_timeout(handle, timeout) do
    Lock.update_timeout(handle, timeout)
  end

  @spec exit_lock(Lock.handle()) :: :ok
  def exit_lock(handle) do
    Lock.exit_lock(handle)
  end

  defp encrypt(text) do
    key = locks_secret_key()
    iv = :crypto.strong_rand_bytes(@iv_size)

    {ciphertext, ciphertag} =
      :crypto.block_encrypt(@block_cipher, key, iv, {@aad, text, @tag_size})

    (iv <> ciphertag <> ciphertext) |> Base.url_encode64(padding: false)
  end

  defp decrypt(encoded_lock_id) do
    key = locks_secret_key()

    with {:ok, <<iv::binary-size(@iv_size), tag::binary-size(@tag_size), ciphertext::binary>>} <-
           Base.url_decode64(encoded_lock_id, padding: false),
         text when is_binary(text) <-
           :crypto.block_decrypt(@block_cipher, key, iv, {@aad, ciphertext, tag}) do

      <<created_at::binary-size(4), timeout::binary>> = text
      _created_at = :binary.decode_unsigned(created_at)
      timeout = :binary.decode_unsigned(timeout)

      {:ok, timeout}
    else
      {:ok, _invalid_decoded} -> :error
      :error -> :error
    end
  end

  defp locks_secret_key do
    Application.fetch_env!(:lock_the_lock, :locks_secret_key) |> Base.decode64!()
  end
end
