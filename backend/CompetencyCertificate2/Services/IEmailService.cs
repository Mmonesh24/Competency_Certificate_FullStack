using System.Threading.Tasks;

namespace CompetencyCertificate.Services
{
    public interface IEmailService
    {
        Task SendEmailAsync(string to, string subject, string body);
    }
}
