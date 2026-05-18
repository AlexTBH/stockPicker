using backend.Models;
using backend.DTOS;
using backend.Mapper;
using backend.Common;

namespace backend.Services;

public class UserService
{
    private readonly IUserRepository _userRepository;
    private readonly PortfolioService _portfolioService;

    public UserService(
        IUserRepository userRepository,
        PortfolioService portfolioService)
    {
        _userRepository = userRepository;
        _portfolioService = portfolioService;
    }

    public async Task CreateUserAsync(RegisterUserDto userDto)
    {
        var email = EmailHelper.Normalize(userDto.Email);
        await EnsureEmailIsAvailable(email);

        var user = UserMapper.DtoToUser(userDto);

        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(userDto.Password);

        await _userRepository.AddAsync(user);

        await _portfolioService.CreateDefaultPortfolioAsync(user.Id);
    }

    public async Task<List<UserDto>> GetAllAsync()
    {
        var users = await _userRepository.GetAllAsync();

        return users.Select(u => new UserDto
        {
            Id = u.Id,
            Email = u.Email,
            Name = u.Name,
            Role = u.Role
        }).ToList();
    }

    public async Task EnsureEmailIsAvailable(string email)
    {
        var exists = await _userRepository.GetByEmailAsync(email);

        if (exists != null)
            throw new Exception("Email already in use");
    }
}