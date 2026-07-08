using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace CompetencyCertificate.Models
{
    public class Initiate
    {
        [Key]
        [MaxLength(60)]
        
        public string employee_id { get; set; } = "";
        
        public int ApprovalLevel { get; set; } = 0;

        [JsonIgnore]
        [ForeignKey("employee_id")]
        public Employee? Employee { get; set; }
    }
}
