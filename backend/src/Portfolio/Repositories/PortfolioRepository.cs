using dbContext;
using backend.Models;
using Microsoft.EntityFrameworkCore;

public interface IPortfolioRepository
{
    Task<Portfolio?> GetByUserIdAsync(int userId);
    Task UpdateAsync(Portfolio portfolio);
    Task AddAsync(Portfolio portfolio);
}

public class PortfolioRepository : IPortfolioRepository
{
    private readonly AppDbContext _db;

    public PortfolioRepository(AppDbContext dbContext)
    {
        _db = dbContext;
    }

    public async Task<Portfolio?> GetByUserIdAsync(int userId)
    {
        return await _db.Portfolios
            .FirstOrDefaultAsync(p => p.UserId == userId);
    }

    public async Task UpdateAsync(Portfolio portfolio)
    {
        _db.Portfolios.Update(portfolio);
        await _db.SaveChangesAsync();
    }

    public async Task AddAsync(Portfolio portfolio)
    {
        await _db.Portfolios.AddAsync(portfolio);
        await _db.SaveChangesAsync();
    }
}