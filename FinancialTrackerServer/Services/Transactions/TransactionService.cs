using FinancialTrackerServer.Data;
using FinancialTrackerServer.DTOs.Transactions;
using FinancialTrackerServer.Entities;
using Mapster;
using Microsoft.EntityFrameworkCore;

namespace FinancialTrackerServer.Services.Transactions;

public class TransactionService : ITransactionService
{
    private readonly AppDbContext _context;

    public TransactionService(AppDbContext context) => _context = context;

    public async Task<TransactionResponseDto> CreateTransactionAsync(TransactionCreateDto dto)
    {
        var transaction = dto.Adapt<Transaction>();
        transaction.CreatedAt = DateTime.UtcNow;
        transaction.UpdatedAt = DateTime.UtcNow;
        transaction.Date = DateTime.UtcNow;

        await _context.Transactions.AddAsync(transaction);
        await _context.SaveChangesAsync();

        return transaction.Adapt<TransactionResponseDto>();
    }

    public async Task DeleteTransactionAsync(int id)
    {
        var transaction = await _context.Transactions.FindAsync(id);

        if (transaction == null)
            throw new KeyNotFoundException($"Transaction with id {id} was not found.");

        _context.Transactions.Remove(transaction);
        await _context.SaveChangesAsync();
    }

    public async Task<TransactionResponseDto?> GetTransactionByIdAsync(int id)
    {
        var transaction = await _context.Transactions.Include(t => t.Portfolio).FirstOrDefaultAsync(t => t.Id == id);

        if (transaction == null)
            return null;

        return transaction.Adapt<TransactionResponseDto>();
    }

    public async Task<IEnumerable<TransactionResponseDto>> GetTransactionsByPortfolioAsync(int portfolioId)
    {
        var transactions = await _context.Transactions
            .Where(t => t.PortfolioId == portfolioId)
            .Include(t => t.Portfolio)
            .ToListAsync();

        return transactions.Adapt<IEnumerable<TransactionResponseDto>>();
    }


    public async Task<TransactionResponseDto> UpdateTransactionAsync(int id, TransactionUpdateDto dto)
    {
        var transaction = await _context.Transactions.FindAsync(id);

        if (transaction == null)
            throw new KeyNotFoundException($"Transaction with id {id} was not found.");

        dto.Adapt(transaction);

        transaction.UpdatedAt = DateTime.UtcNow;

        _context.Transactions.Update(transaction);
        await _context.SaveChangesAsync();

        return transaction.Adapt<TransactionResponseDto>();
    }

}
