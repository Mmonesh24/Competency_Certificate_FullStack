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
    public class EmployeeController : ControllerBase
    {
        private readonly IEmployeeService _employeeService;

        public EmployeeController(IEmployeeService employeeService)
        {
            _employeeService = employeeService;
        }

        [Authorize(Roles = "HR")]
        [HttpPost("AddEmployee")]
        public async Task<IActionResult> AddEmployee([FromBody] EmployeeCreateDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var success = await _employeeService.AddEmployeeAsync(dto);
            if (!success) return BadRequest(new { message = "Failed to add employee." });

            return Ok(new { message = "Employee added successfully" });
        }

        [HttpGet("GetAllEmployees")]
        public async Task<IActionResult> GetAllEmployees([FromQuery] int? pageNumber, [FromQuery] int? pageSize)
        {
            if (pageNumber.HasValue && pageSize.HasValue)
            {
                var pagedResult = await _employeeService.GetPagedEmployeesAsync(pageNumber.Value, pageSize.Value);
                return Ok(pagedResult);
            }
            var all = await _employeeService.GetAllEmployeesAsync();
            return Ok(all);
        }

        [HttpGet("GetEmployeeById/{id}")]
        public async Task<IActionResult> GetEmployeeById(string id)
        {
            var employee = await _employeeService.GetEmployeeByIdAsync(id);
            if (employee == null) return NotFound(new { message = "Employee not found" });

            return Ok(employee);
        }

        [Authorize(Roles = "HR")]
        [HttpPut("UpdateEmployee/{id}")]
        public async Task<IActionResult> UpdateEmployee(string id, [FromBody] EmployeeUpdateDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var success = await _employeeService.UpdateEmployeeAsync(id, dto);
            if (!success) return NotFound(new { message = "Employee not found or update failed." });

            return Ok(new { message = "Employee updated successfully" });
        }

        [Authorize(Roles = "HR")]
        [HttpDelete("DeleteEmployee/{id}")]
        public async Task<IActionResult> DeleteEmployee(string id)
        {
            var success = await _employeeService.DeleteEmployeeAsync(id);
            if (!success) return NotFound(new { message = "Employee not found" });

            return Ok(new { message = "Employee deleted successfully" });
        }

        [HttpGet("GetCountEmployees")]
        public async Task<IActionResult> GetCountEmployees()
        {
            var count = await _employeeService.GetCountEmployeesAsync();
            return Ok(new { count });
        }

        [HttpGet("GetCountEmployeesByDepartmentId/{departmentId}")]
        public async Task<IActionResult> GetCountEmployeesByDepartmentId(string departmentId)
        {
            var count = await _employeeService.GetCountEmployeesByDepartmentAsync(departmentId);
            return Ok(new { count });
        }

        [HttpGet("GetCountEmployeesBySubDepartmentId/{subDepartmentId}")]
        public async Task<IActionResult> GetCountEmployeesBySubDepartmentId(string subDepartmentId)
        {
            var count = await _employeeService.GetCountEmployeesBySubDepartmentAsync(subDepartmentId);
            return Ok(new { count });
        }

        [HttpGet("GetEmployeesByDepartmentId/{departmentId}")]
        public async Task<IActionResult> GetEmployeesByDepartmentId(string departmentId)
        {
            var list = await _employeeService.GetEmployeesByDepartmentAsync(departmentId);
            return Ok(list);
        }

        [HttpGet("GetEmployeesBySubDepartmentId/{subDepartmentId}")]
        public async Task<IActionResult> GetEmployeesBySubDepartmentId(string subDepartmentId)
        {
            var list = await _employeeService.GetEmployeesBySubDepartmentAsync(subDepartmentId);
            return Ok(list);
        }
    }
}
