using FinancialTrackerServer.Data;
using FinancialTrackerServer.DTOs.Portfolios;
using FinancialTrackerServer.DTOs.Users;
using Mapster;
using Microsoft.EntityFrameworkCore;
using System.Data.Entity;

namespace FinancialTrackerServer.Services.Users;

public class UserService : IUserService
{
    private readonly AppDbContext _context;

    public UserService(AppDbContext context) => _context = context;

    public async Task DeleteAsync(int userId)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);

        if (user == null)
            throw new KeyNotFoundException($"User with ID {userId} not found.");

        _context.Users.Remove(user);
        await _context.SaveChangesAsync();
    }


    public async Task<UserResponseDto> GetByIdAsync(int userId)
    {
        var user = _context.Users.FindAsync(userId);

        if (user == null)
            throw new KeyNotFoundException($"User with ID {userId} not found");

        return user.Adapt<UserResponseDto>();
    }

    public async Task<UserResponseDto> UpdateAsync(int userId, UserUpdateDto dto)
    {
        var user = await _context.Users.FindAsync(userId);

        if (user == null)
            throw new KeyNotFoundException($"User with id {userId} was not found");

        dto.Adapt(user);

        user.UpdatedAt = DateTime.UtcNow;

        _context.Users.Update(user);
        await _context.SaveChangesAsync();

        return user.Adapt<UserResponseDto>();
    }
}
