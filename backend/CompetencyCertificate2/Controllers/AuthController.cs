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
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [AllowAnonymous]
        [HttpPost("Login")]
        public async Task<IActionResult> Login([FromBody] LoginRequestDto loginDto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var response = await _authService.LoginAsync(loginDto);
            if (response == null)
            {
                return Unauthorized("Invalid Employee ID or Password.");
            }

            return Ok(response);
        }

        [Authorize(Roles = "HR")]
        [HttpPost("AddEmployeeLogin")]
        public async Task<IActionResult> AddEmployeeLogin([FromBody] EmployeeRegisterDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var success = await _authService.RegisterEmployeeAsync(dto);
            if (!success) return BadRequest(new { message = "Failed to add employee login (possibly already exists)" });

            return Ok(new { message = "Employee login added successfully" });
        }

        [Authorize(Roles = "HR")]
        [HttpPost("AddHRLogin")]
        public async Task<IActionResult> AddHRLogin([FromBody] HRRegisterDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var success = await _authService.RegisterHRAsync(dto);
            if (!success) return BadRequest(new { message = "Failed to add HR login (possibly already exists)" });

            return Ok(new { message = "HR login added successfully" });
        }

        [Authorize(Roles = "HR")]
        [HttpDelete("EmployeeLoginDelete/{id}")]
        public async Task<IActionResult> DeleteEmployeeLogin(string id)
        {
            var success = await _authService.DeleteEmployeeLoginAsync(id);
            if (!success) return NotFound(new { message = "Employee login not found" });

            return Ok(new { message = "Employee login deleted" });
        }

        [AllowAnonymous]
        [HttpPost("ForgotPassword")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest request)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var success = await _authService.ForgotPasswordAsync(request.EmployeeId);
            if (!success) return NotFound(new { message = "Employee ID not found." });

            return Ok(new { message = "Reset code sent successfully to registered email." });
        }

        [AllowAnonymous]
        [HttpPost("ResetPassword")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequest request)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var success = await _authService.ResetPasswordAsync(request.EmployeeId, request.Token, request.NewPassword);
            if (!success) return BadRequest(new { message = "Invalid reset token or employee ID." });

            return Ok(new { message = "Password reset successfully." });
        }
    }

    public class ForgotPasswordRequest
    {
        public string EmployeeId { get; set; } = "";
    }

    public class ResetPasswordRequest
    {
        public string EmployeeId { get; set; } = "";
        public string Token { get; set; } = "";
        public string NewPassword { get; set; } = "";
    }
}
