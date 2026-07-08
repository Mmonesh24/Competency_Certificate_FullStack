using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace CompetencyCertificate.Models
{
    public class Generated
    {
        [Key]
        [MaxLength(60)]
        [ForeignKey("Employee")]
        public string EmployeeId { get; set; } = "";
        [JsonIgnore]
        
        public Employee? Employee { get; set; }
        [Required]
        public byte[] CompetencyCertificate { get; set; } = Array.Empty<byte>();
        [MaxLength(60)]
        public string? Validity { get; set; } = null;
    }
}
