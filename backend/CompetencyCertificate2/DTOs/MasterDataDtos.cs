using CompetencyCertificate.Models;
using System.ComponentModel.DataAnnotations;

namespace CompetencyCertificate.DTOs
{
    public class DepartmentDto
    {
        [Required]
        public string DepartmentName { get; set; } = "";
        public string? DepartmentCode { get; set; }
    }

    public class SubDepartmentDto
    {
        [Required]
        public string SubDepartmentName { get; set; } = "";

        [Required]
        public string DepartmentName { get; set; } = "";
    }

    public class DesignationDto
    {
        [Required]
        public string Designation_Name { get; set; } = "";
        public string? DesignationCode { get; set; }
        public EmployeeType designation_type { get; set; }
    }

    public class ContractorDto
    {
        [Required]
        public string ContractorName { get; set; } = "";
        public string? LogoBase64 { get; set; }
    }
}
