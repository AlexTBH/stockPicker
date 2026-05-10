using backend.Models;
using backend.DTOS;
using backend.Mapper;
using backend.Common;

public class AuthService
{

    private readonly UserService _userService;
    private readonly JwtService _jwtService;
    private readonly IUserRepository _userRepository;
    public AuthService(UserService userService, JwtService jwtService, IUserRepository userRepository)
    {
         _userService = userService;
        _jwtService = jwtService;
        _userRepository = userRepository;
    }

    public async Task RegisterUserAsync(RegisterUserDto dto)
    {
        var email = EmailHelper.Normalize(dto.Email);

        await _userService.EnsureEmailIsAvailable(email);

        var user = UserMapper.DtoToUser(dto);

        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password);

        await _userRepository.AddAsync(user);
    }
    
    public async Task<AuthResultDto?> LoginAsync(LoginUserDto dto)
    {
        var user = await _userRepository.GetByEmailAsync(EmailHelper.Normalize(dto.Email));

        if (user == null)
            return null;

        bool isValid = BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash);

        if (!isValid)
            return null;

        return await GenerateAuthResponseAsync(user);
    }

    public async Task<AuthResultDto?> RefreshAsync(RefreshTokenDto dto)
    {
        var user = await _userRepository.GetByRefreshTokenAsync(dto.RefreshToken);
    
        if (user == null)
            return null;
    
        if (user.RefreshTokenExpiryTime < DateTime.UtcNow)
            return null;
    
        return await GenerateAuthResponseAsync(user);
    }

    private async Task<AuthResultDto> GenerateAuthResponseAsync(User user)
    {
        var newAccessToken = _jwtService.GenerateToken(user);

        var newRefreshToken = _jwtService.GenerateRefreshToken();

        user.RefreshToken = newRefreshToken;
        user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7);

        await _userRepository.UpdateAsync(user);

        return new AuthResultDto
        {
            AccessToken = newAccessToken,
            RefreshToken = newRefreshToken
        };
    }

}