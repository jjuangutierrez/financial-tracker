using FinancialTrackerServer.Entities;

namespace FinancialTrackerServer.DTOs.Portfolios;

public class PortfolioUpdateDto
{
    public int? UserId { get; set; }
    public string? PortfolioName { get; set; } = string.Empty;
    public string? Description { get; set; } = string.Empty;
}
