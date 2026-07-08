using CompetencyCertificate.DTOs;
using CompetencyCertificate.Models;
using CompetencyCertificate.Repositories;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CompetencyCertificate.Services
{
    public class CertificateService : ICertificateService
    {
        private readonly ICertificateRepository _certificateRepo;
        private readonly IGenericRepository<Initiate> _initiateRepo;
        private readonly IGenericRepository<Generated> _generatedRepo;
        private readonly IGenericRepository<Contractor> _contractorRepo;
        private readonly IEmployeeRepository _employeeRepo;
        private readonly AppDbContext _context;

        public CertificateService(
            ICertificateRepository certificateRepo,
            IGenericRepository<Initiate> initiateRepo,
            IGenericRepository<Generated> generatedRepo,
            IGenericRepository<Contractor> contractorRepo,
            IEmployeeRepository employeeRepo,
            AppDbContext context)
        {
            _certificateRepo = certificateRepo;
            _initiateRepo = initiateRepo;
            _generatedRepo = generatedRepo;
            _contractorRepo = contractorRepo;
            _employeeRepo = employeeRepo;
            _context = context;
        }

        public async Task<bool> AddInitiateAsync(CertificateInitiateDto dto)
        {
            var existing = await _initiateRepo.GetByIdAsync(dto.employee_id);
            if (existing != null) return false;

            var initiate = new Initiate { employee_id = dto.employee_id };
            await _initiateRepo.AddAsync(initiate);
            return await _initiateRepo.SaveChangesAsync();
        }

        public async Task<IEnumerable<InitiateListDto>> GetAllInitiateBySubdepartmentAsync(string subDepartmentName, int approvalLevel = 0)
        {
            var all = await _certificateRepo.GetAllInitiateWithEmployeeAsync();
            return all
                .Where(i => i.Employee != null && i.Employee.SubDepartmentName == subDepartmentName && i.ApprovalLevel == approvalLevel)
                .Select(MapToInitiateDto);
        }

        public async Task<IEnumerable<InitiateListDto>> GetAllInitializedBySubDepartmentAsync(string subDepartmentName, int approvalLevel = 0)
        {
            var all = await _certificateRepo.GetAllInitiateWithEmployeeAsync();
            return all
                .Where(i => i.Employee != null && i.Employee.SubDepartmentName == subDepartmentName && i.ApprovalLevel == approvalLevel)
                .Select(MapToInitiateDto);
        }

        public async Task<bool> DeleteInitiateAsync(string id)
        {
            var record = await _initiateRepo.GetByIdAsync(id);
            if (record == null) return false;

            _initiateRepo.Remove(record);
            return await _initiateRepo.SaveChangesAsync();
        }

        public async Task<bool> DeleteFromInitiateAsync(string employeeId)
        {
            var records = await _initiateRepo.FindAsync(i => i.employee_id == employeeId);
            var record = records.FirstOrDefault();
            if (record == null) return false;

            _initiateRepo.Remove(record);
            return await _initiateRepo.SaveChangesAsync();
        }

        public async Task<bool> ApproveAndGenerateCertificateAsync(string employeeId)
        {
            using (var transaction = await _context.Database.BeginTransactionAsync())
            {
                try
                {
                    var initiates = await _initiateRepo.FindAsync(i => i.employee_id == employeeId);
                    var initiateRecord = initiates.FirstOrDefault();
                    if (initiateRecord == null) return false;

                    if (initiateRecord.ApprovalLevel == 0)
                    {
                        initiateRecord.ApprovalLevel = 1;
                        _initiateRepo.Update(initiateRecord);
                        await _context.SaveChangesAsync();
                        await transaction.CommitAsync();
                        return true;
                    }

                    var employee = await _employeeRepo.GetEmployeeWithRelationsAsync(employeeId);
                    if (employee == null) return false;

                    byte[] logoBytes = Array.Empty<byte>();
                    if (!string.IsNullOrEmpty(employee.ContractorName))
                    {
                        var contractors = await _contractorRepo.FindAsync(c => c.ContractorName == employee.ContractorName);
                        var contractor = contractors.FirstOrDefault();
                        if (contractor != null && contractor.Logo != null)
                        {
                            logoBytes = contractor.Logo;
                        }
                    }

                    string validityText = DateTime.UtcNow.AddYears(1).ToString("dd-MM-yyyy");
                    byte[] pdfBytes = QuestPdfGeneratorService.GenerateCertificatePdf(
                        employee.Employee_name,
                        employee.Employee_id,
                        employee.DepartmentName ?? "N/A",
                        employee.SubDepartmentName ?? "N/A",
                        employee.Designation_Name ?? "N/A",
                        validityText,
                        logoBytes
                    );

                    var existingGenerated = await _generatedRepo.GetByIdAsync(employeeId);
                    if (existingGenerated != null)
                    {
                        existingGenerated.CompetencyCertificate = pdfBytes;
                        existingGenerated.Validity = validityText;
                        _generatedRepo.Update(existingGenerated);
                    }
                    else
                    {
                        var generated = new Generated
                        {
                            EmployeeId = employeeId,
                            CompetencyCertificate = pdfBytes,
                            Validity = validityText
                        };
                        await _generatedRepo.AddAsync(generated);
                    }

                    _initiateRepo.Remove(initiateRecord);

                    await _context.SaveChangesAsync();
                    await transaction.CommitAsync();
                    return true;
                }
                catch
                {
                    await transaction.RollbackAsync();
                    throw;
                }
            }
        }

        public async Task<bool> AddGeneratedAsync(CertificateGeneratedDto dto)
        {
            byte[] certificateBytes = Convert.FromBase64String(dto.CompetencyCertificate);
            var existing = await _generatedRepo.GetByIdAsync(dto.EmployeeId);
            if (existing != null)
            {
                existing.CompetencyCertificate = certificateBytes;
                existing.Validity = dto.Validity;
                _generatedRepo.Update(existing);
            }
            else
            {
                var generated = new Generated
                {
                    EmployeeId = dto.EmployeeId,
                    CompetencyCertificate = certificateBytes,
                    Validity = dto.Validity
                };
                await _generatedRepo.AddAsync(generated);
            }

            return await _generatedRepo.SaveChangesAsync();
        }

        public async Task<CertificateDetailDto?> GetGeneratedByIdAsync(string id)
        {
            var g = await _certificateRepo.GetGeneratedWithEmployeeAsync(id);
            if (g == null) return null;
            return MapToGeneratedDto(g);
        }

        public async Task<IEnumerable<CertificateDetailDto>> GetAllGeneratedAsync()
        {
            var list = await _certificateRepo.GetAllGeneratedWithEmployeeAsync();
            return list.Select(MapToGeneratedDto);
        }

        public async Task<IEnumerable<CertificateDetailDto>> GetGeneratedByDepartmentAsync(string departmentName)
        {
            var list = await _certificateRepo.GetAllGeneratedWithEmployeeAsync();
            return list
                .Where(g => g.Employee != null && g.Employee.DepartmentName == departmentName)
                .Select(MapToGeneratedDto);
        }

        public async Task<IEnumerable<CertificateDetailDto>> GetGeneratedBySubDepartmentAsync(string subDepartmentName)
        {
            var list = await _certificateRepo.GetAllGeneratedWithEmployeeAsync();
            return list
                .Where(g => g.Employee != null && g.Employee.SubDepartmentName == subDepartmentName)
                .Select(MapToGeneratedDto);
        }

        public async Task<IEnumerable<CertificateDetailDto>> GetAllGeneratedByDepartmentAsync(string departmentName)
        {
            var list = await _certificateRepo.GetAllGeneratedWithEmployeeAsync();
            return list
                .Where(g => g.Employee != null && g.Employee.DepartmentName == departmentName)
                .Select(MapToGeneratedDto);
        }

        public async Task<IEnumerable<CertificateDetailDto>> GetAllGeneratedBySubDepartmentAsync(string subDepartmentName)
        {
            var list = await _certificateRepo.GetAllGeneratedWithEmployeeAsync();
            return list
                .Where(g => g.Employee != null && g.Employee.SubDepartmentName == subDepartmentName)
                .Select(MapToGeneratedDto);
        }

        public async Task<int> GetCountGeneratedAsync()
        {
            var all = await _generatedRepo.GetAllAsync();
            return all.Count();
        }

        public async Task<int> GetCountGeneratedByDepartmentAsync(string departmentName)
        {
            var all = await _certificateRepo.GetAllGeneratedWithEmployeeAsync();
            return all.Count(g => g.Employee != null && g.Employee.DepartmentName == departmentName);
        }

        public async Task<int> GetCountGeneratedBySubDepartmentAsync(string subDepartmentName)
        {
            var all = await _certificateRepo.GetAllGeneratedWithEmployeeAsync();
            return all.Count(g => g.Employee != null && g.Employee.SubDepartmentName == subDepartmentName);
        }

        private InitiateListDto MapToInitiateDto(Initiate i)
        {
            return new InitiateListDto
            {
                EmployeeId = i.employee_id,
                EmployeeName = i.Employee?.Employee_name ?? "Unknown",
                Designation = i.Employee?.Designation_Name ?? "N/A",
                Department = i.Employee?.DepartmentName ?? "N/A",
                SubDepartment = i.Employee?.SubDepartmentName ?? "N/A"
            };
        }

        private CertificateDetailDto MapToGeneratedDto(Generated g)
        {
            return new CertificateDetailDto
            {
                EmployeeId = g.EmployeeId,
                EmployeeName = g.Employee?.Employee_name ?? "Unknown",
                Designation = g.Employee?.Designation_Name ?? "N/A",
                Department = g.Employee?.DepartmentName ?? "N/A",
                SubDepartment = g.Employee?.SubDepartmentName ?? "N/A",
                CompetencyCertificateBase64 = g.CompetencyCertificate != null ? Convert.ToBase64String(g.CompetencyCertificate) : "",
                Validity = g.Validity
            };
        }
    }
}
