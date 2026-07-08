using System.Threading.Tasks;

namespace CompetencyCertificate.Services
{
    public interface IAiService
    {
        Task<string> AssessCompetencyAsync(string designation, string department, string safetyScore, string remarks);
        Task<string> ParseDocumentAsync(string base64Image, string mimeType);
        Task<string> AskChatbotAsync(string userMessage, string context);
    }
}
