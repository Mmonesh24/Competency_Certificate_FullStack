using CompetencyCertificate.DTOs;
using CompetencyCertificate.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace CompetencyCertificate.Controllers
{
    [Route("api/User")]
    [ApiController]
    [Authorize]
    public class ContractorController : ControllerBase
    {
        private readonly IContractorService _contractorService;

        public ContractorController(IContractorService contractorService)
        {
            _contractorService = contractorService;
        }

        [Authorize(Roles = "HR")]
        [HttpPost("AddContractor")]
        public async Task<IActionResult> AddContractor([FromBody] ContractorDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var success = await _contractorService.AddContractorAsync(dto);
            if (!success) return BadRequest(new { message = "Failed to add contractor." });

            return Ok(new { message = "Contractor added successfully" });
        }

        [HttpGet("GetAllContractors")]
        public async Task<IActionResult> GetAllContractors()
        {
            var list = await _contractorService.GetAllContractorsAsync();
            return Ok(list);
        }

        [HttpGet("GetContractorByName/{contractorName}")]
        public async Task<IActionResult> GetContractorByName(string contractorName)
        {
            var contractor = await _contractorService.GetContractorByNameAsync(contractorName);
            if (contractor == null) return NotFound(new { message = "Contractor not found." });

            return Ok(contractor);
        }

        [Authorize(Roles = "HR")]
        [HttpPut("EditContractor/{contractorname}")]
        public async Task<IActionResult> EditContractor(string contractorname, [FromBody] ContractorDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var success = await _contractorService.UpdateContractorAsync(contractorname, dto);
            if (!success) return NotFound("Contractor not found or update failed.");

            return Ok(new { message = "Contractor Updated" });
        }

        [HttpGet("GetCountContractors")]
        public async Task<IActionResult> GetCountContractors()
        {
            var count = await _contractorService.GetCountContractorsAsync();
            return Ok(count);
        }
    }
}
