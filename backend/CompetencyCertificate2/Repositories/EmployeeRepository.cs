using CompetencyCertificate.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CompetencyCertificate.Repositories
{
    public class EmployeeRepository : GenericRepository<Employee>, IEmployeeRepository
    {
        public EmployeeRepository(AppDbContext context) : base(context)
        {
        }

        public async Task<Employee?> GetEmployeeWithRelationsAsync(string id)
        {
            return await _dbSet
                .Include(e => e.Designation)
                .Include(e => e.Department)
                .Include(e => e.SubDepartment)
                .Include(e => e.Contractor)
                .FirstOrDefaultAsync(e => e.Employee_id == id);
        }

        public async Task<IEnumerable<Employee>> GetAllEmployeesWithRelationsAsync()
        {
            return await _dbSet
                .Include(e => e.Designation)
                .Include(e => e.Department)
                .Include(e => e.SubDepartment)
                .Include(e => e.Contractor)
                .ToListAsync();
        }
    }
}
