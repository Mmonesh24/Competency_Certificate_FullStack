using System.ComponentModel.DataAnnotations;

namespace CompetencyCertificate.DTOs
{
    public class LoginRequestDto
    {
        [Required]
        public string EmployeeId { get; set; } = "";

        [Required]
        public string Password { get; set; } = "";
    }

    public class LoginResponseDto
    {
        public string Token { get; set; } = "";
        public string Message { get; set; } = "";
        public UserDetailsDto EmployeeDetails { get; set; } = new UserDetailsDto();
    }

    public class UserDetailsDto
    {
        public string Employee_id { get; set; } = "";
        public string Employee_name { get; set; } = "";
        public int? Employee_type { get; set; }
        public string? Designation_Name { get; set; }
        public string? DepartmentName { get; set; }
        public string? SubDepartmentName { get; set; }
        public string? ContractorName { get; set; }
        public string Role { get; set; } = "";
    }

    public class EmployeeRegisterDto
    {
        [Required]
        public string EmployeeId { get; set; } = "";

        [Required]
        public string Password { get; set; } = "";
    }

    public class HRRegisterDto
    {
        [Required]
        public string EmployeeId { get; set; } = "";

        [Required]
        public string Password { get; set; } = "";

        public string Designation { get; set; } = "HR";
    }
}
