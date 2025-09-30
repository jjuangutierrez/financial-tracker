namespace FinancialTrackerServer.Entities;

public class Transaction
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public int PortfolioId { get; set; }
    public decimal Amount { get; set; }
    public TransactionType Type { get; set; }

    public DateTime Date { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    public Portfolio Portfolio { get; set; } = null!;
}
