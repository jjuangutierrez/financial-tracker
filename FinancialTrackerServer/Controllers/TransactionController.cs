using FinancialTrackerServer.DTOs.Transactions;
using FinancialTrackerServer.Services.Transactions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace FinancialTrackerServer.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class TransactionController : ControllerBase
{
    private readonly ITransactionService _transactionService;

    public TransactionController(ITransactionService transactionService)
    {
        _transactionService = transactionService;
    }

    [HttpPost]
    public async Task<ActionResult<TransactionResponseDto>> CreateTransaction([FromBody] TransactionCreateDto dto)
    {
        var transaction = await _transactionService.CreateTransactionAsync(dto);
        return CreatedAtAction(nameof(GetTransactionById), new { id = transaction.Id }, transaction);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<TransactionResponseDto>> GetTransactionById(int id)
    {
        var transaction = await _transactionService.GetTransactionByIdAsync(id);
        if (transaction == null)
            return NotFound();

        return Ok(transaction);
    }

    [HttpGet("portfolio/{portfolioId:int}")]
    public async Task<ActionResult<IEnumerable<TransactionResponseDto>>> GetTransactionsByPortfolio(int portfolioId)
    {
        var transactions = await _transactionService.GetTransactionsByPortfolioAsync(portfolioId);
        return Ok(transactions);
    }

    [HttpPatch("{id:int}")]
    public async Task<ActionResult<TransactionResponseDto>> UpdateTransaction(int id, [FromBody] TransactionUpdateDto dto)
    {
        try
        {
            var updatedTransaction = await _transactionService.UpdateTransactionAsync(id, dto);
            return Ok(updatedTransaction);
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteTransaction(int id)
    {
        try
        {
            await _transactionService.DeleteTransactionAsync(id);
            return NoContent();
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
    }

}
