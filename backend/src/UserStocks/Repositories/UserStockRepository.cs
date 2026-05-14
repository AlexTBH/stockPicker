using backend.Models;
using dbContext;
using Microsoft.EntityFrameworkCore;

namespace backend.Repos;

public interface IUserStockRepository
{
    Task<List<UserStock>> GetByUserIdAsync(int userId);
    Task<UserStock?> GetByUserAndStockAsync(int userId, int stockId);
    Task AddAsync(UserStock userStock);
    Task UpdateAsync(UserStock userStock);
    Task DeleteAsync(UserStock userStock);
}

public class UserStockRepository : IUserStockRepository
{
    private readonly AppDbContext _db;

    public UserStockRepository(AppDbContext dbContext)
    {
        _db = dbContext;
    }

    public async Task<List<UserStock>> GetByUserIdAsync(int userId)
    {
        return await _db.UserStocks
            .Where(x => x.UserId == userId)
            .Include(x => x.Stock) 
            .ToListAsync();
    }

    public async Task<UserStock?> GetByUserAndStockAsync(int userId, int stockId)
    {
        return await _db.UserStocks
            .FirstOrDefaultAsync(x => x.UserId == userId && x.StockId == stockId);
    }

    public async Task AddAsync(UserStock userStock)
    {
        await _db.UserStocks.AddAsync(userStock);
        await _db.SaveChangesAsync();
    }

    public async Task UpdateAsync(UserStock userStock)
    {
        _db.UserStocks.Update(userStock);
        await _db.SaveChangesAsync();
    }

    public async Task DeleteAsync(UserStock userStock)
    {
        _db.UserStocks.Remove(userStock);
        await _db.SaveChangesAsync();
    }
}