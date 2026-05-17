using backend.Models;
using Microsoft.EntityFrameworkCore;
using dbContext;

public interface ITransactionRepository
{
    Task AddAsync(Transaction transaction);
    Task<List<Transaction>> GetByUserIdAsync(int userId);
    Task<List<Transaction>> GetAllForUserAsync(int userId);
}


public class TransactionRepository : ITransactionRepository
{
    private readonly AppDbContext _db;

    public TransactionRepository(AppDbContext dbContext)
    {
        _db = dbContext;
    }

    public async Task AddAsync(Transaction transaction)
    {
        await _db.Transactions.AddAsync(transaction);
        await _db.SaveChangesAsync();
    }

    public async Task<List<Transaction>> GetByUserIdAsync(int userId)
    {
        return await _db.Transactions
            .Include(t => t.Stock)
            .Where(t => t.UserId == userId)
            .OrderByDescending(t => t.CreatedAt)
            .ToListAsync();
    }
    public async Task<List<Transaction>> GetAllForUserAsync(int userId)
    {
        return await _db.Transactions
            .Include(t => t.Stock)
            .Where(t => t.UserId == userId)
            .OrderBy(t => t.CreatedAt)
            .ToListAsync();
    }
}