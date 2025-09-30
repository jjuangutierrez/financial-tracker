namespace FinancialTrackerServer.Entities;

public class Portfolio
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string PortfolioName { get; set; } = string.Empty;
    public string Description { get; set; }= string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    public User User { get; set; } = null!;
    public ICollection<Transaction> Transactions { get; set; } = new List<Transaction>();
}
