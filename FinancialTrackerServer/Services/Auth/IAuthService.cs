using FinancialTrackerServer.DTOs.Users;

namespace FinancialTrackerServer.Services.Auth;

public interface IAuthService
{
    Task<AuthResponse> LoginAsync(LoginUserDto dto);
    Task<AuthResponse> RegisterAsync(UserRegisterDto dto);
}
