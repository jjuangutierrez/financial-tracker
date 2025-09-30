using FinancialTrackerServer.DTOs.Portfolios;
using FinancialTrackerServer.DTOs.Transactions;

namespace FinancialTrackerServer.Services.Portfolios;

public interface IPortfolioService
{
    Task<PortfolioResponseDto> CreatePortfolioAsync(PortfolioCreateDto dto, int userId);
    Task<PortfolioResponseDto?> GetPortfolioByIdAsync(int id);
    Task<IEnumerable<PortfolioResponseDto>> GetAllPortfoliosAsync();
    Task<IEnumerable<PortfolioResponseDto>> GetAllPortfoliosByUserAsync(int userId);
    Task<PortfolioResponseDto> UpdatePortfolioAsync(int id, PortfolioUpdateDto dto);
    Task DeletePortfolioAsync(int id);
}
