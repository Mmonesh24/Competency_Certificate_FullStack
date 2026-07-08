using CompetencyCertificate.DTOs;
using CompetencyCertificate.Models;
using CompetencyCertificate.Repositories;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace CompetencyCertificate.Services
{
    public class AuthService : IAuthService
    {
        private readonly IGenericRepository<EmployeeLogin> _employeeLoginRepo;
        private readonly IGenericRepository<HRLogin> _hrLoginRepo;
        private readonly IEmployeeRepository _employeeRepo;
        private readonly IConfiguration _configuration;

        public AuthService(
            IGenericRepository<EmployeeLogin> employeeLoginRepo,
            IGenericRepository<HRLogin> hrLoginRepo,
            IEmployeeRepository employeeRepo,
            IConfiguration configuration)
        {
            _employeeLoginRepo = employeeLoginRepo;
            _hrLoginRepo = hrLoginRepo;
            _employeeRepo = employeeRepo;
            _configuration = configuration;
        }

        public async Task<LoginResponseDto?> LoginAsync(LoginRequestDto request)
        {
            // 1. Try EmployeeLogin
            var employeeLogins = await _employeeLoginRepo.FindAsync(e => e.employee_id == request.EmployeeId);
            var employeeLogin = employeeLogins.FirstOrDefault();
            if (employeeLogin != null && !string.IsNullOrEmpty(employeeLogin.Password) && BCrypt.Net.BCrypt.Verify(request.Password, employeeLogin.Password))
            {
                var employeeDetails = await _employeeRepo.GetEmployeeWithRelationsAsync(request.EmployeeId);
                if (employeeDetails == null) return null;

                string role = "Employee";
                if (employeeDetails.Designation_Name == "HR" || 
                    employeeDetails.DepartmentName == "HR" || 
                    (employeeDetails.DepartmentName != null && employeeDetails.DepartmentName.ToLower() == "human resource"))
                {
                    role = "HR";
                }
                else if (employeeDetails.Employee_type == EmployeeType.Executive && 
                         (employeeDetails.Designation_Name == "HOD" || 
                          (employeeDetails.Designation_Name != null && employeeDetails.Designation_Name.ToLower() == "head of department")))
                {
                    role = "HOD";
                }
                else if (employeeDetails.Employee_type == EmployeeType.Executive)
                {
                    role = "Executive";
                }

                var token = GenerateJwtToken(employeeDetails.Employee_id, role);
                return new LoginResponseDto
                {
                    Token = token,
                    Message = "Executive Login successful",
                    EmployeeDetails = new UserDetailsDto
                    {
                        Employee_id = employeeDetails.Employee_id,
                        Employee_name = employeeDetails.Employee_name,
                        Employee_type = (int)employeeDetails.Employee_type,
                        Designation_Name = employeeDetails.Designation_Name,
                        DepartmentName = employeeDetails.DepartmentName,
                        SubDepartmentName = employeeDetails.SubDepartmentName,
                        ContractorName = employeeDetails.ContractorName,
                        Role = role
                    }
                };
            }

            // 2. Try HRLogin
            var hrLogins = await _hrLoginRepo.FindAsync(e => e.employee_id == request.EmployeeId);
            var hrLogin = hrLogins.FirstOrDefault();
            if (hrLogin != null && !string.IsNullOrEmpty(hrLogin.Password) && BCrypt.Net.BCrypt.Verify(request.Password, hrLogin.Password))
            {
                string role = "HR";
                var token = GenerateJwtToken(hrLogin.employee_id ?? "", role);
                return new LoginResponseDto
                {
                    Token = token,
                    Message = "HR Login successful",
                    EmployeeDetails = new UserDetailsDto
                    {
                        Employee_id = hrLogin.employee_id ?? "",
                        Employee_name = "HR Administrator",
                        Designation_Name = hrLogin.Designation,
                        Role = role
                    }
                };
            }

            return null;
        }

        public async Task<bool> RegisterEmployeeAsync(EmployeeRegisterDto request)
        {
            var existing = await _employeeLoginRepo.GetByIdAsync(request.EmployeeId);
            if (existing != null) return false;

            var hashedPassword = BCrypt.Net.BCrypt.HashPassword(request.Password);
            var login = new EmployeeLogin
            {
                employee_id = request.EmployeeId,
                Password = hashedPassword
            };

            await _employeeLoginRepo.AddAsync(login);
            return await _employeeLoginRepo.SaveChangesAsync();
        }

        public async Task<bool> RegisterHRAsync(HRRegisterDto request)
        {
            var existing = await _hrLoginRepo.GetByIdAsync(request.EmployeeId);
            if (existing != null) return false;

            var hashedPassword = BCrypt.Net.BCrypt.HashPassword(request.Password);
            var hrLogin = new HRLogin
            {
                employee_id = request.EmployeeId,
                Password = hashedPassword,
                Designation = request.Designation
            };

            await _hrLoginRepo.AddAsync(hrLogin);
            return await _hrLoginRepo.SaveChangesAsync();
        }

        public async Task<bool> DeleteEmployeeLoginAsync(string id)
        {
            var login = await _employeeLoginRepo.GetByIdAsync(id);
            if (login == null) return false;

            _employeeLoginRepo.Remove(login);
            return await _employeeLoginRepo.SaveChangesAsync();
        }

        private string GenerateJwtToken(string userId, string role)
        {
            var jwtSecret = Environment.GetEnvironmentVariable("JWT_SECRET") 
                ?? _configuration["AppSettings:JWTSecret"];
            var signInKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret ?? "your-super-secret-jwt-key-that-is-at-least-32-characters-long-for-security"));
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.NameIdentifier, userId),
                    new Claim(ClaimTypes.Role, role)
                }),
                Expires = DateTime.UtcNow.AddMinutes(60),
                SigningCredentials = new SigningCredentials(signInKey, SecurityAlgorithms.HmacSha256Signature)
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}
