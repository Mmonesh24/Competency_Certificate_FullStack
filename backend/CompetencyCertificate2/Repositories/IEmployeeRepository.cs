using CompetencyCertificate.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CompetencyCertificate.Repositories
{
    public interface IEmployeeRepository : IGenericRepository<Employee>
    {
        Task<Employee?> GetEmployeeWithRelationsAsync(string id);
        Task<IEnumerable<Employee>> GetAllEmployeesWithRelationsAsync();
    }
}
