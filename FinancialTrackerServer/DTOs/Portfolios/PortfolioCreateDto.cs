namespace FinancialTrackerServer.DTOs.Portfolios;

public class PortfolioCreateDto
{
    public int UserId { get; set; }
    public string PortfolioName { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
}
