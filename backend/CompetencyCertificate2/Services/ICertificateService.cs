using CompetencyCertificate.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CompetencyCertificate.Services
{
    public interface ICertificateService
    {
        Task<bool> AddInitiateAsync(CertificateInitiateDto dto);
        Task<IEnumerable<InitiateListDto>> GetAllInitiateBySubdepartmentAsync(string subDepartmentName);
        Task<IEnumerable<InitiateListDto>> GetAllInitializedBySubDepartmentAsync(string subDepartmentName);
        Task<bool> DeleteInitiateAsync(string id);
        Task<bool> DeleteFromInitiateAsync(string employeeId);
        Task<bool> ApproveAndGenerateCertificateAsync(string employeeId);
        Task<bool> AddGeneratedAsync(CertificateGeneratedDto dto);
        Task<CertificateDetailDto?> GetGeneratedByIdAsync(string id);
        Task<IEnumerable<CertificateDetailDto>> GetAllGeneratedAsync();
        Task<IEnumerable<CertificateDetailDto>> GetGeneratedByDepartmentAsync(string departmentName);
        Task<IEnumerable<CertificateDetailDto>> GetGeneratedBySubDepartmentAsync(string subDepartmentName);
        Task<IEnumerable<CertificateDetailDto>> GetAllGeneratedByDepartmentAsync(string departmentName);
        Task<IEnumerable<CertificateDetailDto>> GetAllGeneratedBySubDepartmentAsync(string subDepartmentName);
        Task<int> GetCountGeneratedAsync();
        Task<int> GetCountGeneratedByDepartmentAsync(string departmentName);
        Task<int> GetCountGeneratedBySubDepartmentAsync(string subDepartmentName);
    }
}
