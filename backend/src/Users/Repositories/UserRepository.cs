using backend.DTOS;
using dbContext;
using Microsoft.EntityFrameworkCore;
using backend.Models;

public interface IUserRepository 
{
    Task AddAsync(User user);
    Task<User?> GetByEmailAsync(string email);
    Task UpdateAsync(User user);
    Task<User?> GetByRefreshTokenAsync(string refreshToken);
}

public class UserRepository : IUserRepository
{
    private readonly AppDbContext _db;

    public UserRepository(AppDbContext dbContext)
    {
        _db = dbContext;
    }

    public async Task AddAsync(User user)
    {
        await _db.AddAsync(user);
        await _db.SaveChangesAsync();
    }

    public async Task<User?> GetByEmailAsync(string email)
    {
        return await _db.Users.FirstOrDefaultAsync(u => u.Email == email);
    } 

    public async Task UpdateAsync(User user)
    {
        _db.Users.Update(user);
        await _db.SaveChangesAsync();
    }
    public async Task<User?> GetByRefreshTokenAsync(string refreshToken)
    {
        return await _db.Users
            .FirstOrDefaultAsync(u => u.RefreshToken == refreshToken);
    }

}