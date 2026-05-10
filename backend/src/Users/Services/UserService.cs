using backend.Models;
using backend.DTOS;
using backend.Mapper;
using backend.Common;

public class UserService
{

    private readonly IUserRepository _userRepository;
    public UserService(IUserRepository userRepository, JwtService jwtService)
    {
        _userRepository = userRepository;
    }

    public async Task EnsureEmailIsAvailable(string email)
    {
        var exists = await _userRepository.GetByEmailAsync(email);

        if (exists != null) 
            throw new Exception("Email already in use");
    }

}