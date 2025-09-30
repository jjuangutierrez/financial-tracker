﻿namespace FinancialTrackerServer.DTOs.Users;

public class UserUpdateDto
{
    public string? FirstName { get; set; } = string.Empty;
    public string? LastName { get; set; } = string.Empty;
    public string? Email { get; set; } = string.Empty;
    public string? PasswordHash { get; set; } = string.Empty;
}
