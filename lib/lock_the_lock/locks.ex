defmodule LockTheLock.Locks do

  alias LockTheLock.Locks.Lock

  @type lock_id :: <<>>

  @block_cipher :aes_gcm
  @aad "AES256GCM"
  @iv_size 16
  @tag_size 16

  @spec create(String.t()) :: Lock.t()
  def create(username) do
    now = DateTime.utc_now()
    datetime = now |> DateTime.to_unix() |> :binary.encode_unsigned()
    text = datetime

    id = Crypto.encrypt(locks_secret_key(), text, @iv_size, @tag_size)

    %Lock{
      id: id,
      username: username,
      index: :rand.uniform(0, 31)
    }
  end

  @spec create(String.t(), Timeout.t()) :: Lock.t()
  def create(username, timeout) do
    locks_secret_key = Application.fetch_env!(:lock_the_lock, :locks_secret_key)

    lock = create(username)

    %Lock{
      lock |
      timeout: timeout
    }
  end

  defp encrypt(key, text) do
    iv = :crypto.strong_rand_bytes(@iv_size)

    {ciphertext, ciphertag} =
      :crypto.block_encrypt(@block_cipher, key, iv, {@aad, text, @tag_size})

    iv <> ciphertag <> ciphertext
  end

  defp locks_secret_key, do: Application.fetch_env!(:lock_the_lock, :locks_secret_key)

end
