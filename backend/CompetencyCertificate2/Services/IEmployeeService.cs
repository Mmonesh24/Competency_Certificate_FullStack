using CompetencyCertificate.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CompetencyCertificate.Services
{
    public interface IEmployeeService
    {
        Task<EmployeeDto?> GetEmployeeByIdAsync(string id);
        Task<IEnumerable<EmployeeDto>> GetAllEmployeesAsync();
        Task<PagedResultDto<EmployeeDto>> GetPagedEmployeesAsync(int pageNumber, int pageSize);
        Task<bool> AddEmployeeAsync(EmployeeCreateDto dto);
        Task<bool> UpdateEmployeeAsync(string id, EmployeeUpdateDto dto);
        Task<bool> DeleteEmployeeAsync(string id);
        Task<int> GetCountEmployeesAsync();
        Task<int> GetCountEmployeesByDepartmentAsync(string departmentId);
        Task<int> GetCountEmployeesBySubDepartmentAsync(string subDepartmentId);
        Task<IEnumerable<EmployeeDto>> GetEmployeesByDepartmentAsync(string departmentId);
        Task<IEnumerable<EmployeeDto>> GetEmployeesBySubDepartmentAsync(string subDepartmentId);
    }
}
