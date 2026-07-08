using CompetencyCertificate.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CompetencyCertificate.Services
{
    public interface IMasterDataService
    {
        Task<DepartmentDto?> GetDepartmentByIdAsync(string id);
        Task<IEnumerable<DepartmentDto>> GetAllDepartmentsAsync();
        Task<bool> AddDepartmentAsync(DepartmentDto dto);
        Task<bool> UpdateDepartmentAsync(string id, DepartmentDto dto);
        Task<bool> DeleteDepartmentAsync(string id);
        Task<int> GetCountDepartmentsAsync();

        Task<SubDepartmentDto?> GetSubDepartmentByNameAsync(string subDeptName);
        Task<IEnumerable<SubDepartmentDto>> GetSubDepartmentsByDepartmentIdAsync(string departmentId);
        Task<bool> AddSubDepartmentAsync(SubDepartmentDto dto);
        Task<bool> UpdateSubDepartmentAsync(string subDeptName, SubDepartmentDto dto);
        Task<int> GetCountSubDepartmentsAsync();

        Task<DesignationDto?> GetDesignationByNameAsync(string name);
        Task<IEnumerable<DesignationDto>> GetAllDesignationsAsync();
        Task<IEnumerable<DesignationDto>> GetDesignationsByTypeAsync(string type);
        Task<bool> AddDesignationAsync(DesignationDto dto);
        Task<bool> UpdateDesignationAsync(string id, DesignationDto dto);
        Task<bool> DeleteDesignationAsync(string id);
        Task<int> GetCountDesignationsAsync();
    }
}
