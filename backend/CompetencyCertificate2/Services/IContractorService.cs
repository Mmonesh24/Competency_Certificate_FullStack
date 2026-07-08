using CompetencyCertificate.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CompetencyCertificate.Services
{
    public interface IContractorService
    {
        Task<ContractorDto?> GetContractorByNameAsync(string name);
        Task<IEnumerable<ContractorDto>> GetAllContractorsAsync();
        Task<bool> AddContractorAsync(ContractorDto dto);
        Task<bool> UpdateContractorAsync(string name, ContractorDto dto);
        Task<int> GetCountContractorsAsync();
    }
}
