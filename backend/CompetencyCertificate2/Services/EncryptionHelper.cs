using System;
using System.IO;
using System.Security.Cryptography;
using System.Text;

namespace CompetencyCertificate.Services
{
    public static class EncryptionHelper
    {
        private static readonly byte[] DefaultKey = Encoding.UTF8.GetBytes("a-very-strong-32-byte-long-key-!"); // Fallback key
        private static readonly byte[] DefaultIv = Encoding.UTF8.GetBytes("a-16-byte-long-i"); // Fallback IV

        private static byte[] GetEncryptionKey()
        {
            var keyStr = Environment.GetEnvironmentVariable("PII_ENCRYPTION_KEY");
            if (string.IsNullOrEmpty(keyStr))
            {
                return DefaultKey;
            }
            var bytes = Encoding.UTF8.GetBytes(keyStr);
            if (bytes.Length == 32) return bytes;

            var paddedBytes = new byte[32];
            Array.Copy(bytes, paddedBytes, Math.Min(bytes.Length, 32));
            return paddedBytes;
        }

        private static byte[] GetEncryptionIv()
        {
            var ivStr = Environment.GetEnvironmentVariable("PII_ENCRYPTION_IV");
            if (string.IsNullOrEmpty(ivStr))
            {
                return DefaultIv;
            }
            var bytes = Encoding.UTF8.GetBytes(ivStr);
            if (bytes.Length == 16) return bytes;

            var paddedBytes = new byte[16];
            Array.Copy(bytes, paddedBytes, Math.Min(bytes.Length, 16));
            return paddedBytes;
        }

        public static string Encrypt(string plainText)
        {
            if (string.IsNullOrEmpty(plainText))
                return plainText;

            try
            {
                using (Aes aesAlg = Aes.Create())
                {
                    aesAlg.Key = GetEncryptionKey();
                    aesAlg.IV = GetEncryptionIv();

                    ICryptoTransform encryptor = aesAlg.CreateEncryptor(aesAlg.Key, aesAlg.IV);

                    using (MemoryStream msEncrypt = new MemoryStream())
                    {
                        using (CryptoStream csEncrypt = new CryptoStream(msEncrypt, encryptor, CryptoStreamMode.Write))
                        {
                            using (StreamWriter swEncrypt = new StreamWriter(csEncrypt))
                            {
                                swEncrypt.Write(plainText);
                            }
                        }
                        return Convert.ToBase64String(msEncrypt.ToArray());
                    }
                }
            }
            catch
            {
                return plainText;
            }
        }

        public static string Decrypt(string cipherText)
        {
            if (string.IsNullOrEmpty(cipherText))
                return cipherText;

            if (!IsBase64String(cipherText))
                return cipherText;

            try
            {
                using (Aes aesAlg = Aes.Create())
                {
                    aesAlg.Key = GetEncryptionKey();
                    aesAlg.IV = GetEncryptionIv();

                    ICryptoTransform decryptor = aesAlg.CreateDecryptor(aesAlg.Key, aesAlg.IV);

                    using (MemoryStream msDecrypt = new MemoryStream(Convert.FromBase64String(cipherText)))
                    {
                        using (CryptoStream csDecrypt = new CryptoStream(msDecrypt, decryptor, CryptoStreamMode.Read))
                        {
                            using (StreamReader srDecrypt = new StreamReader(csDecrypt))
                            {
                                return srDecrypt.ReadToEnd();
                            }
                        }
                    }
                }
            }
            catch
            {
                return cipherText;
            }
        }

        private static bool IsBase64String(string base64String)
        {
            if (string.IsNullOrEmpty(base64String) || base64String.Length % 4 != 0 
                || base64String.Contains(" ") || base64String.Contains("\t") || base64String.Contains("\r") || base64String.Contains("\n"))
                return false;

            try
            {
                Convert.FromBase64String(base64String);
                return true;
            }
            catch
            {
                return false;
            }
        }
    }
}
