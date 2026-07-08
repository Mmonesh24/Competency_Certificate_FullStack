using System;
using System.ComponentModel.DataAnnotations;

namespace CompetencyCertificate.DTOs
{
    public class CertificateInitiateDto
    {
        [Required]
        public string employee_id { get; set; } = "";
    }

    public class CertificateGeneratedDto
    {
        [Required]
        public string EmployeeId { get; set; } = "";

        [Required]
        public string CompetencyCertificate { get; set; } = ""; // Base64 string

        public string? Validity { get; set; } = null;
    }

    public class CertificateDetailDto
    {
        public string EmployeeId { get; set; } = "";
        public string EmployeeName { get; set; } = "";
        public string Designation { get; set; } = "";
        public string Department { get; set; } = "";
        public string SubDepartment { get; set; } = "";
        public string CompetencyCertificateBase64 { get; set; } = "";
        public string? Validity { get; set; } = null;
    }

    public class InitiateListDto
    {
        public string EmployeeId { get; set; } = "";
        public string EmployeeName { get; set; } = "";
        public string Designation { get; set; } = "";
        public string Department { get; set; } = "";
        public string SubDepartment { get; set; } = "";
    }
}
