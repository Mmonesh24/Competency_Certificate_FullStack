using CompetencyCertificate.DTOs;
using System.Threading.Tasks;

namespace CompetencyCertificate.Services
{
    public interface IAuthService
    {
        Task<LoginResponseDto?> LoginAsync(LoginRequestDto request);
        Task<bool> RegisterEmployeeAsync(EmployeeRegisterDto request);
        Task<bool> RegisterHRAsync(HRRegisterDto request);
        Task<bool> DeleteEmployeeLoginAsync(string id);
    }
}
