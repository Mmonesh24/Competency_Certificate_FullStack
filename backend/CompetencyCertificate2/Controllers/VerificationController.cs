using CompetencyCertificate.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace CompetencyCertificate.Controllers
{
    [Route("api/Verification")]
    [ApiController]
    [AllowAnonymous]
    public class VerificationController : ControllerBase
    {
        private readonly ICertificateService _certificateService;

        public VerificationController(ICertificateService certificateService)
        {
            _certificateService = certificateService;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> VerifyCertificate(string id)
        {
            var detail = await _certificateService.GetGeneratedByIdAsync(id);
            if (detail == null)
            {
                return NotFound(new { status = "Invalid", message = "Certificate not found or expired." });
            }

            return Ok(new
            {
                status = "Valid",
                employeeName = detail.EmployeeName,
                employeeId = detail.EmployeeId,
                designation = detail.Designation,
                department = detail.Department,
                subDepartment = detail.SubDepartment,
                validity = detail.Validity
            });
        }
    }
}
