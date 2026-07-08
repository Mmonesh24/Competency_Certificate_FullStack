using CompetencyCertificate.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CompetencyCertificate.Repositories
{
    public interface ICertificateRepository
    {
        Task<Generated?> GetGeneratedWithEmployeeAsync(string employeeId);
        Task<IEnumerable<Generated>> GetAllGeneratedWithEmployeeAsync();
        Task<IEnumerable<Initiate>> GetAllInitiateWithEmployeeAsync();
    }
}
