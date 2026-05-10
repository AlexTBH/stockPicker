namespace Models;

public class User
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public required string PasswordHash { get; set; }

    public string? RefreshToken { get; set; }
    public DateTime? RefreshTokenExpiryTime { get; set; }
}