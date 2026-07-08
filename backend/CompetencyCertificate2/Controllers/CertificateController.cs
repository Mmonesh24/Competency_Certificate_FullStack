using CompetencyCertificate.DTOs;
using CompetencyCertificate.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace CompetencyCertificate.Controllers
{
    [Route("api/User")]
    [ApiController]
    [Authorize]
    public class CertificateController : ControllerBase
    {
        private readonly ICertificateService _certificateService;

        public CertificateController(ICertificateService certificateService)
        {
            _certificateService = certificateService;
        }

        // --- Initiate workflows ---

        [Authorize(Roles = "HR,HOD,Executive")]
        [HttpPost("AddInitiate")]
        public async Task<IActionResult> AddInitiate([FromBody] CertificateInitiateDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var success = await _certificateService.AddInitiateAsync(dto);
            if (!success) return BadRequest(new { message = "Failed to initiate certificate (possibly already initiated)." });

            return Ok(new { message = "Initiated Successfully" });
        }

        [HttpGet("GetAllInitiateBySubdepartment/{SubDepartmentName}")]
        public async Task<IActionResult> GetAllInitiateBySubdepartment(string SubDepartmentName)
        {
            var list = await _certificateService.GetAllInitiateBySubdepartmentAsync(SubDepartmentName);
            return Ok(list);
        }

        [HttpGet("GetAllInitializedBySubDepartment/{SubDepartmentName}")]
        public async Task<IActionResult> GetAllInitializedBySubDepartment(string SubDepartmentName)
        {
            var list = await _certificateService.GetAllInitializedBySubDepartmentAsync(SubDepartmentName);
            return Ok(list);
        }

        [Authorize(Roles = "HR,HOD")]
        [HttpDelete("DeleteInitiate/{id}")]
        public async Task<IActionResult> DeleteInitiate(string id)
        {
            var success = await _certificateService.DeleteInitiateAsync(id);
            if (!success) return NotFound(new { message = "Initiate not found" });

            return Ok(new { message = "Initiate deleted successfully" });
        }

        [Authorize(Roles = "HR,HOD")]
        [HttpDelete("DeleteFromInitiate/{employeeId}")]
        public async Task<IActionResult> DeleteFromInitiate(string employeeId)
        {
            var success = await _certificateService.DeleteFromInitiateAsync(employeeId);
            if (!success) return NotFound(new { message = "Employee not found in initiate table" });

            return Ok(new { message = "Employee deleted from initiate table successfully" });
        }

        // --- Approval & Generated Certificate flows ---

        [Authorize(Roles = "HR,HOD")]
        [HttpPost("ApproveAndGenerateCertificate/{employeeId}")]
        public async Task<IActionResult> ApproveAndGenerateCertificate(string employeeId)
        {
            var success = await _certificateService.ApproveAndGenerateCertificateAsync(employeeId);
            if (!success) return BadRequest(new { message = "Failed to approve and generate certificate." });

            return Ok(new { message = "Certificate generated and approved successfully." });
        }

        [Authorize(Roles = "HR,HOD")]
        [HttpPost("AddGenerated")]
        public async Task<IActionResult> AddGenerated([FromBody] CertificateGeneratedDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var success = await _certificateService.AddGeneratedAsync(dto);
            if (!success) return BadRequest(new { message = "Failed to save generated certificate." });

            return Ok(new { message = "Added successfully" });
        }

        [HttpGet("GetAllGeneratedById/{Id}")]
        public async Task<IActionResult> GetGeneratedById(string Id)
        {
            var detail = await _certificateService.GetGeneratedByIdAsync(Id);
            if (detail == null) return NotFound(new { message = "Generated certificate not found." });

            return Ok(detail);
        }

        [HttpGet("GetAllGenerated")]
        public async Task<IActionResult> GetAllGenerated()
        {
            var list = await _certificateService.GetAllGeneratedAsync();
            return Ok(list);
        }

        [HttpGet("GetGenerated")]
        public async Task<IActionResult> GetGenerated()
        {
            var list = await _certificateService.GetAllGeneratedAsync();
            return Ok(list);
        }

        [HttpGet("GetGeneratedByDepartment/{DepartmentName}")]
        public async Task<IActionResult> GetGeneratedByDepartment(string DepartmentName)
        {
            var list = await _certificateService.GetGeneratedByDepartmentAsync(DepartmentName);
            return Ok(list);
        }

        [HttpGet("GetGeneratedBySubDepartment/{SubDepartmentName}")]
        public async Task<IActionResult> GetGeneratedBySubDepartment(string SubDepartmentName)
        {
            var list = await _certificateService.GetGeneratedBySubDepartmentAsync(SubDepartmentName);
            return Ok(list);
        }

        [HttpGet("GetAllGeneratedByDepartment/{DepartmentName}")]
        public async Task<IActionResult> GetAllGeneratedByDepartment(string DepartmentName)
        {
            var list = await _certificateService.GetAllGeneratedByDepartmentAsync(DepartmentName);
            return Ok(list);
        }

        [HttpGet("GetAllGeneratedBySubDepartment/{SubDepartmentName}")]
        public async Task<IActionResult> GetAllGeneratedBySubDepartment(string SubDepartmentName)
        {
            var list = await _certificateService.GetAllGeneratedBySubDepartmentAsync(SubDepartmentName);
            return Ok(list);
        }

        [HttpGet("GetCountGenerated")]
        public async Task<IActionResult> GetCountGenerated()
        {
            var count = await _certificateService.GetCountGeneratedAsync();
            return Ok(count);
        }

        [HttpGet("GetCountGeneratedByDepartment/{DepartmentName}")]
        public async Task<IActionResult> GetCountGeneratedByDepartment(string DepartmentName)
        {
            var count = await _certificateService.GetCountGeneratedByDepartmentAsync(DepartmentName);
            return Ok(count);
        }

        [HttpGet("GetCountGeneratedBySubDepartment/{SubDepartmentName}")]
        public async Task<IActionResult> GetCountGeneratedBySubDepartment(string SubDepartmentName)
        {
            var count = await _certificateService.GetCountGeneratedBySubDepartmentAsync(SubDepartmentName);
            return Ok(count);
        }
    }
}
