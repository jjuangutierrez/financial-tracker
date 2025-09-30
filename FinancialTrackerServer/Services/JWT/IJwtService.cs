using FinancialTrackerServer.Entities;

namespace FinancialTrackerServer.Services.JWT;

public interface IJwtService
{
    string GenerateToken(User user);
    DateTime GetExpiration();
}
