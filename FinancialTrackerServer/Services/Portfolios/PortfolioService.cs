using FinancialTrackerServer.Data;
using FinancialTrackerServer.DTOs.Portfolios;
using FinancialTrackerServer.Entities;
using Mapster;
using Microsoft.EntityFrameworkCore;

namespace FinancialTrackerServer.Services.Portfolios;

public class PortfolioService : IPortfolioService
{
    private readonly AppDbContext _context;

    public PortfolioService(AppDbContext context) => _context = context;

    public async Task<PortfolioResponseDto> CreatePortfolioAsync(PortfolioCreateDto dto, int userId)
    {
        // Validar que el usuario existe
        var userExists = await _context.Users.AnyAsync(u => u.Id == userId);
        if (!userExists)
            throw new KeyNotFoundException($"User with id {userId} not found");

        var portfolio = dto.Adapt<Portfolio>();
        portfolio.UserId = userId;
        portfolio.CreatedAt = DateTime.UtcNow;
        portfolio.UpdatedAt = DateTime.UtcNow;

        await _context.Portfolios.AddAsync(portfolio);
        await _context.SaveChangesAsync();

        return portfolio.Adapt<PortfolioResponseDto>();
    }


    public async Task DeletePortfolioAsync(int id)
    {
        var portfolio = await _context.Portfolios.FindAsync(id);

        if (portfolio == null)
            throw new KeyNotFoundException($"Portfolio with id {id} was not found");

        _context.Portfolios.Remove(portfolio);
        await _context.SaveChangesAsync();
    }

    public async Task<IEnumerable<PortfolioResponseDto>> GetAllPortfoliosAsync()
    {
        var portfolios = await _context.Portfolios
            .Include(p => p.Transactions)
            .ToListAsync();

        return portfolios.Adapt<IEnumerable<PortfolioResponseDto>>();
    }

    public async Task<IEnumerable<PortfolioResponseDto>> GetAllPortfoliosByUserAsync(int userId)
    {
        var portfolios = await _context.Portfolios
            .Where(p => p.UserId == userId)
            .ToListAsync();

        return portfolios.Select(p => new PortfolioResponseDto
        {
            Id = p.Id,
            PortfolioName = p.PortfolioName,
            Description = p.Description,
            CreatedAt = p.CreatedAt
        });
    }


    public async Task<PortfolioResponseDto?> GetPortfolioByIdAsync(int id)
    {
        var portfolio = await _context.Portfolios.FindAsync(id);

        if (portfolio == null)
            return null;

        return portfolio.Adapt<PortfolioResponseDto>();
    }

    public async Task<PortfolioResponseDto> UpdatePortfolioAsync(int id, PortfolioUpdateDto dto)
    {
        var portfolio = await _context.Portfolios.FindAsync(id);

        if (portfolio == null)
            throw new KeyNotFoundException($"Portfolio with id {id} was not found");

        // Evitamos que el UserId se sobreescriba
        if (!string.IsNullOrEmpty(dto.PortfolioName))
            portfolio.PortfolioName = dto.PortfolioName;

        if (!string.IsNullOrEmpty(dto.Description))
            portfolio.Description = dto.Description;

        portfolio.UpdatedAt = DateTime.UtcNow;

        _context.Portfolios.Update(portfolio);
        await _context.SaveChangesAsync();

        return portfolio.Adapt<PortfolioResponseDto>();
    }

}
