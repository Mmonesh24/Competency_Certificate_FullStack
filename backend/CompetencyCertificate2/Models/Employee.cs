using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace CompetencyCertificate.Models
{
    public enum EmployeeType
    {
        Executive,
        NonExecutive
    }
    public enum Category { 
        CMRLEmployee,
        NonCMRLEmployee
    }

    public enum Status
    {
        Inservice,
        Terminated,
        Discharged,
        ReturnedBack
    }

    public class Employee
    {
        [Key]
        [MaxLength(60)]
        public string Employee_id { get; set; } = "";

        [Required]
        [MaxLength(60)]
        public string Employee_name { get; set; } = "";

        public string? PhotoBase64 { get; set; }

        [JsonIgnore]
        public byte[] Photo { get; set; } = Array.Empty<byte>();

        [Required]
        public EmployeeType Employee_type { get; set; }

        [Required]
        public Category CategoryName { get; set; }

        [MaxLength(60)]
        public string? ContractorName { get; set; }

        [ForeignKey(nameof(ContractorName))]
        [JsonIgnore]
        public Contractor? Contractor { get; set; }

        [Required]
        [DataType(DataType.Date)]
        [Column(TypeName = "date")]
        public DateTime DOB { get; set; }

        [Required]
        [MaxLength(60)]
        public string EPF_UAN_NO { get; set; } = "";

        [Required]
        [MaxLength(60)]
        public string ESA_NO { get; set; } = "";

        [Required]
        [MaxLength(60)]
        public string BankName { get; set; } = "";

        [Required]
        [MaxLength(60)]
        public string BankAccountNumber { get; set; } = "";

        [JsonIgnore]
        public byte[] Passbook { get; set; } = Array.Empty<byte>(); // Fix: Initialize with Array.Empty<byte>()

        public string? PassbookBase64 { get; set; }

        [Required]
        [DataType(DataType.Date)]
        [Column(TypeName = "date")]
        public DateTime JoiningDate { get; set; }

        [MaxLength(60)]
        [ForeignKey("Designation")]
        public string? Designation_Name { get; set; }

        [JsonIgnore]
        public Designation? Designation { get; set; }

        [MaxLength(60)]
        [ForeignKey("Department")]
        public string? DepartmentName { get; set; }

        [JsonIgnore]
        public Department? Department { get; set; }

        [MaxLength(60)]
        [ForeignKey("SubDepartment")]
        public string? SubDepartmentName { get; set; }

        [JsonIgnore]
        public SubDepartment? SubDepartment { get; set; }

        [MaxLength(256)]
        public string AadharNo { get; set; } = "";

        [MaxLength(60)]
        public string BloodGroup { get; set; } = "";

        [MaxLength(60)]
        public string? ContactNo { get; set; }

        [MaxLength(60)]
        public string? EmerContactNo { get; set; }

        public Status Status { get; set; }

        [JsonIgnore]
        public List<Generated> Generated { get; set; } = new List<Generated>();

        [JsonIgnore]
        public List<Initiate> Initiate { get; set; } = new List<Initiate>();
    }
}
