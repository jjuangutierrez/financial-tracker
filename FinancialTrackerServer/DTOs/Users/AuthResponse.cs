namespace FinancialTrackerServer.DTOs.Users;

public class AuthResponse
{
    public string Token { get; set; } = string.Empty;
    public string RefreshToken { get; set; } = string.Empty;
    public DateTime Expiration { get; set; }
    public UserResponseDto User { get; set; } = null!;
}