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
    public class MasterDataController : ControllerBase
    {
        private readonly IMasterDataService _masterDataService;

        public MasterDataController(IMasterDataService masterDataService)
        {
            _masterDataService = masterDataService;
        }

        // --- Departments ---

        [Authorize(Roles = "HR")]
        [HttpPost("AddDepartment")]
        public async Task<IActionResult> AddDepartment([FromBody] DepartmentDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var success = await _masterDataService.AddDepartmentAsync(dto);
            if (!success) return BadRequest(new { message = "Failed to add department." });

            return Ok(new { message = "Department Added Successfully" });
        }

        [HttpGet("GetAllDepartments")]
        public async Task<IActionResult> GetAllDepartments()
        {
            var list = await _masterDataService.GetAllDepartmentsAsync();
            return Ok(list);
        }

        [HttpGet("GetDepartmentById/{id}")]
        public async Task<IActionResult> GetDepartmentById(string id)
        {
            var dept = await _masterDataService.GetDepartmentByIdAsync(id);
            if (dept == null) return NotFound(new { message = "Department not found." });

            return Ok(dept);
        }

        [Authorize(Roles = "HR")]
        [HttpPut("UpdateDepartment/{id}")]
        public async Task<IActionResult> UpdateDepartment(string id, [FromBody] DepartmentDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var success = await _masterDataService.UpdateDepartmentAsync(id, dto);
            if (!success) return NotFound("Department not found or update failed.");

            return Ok(new { message = "Department Updated Successfully" });
        }

        [Authorize(Roles = "HR")]
        [HttpDelete("DeleteDepartment/{id}")]
        public async Task<IActionResult> DeleteDepartment(string id)
        {
            var success = await _masterDataService.DeleteDepartmentAsync(id);
            if (!success) return NotFound(new { message = "Department Not Found" });

            return Ok(new { message = "Department Deleted Successfully" });
        }

        [HttpGet("GetCountDepartments")]
        public async Task<IActionResult> GetCountDepartments()
        {
            var count = await _masterDataService.GetCountDepartmentsAsync();
            return Ok(new { count });
        }

        // --- SubDepartments ---

        [Authorize(Roles = "HR")]
        [HttpPost("AddSubDepartment")]
        public async Task<IActionResult> AddSubDepartment([FromBody] SubDepartmentDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var success = await _masterDataService.AddSubDepartmentAsync(dto);
            if (!success) return BadRequest(new { message = "Failed to add subdepartment." });

            return Ok(new { message = "Sub Department Added Successfully" });
        }

        [HttpGet("GetSubDepartmentByName/{subdept}")]
        public async Task<IActionResult> GetSubDepartmentByName(string subdept)
        {
            var sub = await _masterDataService.GetSubDepartmentByNameAsync(subdept);
            if (sub == null) return NotFound(new { message = "SubDepartment not found." });

            return Ok(sub);
        }

        [Authorize(Roles = "HR")]
        [HttpPut("UpdateSubDepartment/{subdept}")]
        public async Task<IActionResult> UpdateSubDepartment(string subdept, [FromBody] SubDepartmentDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var success = await _masterDataService.UpdateSubDepartmentAsync(subdept, dto);
            if (!success) return NotFound("SubDepartment not found or update failed.");

            return Ok(new { message = "Sub Department Updated Successfully" });
        }

        [HttpGet("GetSubDepartmentsByDepartmentId/{departmentId}")]
        public async Task<IActionResult> GetSubDepartmentsByDepartmentId(string departmentId)
        {
            var list = await _masterDataService.GetSubDepartmentsByDepartmentIdAsync(departmentId);
            return Ok(list);
        }

        [HttpGet("GetCountSubDepartments")]
        public async Task<IActionResult> GetCountSubDepartments()
        {
            var count = await _masterDataService.GetCountSubDepartmentsAsync();
            return Ok(new { count });
        }

        // --- Designations ---

        [Authorize(Roles = "HR")]
        [HttpPost("AddDesignation")]
        public async Task<IActionResult> AddDesignation([FromBody] DesignationDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var success = await _masterDataService.AddDesignationAsync(dto);
            if (!success) return BadRequest(new { message = "Failed to add designation." });

            return Ok(new { message = "Designation Added Successfully" });
        }

        [HttpGet("GetAllDesignations")]
        public async Task<IActionResult> GetAllDesignations()
        {
            var list = await _masterDataService.GetAllDesignationsAsync();
            return Ok(list);
        }

        [HttpGet("GetDesignationByDesignationName/{designation}")]
        public async Task<IActionResult> GetDesignationByDesignationName(string designation)
        {
            var des = await _masterDataService.GetDesignationByNameAsync(designation);
            if (des == null) return NotFound(new { message = "Designation not found." });

            return Ok(des);
        }

        [HttpGet("GetDesignationByType/{type}")]
        public async Task<IActionResult> GetDesignationByType(string type)
        {
            var list = await _masterDataService.GetDesignationsByTypeAsync(type);
            return Ok(list);
        }

        [Authorize(Roles = "HR")]
        [HttpPut("UpdateDesignation/{id}")]
        public async Task<IActionResult> UpdateDesignation(string id, [FromBody] DesignationDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var success = await _masterDataService.UpdateDesignationAsync(id, dto);
            if (!success) return NotFound("Designation not found or update failed.");

            return Ok(new { message = "Designation Updated" });
        }

        [Authorize(Roles = "HR")]
        [HttpDelete("DeleteDesignation/{id}")]
        public async Task<IActionResult> DeleteDesignation(string id)
        {
            var success = await _masterDataService.DeleteDesignationAsync(id);
            if (!success) return NotFound(new { message = "Designation not found" });

            return Ok(new { message = "Designation Deleted" });
        }

        [HttpGet("GetCountDesignations")]
        public async Task<IActionResult> GetCountDesignations()
        {
            var count = await _masterDataService.GetCountDesignationsAsync();
            return Ok(new { count });
        }
    }
}
