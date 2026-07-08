using CompetencyCertificate.Models;
using System;
using System.ComponentModel.DataAnnotations;

namespace CompetencyCertificate.DTOs
{
    public class EmployeeDto
    {
        public string Employee_id { get; set; } = "";
        public string Employee_name { get; set; } = "";
        public EmployeeType Employee_type { get; set; }
        public Category CategoryName { get; set; }
        public string? ContractorName { get; set; }
        public DateTime DOB { get; set; }
        public string EPF_UAN_NO { get; set; } = "";
        public string ESA_NO { get; set; } = "";
        public string BankName { get; set; } = "";
        public string BankAccountNumber { get; set; } = "";
        public DateTime JoiningDate { get; set; }
        public string? Designation_Name { get; set; }
        public string? DepartmentName { get; set; }
        public string? SubDepartmentName { get; set; }
        public string AadharNo { get; set; } = "";
        public string BloodGroup { get; set; } = "";
        public string? ContactNo { get; set; }
        public string? EmerContactNo { get; set; }
        public Status Status { get; set; }
        public string? PhotoBase64 { get; set; }
        public string? PassbookBase64 { get; set; }
    }

    public class EmployeeCreateDto
    {
        [Required]
        public string Employee_id { get; set; } = "";

        [Required]
        public string Employee_name { get; set; } = "";

        public string? PhotoBase64 { get; set; }

        [Required]
        public EmployeeType Employee_type { get; set; }

        [Required]
        public Category CategoryName { get; set; }

        public string? ContractorName { get; set; }

        [Required]
        public DateTime DOB { get; set; }

        [Required]
        public string EPF_UAN_NO { get; set; } = "";

        [Required]
        public string ESA_NO { get; set; } = "";

        [Required]
        public string BankName { get; set; } = "";

        [Required]
        public string BankAccountNumber { get; set; } = "";

        public string? PassbookBase64 { get; set; }

        [Required]
        public DateTime JoiningDate { get; set; }

        public string? Designation_Name { get; set; }

        public string? DepartmentName { get; set; }

        public string? SubDepartmentName { get; set; }

        [Required]
        [StringLength(12, MinimumLength = 12)]
        public string AadharNo { get; set; } = "";

        public string BloodGroup { get; set; } = "";
        public string? ContactNo { get; set; }
        public string? EmerContactNo { get; set; }
        public Status Status { get; set; }
    }

    public class EmployeeUpdateDto
    {
        [Required]
        public string Employee_name { get; set; } = "";

        public string? PhotoBase64 { get; set; }

        [Required]
        public EmployeeType Employee_type { get; set; }

        [Required]
        public Category CategoryName { get; set; }

        public string? ContractorName { get; set; }

        [Required]
        public DateTime DOB { get; set; }

        [Required]
        public string EPF_UAN_NO { get; set; } = "";

        [Required]
        public string ESA_NO { get; set; } = "";

        [Required]
        public string BankName { get; set; } = "";

        [Required]
        public string BankAccountNumber { get; set; } = "";

        public string? PassbookBase64 { get; set; }

        [Required]
        public DateTime JoiningDate { get; set; }

        public string? Designation_Name { get; set; }

        public string? DepartmentName { get; set; }

        public string? SubDepartmentName { get; set; }

        [Required]
        [StringLength(12, MinimumLength = 12)]
        public string AadharNo { get; set; } = "";

        public string BloodGroup { get; set; } = "";
        public string? ContactNo { get; set; }
        public string? EmerContactNo { get; set; }
        public Status Status { get; set; }
    }
}
