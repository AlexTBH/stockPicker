using backend.Models;
using Microsoft.EntityFrameworkCore;
using dbContext;

public interface ITransactionRepository
{
    Task AddAsync(Transaction transaction);

    Task<List<Transaction>> GetByUserIdAsync(int userId, int page, int pageSize);

    Task<int> CountByUserIdAsync(int userId);

    IQueryable<Transaction> Query();
}

public class TransactionRepository : ITransactionRepository
{
    private readonly AppDbContext _db;

    public TransactionRepository(AppDbContext db)
    {
        _db = db;
    }

    public async Task AddAsync(Transaction transaction)
    {
        await _db.Transactions.AddAsync(transaction);
        await _db.SaveChangesAsync();
    }

    public async Task<List<Transaction>> GetByUserIdAsync(
        int userId,
        int page,
        int pageSize)
    {
        return await _db.Transactions
            .Include(t => t.Stock)
            .Where(t => t.UserId == userId)
            .OrderByDescending(t => t.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();
    }

    public async Task<int> CountByUserIdAsync(int userId)
    {
        return await _db.Transactions
            .CountAsync(t => t.UserId == userId);
    }

    public IQueryable<Transaction> Query()
    {
        return _db.Transactions
            .Include(t => t.Stock);
    }
}