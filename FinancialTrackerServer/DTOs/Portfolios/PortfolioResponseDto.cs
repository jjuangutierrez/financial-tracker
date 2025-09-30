using FinancialTrackerServer.DTOs.Transactions;
using FinancialTrackerServer.DTOs.Users;

namespace FinancialTrackerServer.DTOs.Portfolios;

public class PortfolioResponseDto
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string PortfolioName { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    public UserResponseDto User { get; set; } = null!;
    public ICollection<TransactionResponseDto> Transactions { get; set; } = new List<TransactionResponseDto>();
}
