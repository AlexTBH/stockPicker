namespace backend.DTOS;

public class RegisterUserDto
{
    public required string Email { get; set; }
    public required string Name { get; set; }
    public required string Password { get; set; }

}

public class LoginUserDto
{
    public required string Email { get; set; }
    public required string Password { get; set; } 
}

public class AuthResultDto
{
    public string AccessToken { get; set; } = null!;
    public string RefreshToken { get; set; } = null!;
}

public class RefreshTokenDto
{
    public string RefreshToken { get; set; } = null!;
}