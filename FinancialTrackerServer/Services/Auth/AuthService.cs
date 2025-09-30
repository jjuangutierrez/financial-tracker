using FinancialTrackerServer.Data;
using FinancialTrackerServer.DTOs.Users;
using FinancialTrackerServer.Entities;
using FinancialTrackerServer.Services.JWT;
using Mapster;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;

namespace FinancialTrackerServer.Services.Auth;

public class AuthService : IAuthService
{
    private readonly AppDbContext _context;
    private readonly PasswordHasher<User> _passwordHasher;
    private readonly IJwtService _jwtService;

    public AuthService(AppDbContext context, IJwtService jwtService)
    {
        _context = context;
        _passwordHasher = new PasswordHasher<User>();
        _jwtService = jwtService;
    }

    public async Task<AuthResponse> LoginAsync(LoginUserDto dto)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);
        if (user == null)
            throw new Exception("Invalid credentials");

        var result = _passwordHasher.VerifyHashedPassword(user, user.PasswordHash, dto.Password);
        if (result == PasswordVerificationResult.Failed)
            throw new Exception("Invalid credentials");

        var token = _jwtService.GenerateToken(user);
        var refreshToken = await GenerateRefreshTokenAsync(user.Id);

        return new AuthResponse
        {
            Token = token,
            RefreshToken = refreshToken,
            Expiration = _jwtService.GetExpiration(),
            User = user.Adapt<UserResponseDto>(),
        };
    }

    public async Task<AuthResponse> RegisterAsync(UserRegisterDto dto)
    {
        if (dto.Password != dto.ConfirmPassword)
            throw new ArgumentException("The passwords do not match");

        if (await _context.Users.AnyAsync(u => u.Email == dto.Email))
            throw new ArgumentException("Email is already registered");

        var user = dto.Adapt<User>();
        user.PasswordHash = _passwordHasher.HashPassword(user, dto.Password);
        user.CreatedAt = DateTime.UtcNow;
        user.UpdatedAt = DateTime.UtcNow;

        await _context.Users.AddAsync(user);
        await _context.SaveChangesAsync();

        var refreshToken = await GenerateRefreshTokenAsync(user.Id);

        return new AuthResponse
        {
            Token = _jwtService.GenerateToken(user),
            RefreshToken = refreshToken,
            Expiration = _jwtService.GetExpiration(),
            User = user.Adapt<UserResponseDto>()
        };
    }

    public async Task<AuthResponse> RefreshTokenAsync(string token)
    {
        var refreshToken = await _context.RefreshTokens
            .Include(rt => rt.User)
            .FirstOrDefaultAsync(rt => rt.Token == token);

        if (refreshToken == null)
            throw new Exception("Invalid refresh token");

        if (refreshToken.IsRevoked)
            throw new Exception("Refresh token has been revoked");

        if (refreshToken.ExpiresAt < DateTime.UtcNow)
            throw new Exception("Refresh token has expired");

        // Revocar el token anterior
        refreshToken.IsRevoked = true;
        refreshToken.RevokedAt = DateTime.UtcNow;

        // Generar nuevos tokens
        var newAccessToken = _jwtService.GenerateToken(refreshToken.User);
        var newRefreshToken = await GenerateRefreshTokenAsync(refreshToken.UserId);

        await _context.SaveChangesAsync();

        return new AuthResponse
        {
            Token = newAccessToken,
            RefreshToken = newRefreshToken,
            Expiration = _jwtService.GetExpiration(),
            User = refreshToken.User.Adapt<UserResponseDto>()
        };
    }

    public async Task RevokeTokenAsync(string token)
    {
        var refreshToken = await _context.RefreshTokens
            .FirstOrDefaultAsync(rt => rt.Token == token);

        if (refreshToken != null && !refreshToken.IsRevoked)
        {
            refreshToken.IsRevoked = true;
            refreshToken.RevokedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
        }
    }

    private async Task<string> GenerateRefreshTokenAsync(int userId)
    {
        var randomBytes = new byte[64];
        using var rng = RandomNumberGenerator.Create();
        rng.GetBytes(randomBytes);
        var token = Convert.ToBase64String(randomBytes);

        var refreshToken = new RefreshToken
        {
            Token = token,
            UserId = userId,
            CreatedAt = DateTime.UtcNow,
            ExpiresAt = DateTime.UtcNow.AddDays(7),
            IsRevoked = false
        };

        await _context.RefreshTokens.AddAsync(refreshToken);
        await _context.SaveChangesAsync();

        return token;
    }
}