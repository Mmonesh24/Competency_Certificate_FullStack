using CompetencyCertificate.DTOs;
using CompetencyCertificate.Models;
using CompetencyCertificate.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CompetencyCertificate.Services
{
    public class EmployeeService : IEmployeeService
    {
        private readonly IEmployeeRepository _employeeRepo;

        public EmployeeService(IEmployeeRepository employeeRepo)
        {
            _employeeRepo = employeeRepo;
        }

        public async Task<EmployeeDto?> GetEmployeeByIdAsync(string id)
        {
            var employee = await _employeeRepo.GetEmployeeWithRelationsAsync(id);
            if (employee == null) return null;
            return MapToDto(employee);
        }

        public async Task<IEnumerable<EmployeeDto>> GetAllEmployeesAsync()
        {
            var employees = await _employeeRepo.GetAllEmployeesWithRelationsAsync();
            return employees.Select(MapToDto);
        }

        public async Task<PagedResultDto<EmployeeDto>> GetPagedEmployeesAsync(int pageNumber, int pageSize)
        {
            var allEmployees = await _employeeRepo.GetAllEmployeesWithRelationsAsync();
            var totalCount = allEmployees.Count();
            
            var items = allEmployees
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .Select(MapToDto)
                .ToList();

            return new PagedResultDto<EmployeeDto>
            {
                Items = items,
                TotalCount = totalCount,
                PageNumber = pageNumber,
                PageSize = pageSize
            };
        }

        public async Task<bool> AddEmployeeAsync(EmployeeCreateDto dto)
        {
            var employee = new Employee
            {
                Employee_id = dto.Employee_id,
                Employee_name = dto.Employee_name,
                Employee_type = dto.Employee_type,
                CategoryName = dto.CategoryName,
                ContractorName = dto.ContractorName,
                DOB = dto.DOB,
                EPF_UAN_NO = dto.EPF_UAN_NO,
                ESA_NO = dto.ESA_NO,
                BankName = dto.BankName,
                BankAccountNumber = dto.BankAccountNumber,
                JoiningDate = dto.JoiningDate,
                Designation_Name = dto.Designation_Name,
                DepartmentName = dto.DepartmentName,
                SubDepartmentName = dto.SubDepartmentName,
                AadharNo = dto.AadharNo,
                BloodGroup = dto.BloodGroup,
                ContactNo = dto.ContactNo,
                EmerContactNo = dto.EmerContactNo,
                Status = dto.Status
            };

            if (!string.IsNullOrWhiteSpace(dto.PhotoBase64))
            {
                employee.Photo = Convert.FromBase64String(dto.PhotoBase64);
                employee.PhotoBase64 = dto.PhotoBase64;
            }

            if (!string.IsNullOrWhiteSpace(dto.PassbookBase64))
            {
                employee.Passbook = Convert.FromBase64String(dto.PassbookBase64);
                employee.PassbookBase64 = dto.PassbookBase64;
            }

            await _employeeRepo.AddAsync(employee);
            return await _employeeRepo.SaveChangesAsync();
        }

        public async Task<bool> UpdateEmployeeAsync(string id, EmployeeUpdateDto dto)
        {
            var employee = await _employeeRepo.GetByIdAsync(id);
            if (employee == null) return false;

            employee.Employee_name = dto.Employee_name;
            employee.Employee_type = dto.Employee_type;
            employee.CategoryName = dto.CategoryName;
            employee.ContractorName = dto.ContractorName;
            employee.DOB = dto.DOB;
            employee.EPF_UAN_NO = dto.EPF_UAN_NO;
            employee.ESA_NO = dto.ESA_NO;
            employee.BankName = dto.BankName;
            employee.BankAccountNumber = dto.BankAccountNumber;
            employee.JoiningDate = dto.JoiningDate;
            employee.Designation_Name = dto.Designation_Name;
            employee.DepartmentName = dto.DepartmentName;
            employee.SubDepartmentName = dto.SubDepartmentName;
            employee.AadharNo = dto.AadharNo;
            employee.BloodGroup = dto.BloodGroup;
            employee.ContactNo = dto.ContactNo;
            employee.EmerContactNo = dto.EmerContactNo;
            employee.Status = dto.Status;

            if (!string.IsNullOrWhiteSpace(dto.PhotoBase64))
            {
                employee.Photo = Convert.FromBase64String(dto.PhotoBase64);
                employee.PhotoBase64 = dto.PhotoBase64;
            }

            if (!string.IsNullOrWhiteSpace(dto.PassbookBase64))
            {
                employee.Passbook = Convert.FromBase64String(dto.PassbookBase64);
                employee.PassbookBase64 = dto.PassbookBase64;
            }

            _employeeRepo.Update(employee);
            return await _employeeRepo.SaveChangesAsync();
        }

        public async Task<bool> DeleteEmployeeAsync(string id)
        {
            var employee = await _employeeRepo.GetByIdAsync(id);
            if (employee == null) return false;

            _employeeRepo.Remove(employee);
            return await _employeeRepo.SaveChangesAsync();
        }

        public async Task<int> GetCountEmployeesAsync()
        {
            var all = await _employeeRepo.GetAllAsync();
            return all.Count();
        }

        public async Task<int> GetCountEmployeesByDepartmentAsync(string departmentId)
        {
            var filtered = await _employeeRepo.FindAsync(e => e.DepartmentName == departmentId);
            return filtered.Count();
        }

        public async Task<int> GetCountEmployeesBySubDepartmentAsync(string subDepartmentId)
        {
            var filtered = await _employeeRepo.FindAsync(e => e.SubDepartmentName == subDepartmentId);
            return filtered.Count();
        }

        public async Task<IEnumerable<EmployeeDto>> GetEmployeesByDepartmentAsync(string departmentId)
        {
            var filtered = await _employeeRepo.FindAsync(e => e.DepartmentName == departmentId);
            return filtered.Select(MapToDto);
        }

        public async Task<IEnumerable<EmployeeDto>> GetEmployeesBySubDepartmentAsync(string subDepartmentId)
        {
            var filtered = await _employeeRepo.FindAsync(e => e.SubDepartmentName == subDepartmentId);
            return filtered.Select(MapToDto);
        }

        private EmployeeDto MapToDto(Employee employee)
        {
            return new EmployeeDto
            {
                Employee_id = employee.Employee_id,
                Employee_name = employee.Employee_name,
                Employee_type = employee.Employee_type,
                CategoryName = employee.CategoryName,
                ContractorName = employee.ContractorName,
                DOB = employee.DOB,
                EPF_UAN_NO = employee.EPF_UAN_NO,
                ESA_NO = employee.ESA_NO,
                BankName = employee.BankName,
                BankAccountNumber = employee.BankAccountNumber,
                JoiningDate = employee.JoiningDate,
                Designation_Name = employee.Designation_Name,
                DepartmentName = employee.DepartmentName,
                SubDepartmentName = employee.SubDepartmentName,
                AadharNo = employee.AadharNo,
                BloodGroup = employee.BloodGroup,
                ContactNo = employee.ContactNo,
                EmerContactNo = employee.EmerContactNo,
                Status = employee.Status,
                PhotoBase64 = employee.Photo != null && employee.Photo.Length > 0 ? Convert.ToBase64String(employee.Photo) : null,
                PassbookBase64 = employee.Passbook != null && employee.Passbook.Length > 0 ? Convert.ToBase64String(employee.Passbook) : null
            };
        }
    }
}
