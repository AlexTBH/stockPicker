using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using backend.DTOS;

[ApiController]
[Route("api/users")]
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
            return Unauthorized("Invalid credentials");
    
        return Ok(result);
    }

    [HttpPost("refresh")]
    public async Task<IActionResult> Refresh(RefreshTokenDto dto)
    {
        var result = await _authService.RefreshAsync(dto);
    
        if (result == null)
            return Unauthorized("Invalid or expired refresh token");
    
        return Ok(result);
    }

}