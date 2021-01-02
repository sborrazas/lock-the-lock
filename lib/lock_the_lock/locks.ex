defmodule LockTheLock.Locks do

  alias LockTheLock.Locks.Lock

  @type lock_id :: <<>>

  @block_cipher :aes_gcm
  @aad "AES256GCM"
  @iv_size 4
  @tag_size 4

  @spec create(String.t(), non_neg_integer()) :: Lock.t()
  def create(username, timeout) do
    now = DateTime.utc_now()
    datetime = now |> DateTime.to_unix() |> :binary.encode_unsigned()
    text = "#{datetime}#{timeout}"

    %Lock{
      id: encrypt(text),
      username: username,
      index: :rand.uniform(31),
      timeout: timeout
    }
  end

  defp encrypt(text) do
    key = locks_secret_key()
    iv = :crypto.strong_rand_bytes(@iv_size)

    {ciphertext, ciphertag} =
      :crypto.block_encrypt(@block_cipher, key, iv, {@aad, text, @tag_size})

    (iv <> ciphertag <> ciphertext) |> Base.url_encode64(padding: false)
  end

  defp locks_secret_key do
    Application.fetch_env!(:lock_the_lock, :locks_secret_key) |> Base.decode64!()
  end

end
