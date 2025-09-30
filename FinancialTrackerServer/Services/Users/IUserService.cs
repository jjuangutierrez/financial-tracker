using FinancialTrackerServer.DTOs.Users;

namespace FinancialTrackerServer.Services.Users;

public interface IUserService
{
    Task<UserResponseDto> GetByIdAsync(int userId);
    Task<UserResponseDto> UpdateAsync(int userId, UserUpdateDto dto);
    Task DeleteAsync(int userId);
}
