using FinancialTrackerServer.Entities;

namespace FinancialTrackerServer.DTOs.Transactions;

public class TransactionUpdateDto
{
    public string? Title { get; set; } = string.Empty;
    public string? Description { get; set; } = string.Empty;
    public int? PortfolioId { get; set; }
    public decimal? Amount { get; set; }
    public TransactionType? Type { get; set; }
}
