using CompetencyCertificate.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;
using System.Threading.Tasks;

namespace CompetencyCertificate.Controllers
{
    [Route("api/User/AI")]
    [ApiController]
    [Authorize]
    public class AiController : ControllerBase
    {
        private readonly IAiService _aiService;

        public AiController(IAiService aiService)
        {
            _aiService = aiService;
        }

        [HttpPost("AssessCompetency")]
        public async Task<IActionResult> AssessCompetency([FromBody] CompetencyAssessmentRequest request)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var result = await _aiService.AssessCompetencyAsync(
                request.Designation,
                request.Department,
                request.SafetyScore,
                request.Remarks
            );

            return Ok(new { assessment = result });
        }

        [HttpPost("ParseDocument")]
        public async Task<IActionResult> ParseDocument([FromBody] DocumentParseRequest request)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var result = await _aiService.ParseDocumentAsync(request.Base64Image, request.MimeType);
            return Content(result, "application/json");
        }

        [HttpPost("Chat")]
        public async Task<IActionResult> Chat([FromBody] ChatRequest request)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var result = await _aiService.AskChatbotAsync(request.Message, request.Context ?? "");
            return Ok(new { reply = result });
        }
    }

    public class CompetencyAssessmentRequest
    {
        [Required]
        public string Designation { get; set; } = "";
        [Required]
        public string Department { get; set; } = "";
        [Required]
        public string SafetyScore { get; set; } = "";
        public string Remarks { get; set; } = "";
    }

    public class DocumentParseRequest
    {
        [Required]
        public string Base64Image { get; set; } = "";
        [Required]
        public string MimeType { get; set; } = "image/png";
    }

    public class ChatRequest
    {
        [Required]
        public string Message { get; set; } = "";
        public string? Context { get; set; }
    }
}
