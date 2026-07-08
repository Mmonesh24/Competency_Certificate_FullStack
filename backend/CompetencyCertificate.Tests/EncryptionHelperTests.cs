using Xunit;
using CompetencyCertificate.Services;

namespace CompetencyCertificate.Tests
{
    public class EncryptionHelperTests
    {
        [Fact]
        public void EncryptAndDecrypt_ShouldReturnOriginalString()
        {
            // Arrange
            var originalValue = "1234-5678-9012";

            // Act
            var encrypted = EncryptionHelper.Encrypt(originalValue);
            var decrypted = EncryptionHelper.Decrypt(encrypted);

            // Assert
            Assert.NotEqual(originalValue, encrypted);
            Assert.Equal(originalValue, decrypted);
        }

        [Fact]
        public void Decrypt_ShouldReturnOriginalString_WhenInputIsNotBase64()
        {
            // Arrange
            var rawText = "Plain text string";

            // Act
            var decrypted = EncryptionHelper.Decrypt(rawText);

            // Assert
            Assert.Equal(rawText, decrypted);
        }
    }
}
