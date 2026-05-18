using Microsoft.AspNetCore.Mvc;
using backend.DTOS;
using backend.Services;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly AuthService _authService;

    public AuthController(AuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterUserDto dto)
    {
        await _authService.RegisterUserAsync(dto);

        return Ok();
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginUserDto dto)
    {
        var result = await _authService.LoginAsync(dto);

        if (result == null)
            return Unauthorized(new
            {
                message = "Invalid credentials",
                code = "AUTH_INVALID_CREDENTIALS"
            });

        Response.Cookies.Append(
            "refreshToken",
            result.RefreshToken,
            new CookieOptions
            {
                HttpOnly = true,
                Secure = false, 
                SameSite = SameSiteMode.Lax,
                Expires = DateTime.UtcNow.AddDays(7)
            });

        return Ok(new
        {
            accessToken = result.AccessToken
        });
    }

    [HttpPost("refresh")]
    public async Task<IActionResult> Refresh()
    {
        var refreshToken = Request.Cookies["refreshToken"];

        if (refreshToken == null)
            return Unauthorized();

        var result =
            await _authService.RefreshAsync(
                new RefreshTokenDto
                {
                    RefreshToken = refreshToken
                });

        if (result == null)
            return Unauthorized();

        Response.Cookies.Append(
            "refreshToken",
            result.RefreshToken,
            new CookieOptions
            {
                HttpOnly = true,
                Secure = false,
                SameSite = SameSiteMode.Lax,
                Expires = DateTime.UtcNow.AddDays(7)
            });

        return Ok(new
        {
            accessToken = result.AccessToken
        });
    }

    [HttpPost("logout")]
    public IActionResult Logout()
    {
        Response.Cookies.Delete("refreshToken");
    
        return Ok();
    }

}