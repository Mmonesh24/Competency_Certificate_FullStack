using Microsoft.Extensions.Logging;
using System.IO;
using System.Threading.Tasks;

namespace CompetencyCertificate.Services
{
    public class EmailService : IEmailService
    {
        private readonly ILogger<EmailService> _logger;

        public EmailService(ILogger<EmailService> logger)
        {
            _logger = logger;
        }

        public Task SendEmailAsync(string to, string subject, string body)
        {
            _logger.LogInformation("Sending Mock Email to: {To}, Subject: {Subject}", to, subject);
            
            try
            {
                var directoryPath = Path.Combine(Directory.GetCurrentDirectory(), "sent_emails");
                if (!Directory.Exists(directoryPath))
                {
                    Directory.CreateDirectory(directoryPath);
                }

                var filePath = Path.Combine(directoryPath, $"{System.DateTime.UtcNow.Ticks}_email.txt");
                File.WriteAllText(filePath, $"To: {to}\nSubject: {subject}\n\n{body}");
            }
            catch
            {
                // absorb local filesystem errors
            }

            return Task.CompletedTask;
        }
    }
}
