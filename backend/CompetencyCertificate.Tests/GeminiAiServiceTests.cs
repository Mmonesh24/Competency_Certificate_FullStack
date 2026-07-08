using Moq;
using Moq.Protected;
using System;
using System.Net;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using Xunit;
using CompetencyCertificate.Services;
using Microsoft.Extensions.Configuration;

namespace CompetencyCertificate.Tests
{
    public class GeminiAiServiceTests
    {
        [Fact]
        public async Task AssessCompetencyAsync_ShouldReturnResponse_WhenApiSucceeds()
        {
            // Arrange
            var mockHandler = new Mock<HttpMessageHandler>(MockBehavior.Strict);
            var mockResponseJson = "{\"candidates\":[{\"content\":{\"parts\":[{\"text\":\"Mock Evaluation Result\"}]}}]}";

            mockHandler
                .Protected()
                .Setup<Task<HttpResponseMessage>>(
                    "SendAsync",
                    ItExpr.IsAny<HttpRequestMessage>(),
                    ItExpr.IsAny<CancellationToken>()
                )
                .ReturnsAsync(new HttpResponseMessage
                {
                    StatusCode = HttpStatusCode.OK,
                    Content = new StringContent(mockResponseJson, System.Text.Encoding.UTF8, "application/json")
                });

            var httpClient = new HttpClient(mockHandler.Object);
            var mockConfig = new Mock<IConfiguration>();

            var service = new GeminiAiService(httpClient, mockConfig.Object);

            Environment.SetEnvironmentVariable("GEMINI_API_KEY", "test-api-key");

            // Act
            var result = await service.AssessCompetencyAsync("Safety Officer", "Operations", "95", "Highly vigilant");

            // Assert
            Assert.Contains("Mock Evaluation Result", result);
        }

        [Fact]
        public async Task ParseDocumentAsync_ShouldReturnJson_WhenApiSucceeds()
        {
            // Arrange
            var mockHandler = new Mock<HttpMessageHandler>(MockBehavior.Strict);
            var mockResponseJson = "{\"candidates\":[{\"content\":{\"parts\":[{\"text\":\"{\\\"BankName\\\":\\\"HDFC\\\",\\\"BankAccountNumber\\\":\\\"123\\\"}\"}]}}]}";

            mockHandler
                .Protected()
                .Setup<Task<HttpResponseMessage>>(
                    "SendAsync",
                    ItExpr.IsAny<HttpRequestMessage>(),
                    ItExpr.IsAny<CancellationToken>()
                )
                .ReturnsAsync(new HttpResponseMessage
                {
                    StatusCode = HttpStatusCode.OK,
                    Content = new StringContent(mockResponseJson, System.Text.Encoding.UTF8, "application/json")
                });

            var httpClient = new HttpClient(mockHandler.Object);
            var mockConfig = new Mock<IConfiguration>();

            var service = new GeminiAiService(httpClient, mockConfig.Object);

            Environment.SetEnvironmentVariable("GEMINI_API_KEY", "test-api-key");

            // Act
            var result = await service.ParseDocumentAsync("base64data", "image/png");

            // Assert
            Assert.Contains("HDFC", result);
        }
    }
}
