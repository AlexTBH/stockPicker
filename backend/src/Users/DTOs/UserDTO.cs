using backend.Models;

namespace backend.DTOS;

public class UserDto
{
    public int Id { get; set; }
    public string Email { get; set; } = null!;
    public string Name { get; set; } = null!;
    public Role Role { get; set;}
}