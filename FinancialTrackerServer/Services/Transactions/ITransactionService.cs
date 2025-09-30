using FinancialTrackerServer.DTOs.Transactions;

namespace FinancialTrackerServer.Services.Transactions;

public interface ITransactionService
{
    Task<TransactionResponseDto> CreateTransactionAsync(TransactionCreateDto dto);
    Task<TransactionResponseDto?> GetTransactionByIdAsync(int id);
    Task<IEnumerable<TransactionResponseDto>> GetTransactionsByPortfolioAsync(int portfolioId);
    Task<TransactionResponseDto> UpdateTransactionAsync(int id, TransactionUpdateDto dto);
    Task DeleteTransactionAsync(int id);
}
