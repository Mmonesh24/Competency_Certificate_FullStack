using CompetencyCertificate.DTOs;
using CompetencyCertificate.Models;
using CompetencyCertificate.Repositories;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CompetencyCertificate.Services
{
    public class MasterDataService : IMasterDataService
    {
        private readonly IGenericRepository<Department> _departmentRepo;
        private readonly IGenericRepository<SubDepartment> _subDepartmentRepo;
        private readonly IGenericRepository<Designation> _designationRepo;

        public MasterDataService(
            IGenericRepository<Department> departmentRepo,
            IGenericRepository<SubDepartment> subDepartmentRepo,
            IGenericRepository<Designation> designationRepo)
        {
            _departmentRepo = departmentRepo;
            _subDepartmentRepo = subDepartmentRepo;
            _designationRepo = designationRepo;
        }

        // Departments
        public async Task<DepartmentDto?> GetDepartmentByIdAsync(string id)
        {
            var dept = await _departmentRepo.GetByIdAsync(id);
            if (dept == null) return null;
            return new DepartmentDto { DepartmentName = dept.DepartmentName, DepartmentCode = dept.DepartmentCode };
        }

        public async Task<IEnumerable<DepartmentDto>> GetAllDepartmentsAsync()
        {
            var all = await _departmentRepo.GetAllAsync();
            return all.Select(d => new DepartmentDto { DepartmentName = d.DepartmentName, DepartmentCode = d.DepartmentCode });
        }

        public async Task<bool> AddDepartmentAsync(DepartmentDto dto)
        {
            var dept = new Department { DepartmentName = dto.DepartmentName, DepartmentCode = dto.DepartmentCode };
            await _departmentRepo.AddAsync(dept);
            return await _departmentRepo.SaveChangesAsync();
        }

        public async Task<bool> UpdateDepartmentAsync(string id, DepartmentDto dto)
        {
            var dept = await _departmentRepo.GetByIdAsync(id);
            if (dept == null) return false;
            dept.DepartmentName = dto.DepartmentName;
            dept.DepartmentCode = dto.DepartmentCode;
            _departmentRepo.Update(dept);
            return await _departmentRepo.SaveChangesAsync();
        }

        public async Task<bool> DeleteDepartmentAsync(string id)
        {
            var dept = await _departmentRepo.GetByIdAsync(id);
            if (dept == null) return false;
            _departmentRepo.Remove(dept);
            return await _departmentRepo.SaveChangesAsync();
        }

        public async Task<int> GetCountDepartmentsAsync()
        {
            var all = await _departmentRepo.GetAllAsync();
            return all.Count();
        }

        // SubDepartments
        public async Task<SubDepartmentDto?> GetSubDepartmentByNameAsync(string subDeptName)
        {
            var sub = await _subDepartmentRepo.GetByIdAsync(subDeptName);
            if (sub == null) return null;
            return new SubDepartmentDto { SubDepartmentName = sub.SubDepartmentName, DepartmentName = sub.DepartmentName ?? "" };
        }

        public async Task<IEnumerable<SubDepartmentDto>> GetSubDepartmentsByDepartmentIdAsync(string departmentId)
        {
            var list = await _subDepartmentRepo.FindAsync(s => s.DepartmentName == departmentId);
            return list.Select(s => new SubDepartmentDto { SubDepartmentName = s.SubDepartmentName, DepartmentName = s.DepartmentName ?? "" });
        }

        public async Task<bool> AddSubDepartmentAsync(SubDepartmentDto dto)
        {
            var sub = new SubDepartment { SubDepartmentName = dto.SubDepartmentName, DepartmentName = dto.DepartmentName };
            await _subDepartmentRepo.AddAsync(sub);
            return await _subDepartmentRepo.SaveChangesAsync();
        }

        public async Task<bool> UpdateSubDepartmentAsync(string subDeptName, SubDepartmentDto dto)
        {
            var sub = await _subDepartmentRepo.GetByIdAsync(subDeptName);
            if (sub == null) return false;
            sub.SubDepartmentName = dto.SubDepartmentName;
            sub.DepartmentName = dto.DepartmentName;
            _subDepartmentRepo.Update(sub);
            return await _subDepartmentRepo.SaveChangesAsync();
        }

        public async Task<int> GetCountSubDepartmentsAsync()
        {
            var all = await _subDepartmentRepo.GetAllAsync();
            return all.Count();
        }

        // Designations
        public async Task<DesignationDto?> GetDesignationByNameAsync(string name)
        {
            var des = await _designationRepo.GetByIdAsync(name);
            if (des == null) return null;
            return new DesignationDto { Designation_Name = des.Designation_Name, DesignationCode = des.DesignationCode, designation_type = des.designation_type };
        }

        public async Task<IEnumerable<DesignationDto>> GetAllDesignationsAsync()
        {
            var all = await _designationRepo.GetAllAsync();
            return all.Select(d => new DesignationDto { Designation_Name = d.Designation_Name, DesignationCode = d.DesignationCode, designation_type = d.designation_type });
        }

        public async Task<IEnumerable<DesignationDto>> GetDesignationsByTypeAsync(string type)
        {
            if (System.Enum.TryParse<EmployeeType>(type, true, out var employeeType))
            {
                var list = await _designationRepo.FindAsync(d => d.designation_type == employeeType);
                return list.Select(d => new DesignationDto { Designation_Name = d.Designation_Name, DesignationCode = d.DesignationCode, designation_type = d.designation_type });
            }
            return System.Linq.Enumerable.Empty<DesignationDto>();
        }

        public async Task<bool> AddDesignationAsync(DesignationDto dto)
        {
            var des = new Designation { Designation_Name = dto.Designation_Name, DesignationCode = dto.DesignationCode, designation_type = dto.designation_type };
            await _designationRepo.AddAsync(des);
            return await _designationRepo.SaveChangesAsync();
        }

        public async Task<bool> UpdateDesignationAsync(string id, DesignationDto dto)
        {
            var des = await _designationRepo.GetByIdAsync(id);
            if (des == null) return false;
            des.Designation_Name = dto.Designation_Name;
            des.DesignationCode = dto.DesignationCode;
            des.designation_type = dto.designation_type;
            _designationRepo.Update(des);
            return await _designationRepo.SaveChangesAsync();
        }

        public async Task<bool> DeleteDesignationAsync(string id)
        {
            var des = await _designationRepo.GetByIdAsync(id);
            if (des == null) return false;
            _designationRepo.Remove(des);
            return await _designationRepo.SaveChangesAsync();
        }

        public async Task<int> GetCountDesignationsAsync()
        {
            var all = await _designationRepo.GetAllAsync();
            return all.Count();
        }
    }
}
