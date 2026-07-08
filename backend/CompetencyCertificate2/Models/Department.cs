using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace CompetencyCertificate.Models
{
    public class Department
    {
        [Key]
        [MaxLength(60)]
        public string DepartmentName { get; set; } = "";
        [MaxLength(60)]
        public string DepartmentCode { get; set; } = "";
        [JsonIgnore]
        public List<SubDepartment> SubDepartments { get; set; } = new List<SubDepartment>();
        [JsonIgnore]
        public List<Employee> Employees { get; set; } = new List<Employee>();
    }
}
