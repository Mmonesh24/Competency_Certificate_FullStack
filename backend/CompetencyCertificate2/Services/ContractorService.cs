using CompetencyCertificate.DTOs;
using CompetencyCertificate.Models;
using CompetencyCertificate.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CompetencyCertificate.Services
{
    public class ContractorService : IContractorService
    {
        private readonly IGenericRepository<Contractor> _contractorRepo;

        public ContractorService(IGenericRepository<Contractor> contractorRepo)
        {
            _contractorRepo = contractorRepo;
        }

        public async Task<ContractorDto?> GetContractorByNameAsync(string name)
        {
            var contractor = await _contractorRepo.GetByIdAsync(name);
            if (contractor == null) return null;
            return new ContractorDto
            {
                ContractorName = contractor.ContractorName,
                LogoBase64 = contractor.Logo != null && contractor.Logo.Length > 0 ? Convert.ToBase64String(contractor.Logo) : null
            };
        }

        public async Task<IEnumerable<ContractorDto>> GetAllContractorsAsync()
        {
            var all = await _contractorRepo.GetAllAsync();
            return all.Select(c => new ContractorDto
            {
                ContractorName = c.ContractorName,
                LogoBase64 = c.Logo != null && c.Logo.Length > 0 ? Convert.ToBase64String(c.Logo) : null
            });
        }

        public async Task<bool> AddContractorAsync(ContractorDto dto)
        {
            var contractor = new Contractor
            {
                ContractorName = dto.ContractorName
            };

            if (!string.IsNullOrWhiteSpace(dto.LogoBase64))
            {
                contractor.Logo = Convert.FromBase64String(dto.LogoBase64);
            }

            await _contractorRepo.AddAsync(contractor);
            return await _contractorRepo.SaveChangesAsync();
        }

        public async Task<bool> UpdateContractorAsync(string name, ContractorDto dto)
        {
            var contractor = await _contractorRepo.GetByIdAsync(name);
            if (contractor == null) return false;

            contractor.ContractorName = dto.ContractorName;
            if (!string.IsNullOrWhiteSpace(dto.LogoBase64))
            {
                contractor.Logo = Convert.FromBase64String(dto.LogoBase64);
            }

            _contractorRepo.Update(contractor);
            return await _contractorRepo.SaveChangesAsync();
        }

        public async Task<int> GetCountContractorsAsync()
        {
            var all = await _contractorRepo.GetAllAsync();
            return all.Count();
        }
    }
}
