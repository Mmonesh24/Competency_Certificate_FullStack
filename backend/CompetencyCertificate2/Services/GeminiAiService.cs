using Microsoft.Extensions.Configuration;
using System;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace CompetencyCertificate.Services
{
    public class GeminiAiService : IAiService
    {
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _configuration;

        public GeminiAiService(HttpClient httpClient, IConfiguration configuration)
        {
            _httpClient = httpClient;
            _configuration = configuration;
        }

        private string GetApiKey()
        {
            return Environment.GetEnvironmentVariable("GEMINI_API_KEY") 
                ?? _configuration["AppSettings:GeminiApiKey"] 
                ?? "";
        }

        public async Task<string> AssessCompetencyAsync(string designation, string department, string safetyScore, string remarks)
        {
            var apiKey = GetApiKey();
            if (string.IsNullOrEmpty(apiKey))
            {
                return "AI Competency Assessment requires a GEMINI_API_KEY env variable configuration.";
            }

            var prompt = $"Analyze competency for an employee with the following details:\n" +
                         $"- Designation: {designation}\n" +
                         $"- Department: {department}\n" +
                         $"- Safety Compliance Score: {safetyScore}/100\n" +
                         $"- Special Remarks: {remarks}\n\n" +
                         $"Provide a professional competency evaluation. Outline: 1. Core strengths, 2. Potential areas of improvement, and 3. Recommended safety and skill development training pathways. Output in clean Markdown.";

            return await CallGeminiApiAsync(prompt, apiKey);
        }

        public async Task<string> ParseDocumentAsync(string base64Image, string mimeType)
        {
            var apiKey = GetApiKey();
            if (string.IsNullOrEmpty(apiKey))
            {
                return "{\"error\": \"AI Document Processing requires a GEMINI_API_KEY env variable configuration.\"}";
            }

            var prompt = "You are a secure, high-precision document data extractor. Analyze the attached image (which is a bank passbook or identity card) and extract the following details if present:\n" +
                         "- BankName\n" +
                         "- BankAccountNumber\n" +
                         "- AadharNo\n\n" +
                         "Return only a raw, valid JSON object containing these keys. Do not include markdown wraps, code block wraps, or any conversational text. Example format:\n" +
                         "{\"BankName\": \"HDFC Bank\", \"BankAccountNumber\": \"501002345678\", \"AadharNo\": \"123456789012\"}\n" +
                         "If a field is missing, set its value to empty string.";

            return await CallGeminiMultimodalApiAsync(prompt, base64Image, mimeType, apiKey);
        }

        public async Task<string> AskChatbotAsync(string userMessage, string context)
        {
            var apiKey = GetApiKey();
            if (string.IsNullOrEmpty(apiKey))
            {
                return "AI Assistant Chatbot requires a GEMINI_API_KEY env variable configuration.";
            }

            var prompt = $"You are a helpful, expert AI compliance assistant for the Chennai Metro Rail Limited (CMRL) Competency Certificate Management System.\n" +
                         $"System Context:\n{context}\n\n" +
                         $"User message: {userMessage}\n\n" +
                         $"Please answer the query accurately, keeping safety compliance, contractor protocols, and CMRL standards in mind.";

            return await CallGeminiApiAsync(prompt, apiKey);
        }

        private async Task<string> CallGeminiApiAsync(string prompt, string apiKey)
        {
            var url = $"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={apiKey}";
            var payload = new
            {
                contents = new[]
                {
                    new
                    {
                        parts = new[]
                        {
                            new { text = prompt }
                        }
                    }
                }
            };

            var jsonPayload = JsonSerializer.Serialize(payload);
            var content = new StringContent(jsonPayload, Encoding.UTF8, "application/json");

            try
            {
                var response = await _httpClient.PostAsync(url, content);
                response.EnsureSuccessStatusCode();

                var responseContent = await response.Content.ReadAsStringAsync();
                using (var doc = JsonDocument.Parse(responseContent))
                {
                    var text = doc.RootElement
                        .GetProperty("candidates")[0]
                        .GetProperty("content")
                        .GetProperty("parts")[0]
                        .GetProperty("text")
                        .GetString();
                    return text ?? "Failed to extract response.";
                }
            }
            catch (Exception ex)
            {
                return $"Error communicating with Gemini: {ex.Message}";
            }
        }

        private async Task<string> CallGeminiMultimodalApiAsync(string prompt, string base64Data, string mimeType, string apiKey)
        {
            var url = $"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={apiKey}";
            
            if (base64Data.Contains(","))
            {
                base64Data = base64Data.Split(',')[1];
            }

            var payload = new
            {
                contents = new[]
                {
                    new
                    {
                        parts = new object[]
                        {
                            new { text = prompt },
                            new
                            {
                                inlineData = new
                                {
                                    mimeType = mimeType,
                                    data = base64Data
                                }
                            }
                        }
                    }
                }
            };

            var jsonPayload = JsonSerializer.Serialize(payload);
            var content = new StringContent(jsonPayload, Encoding.UTF8, "application/json");

            try
            {
                var response = await _httpClient.PostAsync(url, content);
                response.EnsureSuccessStatusCode();

                var responseContent = await response.Content.ReadAsStringAsync();
                using (var doc = JsonDocument.Parse(responseContent))
                {
                    var text = doc.RootElement
                        .GetProperty("candidates")[0]
                        .GetProperty("content")
                        .GetProperty("parts")[0]
                        .GetProperty("text")
                        .GetString();
                    return text ?? "{}";
                }
            }
            catch (Exception ex)
            {
                return $"{{\"error\": \"Failed to call Gemini: {ex.Message}\"}}";
            }
        }
    }
}
