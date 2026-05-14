using backend.Models;
using dbContext;

public interface ITransactionRepository
{
    Task AddAsync(Transaction transaction);
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
        await _db.AddAsync(transaction);
        await _db.SaveChangesAsync();
    }
}