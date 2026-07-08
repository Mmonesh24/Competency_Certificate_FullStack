using Swashbuckle.AspNetCore.Annotations;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace CompetencyCertificate.Models
{
    public class HRLogin
    {
        [Key]
        [MaxLength(60)]
        public string? employee_id { get; set; }

        [MaxLength(256)]
        public string? Password { get; set; } = "";
        [MaxLength(60)]
        [SwaggerIgnore]
        public string Designation { get; set; } = "HR";
    }
}
