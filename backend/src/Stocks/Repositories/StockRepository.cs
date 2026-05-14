using dbContext;
using Microsoft.EntityFrameworkCore;
using backend.Models;
public interface IStockRepository
{
    Task<Stock?> GetBySymbolAsync(string symbol);
    Task UpdateAsync(Stock stock);
    Task<List<Stock>> GetAllAsync();
}
public class StockRepository : IStockRepository
{

    private readonly AppDbContext _db;
    public StockRepository(AppDbContext dbContext)
    {
        _db = dbContext;
    }

    public async Task<Stock?> GetBySymbolAsync(string symbol)
    {
        return await _db.Stocks.FirstOrDefaultAsync(s => s.Symbol == symbol);
    }

    public async Task<List<Stock>> GetAllAsync()
    {
        return await _db.Stocks
            .OrderBy(s => s.Symbol)
            .ToListAsync();
    }

    public async Task UpdateAsync(Stock stock)
    {
        _db.Stocks.Update(stock);
        await _db.SaveChangesAsync();
    }

}