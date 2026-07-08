using CompetencyCertificate.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CompetencyCertificate.Repositories
{
    public class CertificateRepository : ICertificateRepository
    {
        private readonly AppDbContext _context;

        public CertificateRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Generated?> GetGeneratedWithEmployeeAsync(string employeeId)
        {
            return await _context.Generated
                .Include(g => g.Employee)
                .ThenInclude(e => e.Designation)
                .Include(g => g.Employee)
                .ThenInclude(e => e.Department)
                .Include(g => g.Employee)
                .ThenInclude(e => e.SubDepartment)
                .FirstOrDefaultAsync(g => g.EmployeeId == employeeId);
        }

        public async Task<IEnumerable<Generated>> GetAllGeneratedWithEmployeeAsync()
        {
            return await _context.Generated
                .Include(g => g.Employee)
                .ThenInclude(e => e.Designation)
                .Include(g => g.Employee)
                .ThenInclude(e => e.Department)
                .Include(g => g.Employee)
                .ThenInclude(e => e.SubDepartment)
                .ToListAsync();
        }

        public async Task<IEnumerable<Initiate>> GetAllInitiateWithEmployeeAsync()
        {
            return await _context.Initiate
                .Include(i => i.Employee)
                .ThenInclude(e => e.Designation)
                .Include(i => i.Employee)
                .ThenInclude(e => e.Department)
                .Include(i => i.Employee)
                .ThenInclude(e => e.SubDepartment)
                .ToListAsync();
        }
    }
}
