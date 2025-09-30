using FinancialTrackerServer.DTOs.Portfolios;
using FinancialTrackerServer.Services.Portfolios;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace FinancialTrackerServer.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class PortfolioController : ControllerBase
    {
        private readonly IPortfolioService _portfolioService;

        public PortfolioController(IPortfolioService portfolioService) => _portfolioService = portfolioService;

        [HttpPost]
        public async Task<ActionResult<PortfolioResponseDto>> CreatePortfolio([FromBody] PortfolioCreateDto dto)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userIdClaim))
                return Unauthorized("User ID not found in token");

            var userId = int.Parse(userIdClaim);

            var portfolio = await _portfolioService.CreatePortfolioAsync(dto, userId);
            return CreatedAtAction(nameof(GetPortfolioById), new { id = portfolio.Id }, portfolio);
        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult<PortfolioResponseDto>> GetPortfolioById(int id)
        {
            var portfolio = await _portfolioService.GetPortfolioByIdAsync(id);

            if (portfolio == null)
                return NotFound();

            return Ok(portfolio);
        }

        /*[HttpGet]
        public async Task<ActionResult<IEnumerable<PortfolioResponseDto>>> GetAllPortfolios()
        {
            var portfolios = await _portfolioService.GetAllPortfoliosAsync();
            return Ok(portfolios);
        }*/

        [HttpGet("me")]
        public async Task<ActionResult<IEnumerable<PortfolioResponseDto>>> GetMyPortfolios()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userIdClaim))
                return Unauthorized("User ID not found in token");

            var userId = int.Parse(userIdClaim);

            var portfolios = await _portfolioService.GetAllPortfoliosByUserAsync(userId);

            return Ok(portfolios);
        }


        [HttpPatch("{id:int}")]
        public async Task<ActionResult<PortfolioResponseDto>> UpdatePortfolio(int id, [FromBody] PortfolioUpdateDto dto)
        {
            var updated = await _portfolioService.UpdatePortfolioAsync(id, dto);

            if (updated == null)
                return NotFound();

            return Ok(updated);
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeletePortfolio(int id)
        {
            await _portfolioService.DeletePortfolioAsync(id);
            return NoContent();
        }

    }
}
