using backend.DTOS;
using backend.Models;
using backend.Common;

namespace backend.Mapper;

public static class UserMapper
{
    public static User DtoToUser(RegisterUserDto dto)
    {
        var user = new User
        {
            Name = dto.Name,
            Email = EmailHelper.Normalize(dto.Email),
            Role = Role.User
        };

        return user;
    }
}