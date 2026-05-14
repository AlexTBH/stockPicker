using Microsoft.EntityFrameworkCore;
using backend.Models;

namespace dbContext;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options) {}

    public DbSet<User> Users => Set<User>();
    public DbSet<Stock> Stocks => Set<Stock>();
    public DbSet<Transaction> Transactions => Set<Transaction>();
    public DbSet<UserStock> UserStocks => Set<UserStock>();
    public DbSet<Portfolio> Portfolios => Set<Portfolio>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
    
        modelBuilder.Entity<Stock>().HasData(
            new Stock
            {
                Id = 1,
                Symbol = "AAPL",
                Name = "Apple Inc",
                CurrentPrice = 0
            },
            new Stock
            {
                Id = 2,
                Symbol = "TSLA",
                Name = "Tesla Inc",
                CurrentPrice = 0
            },
            new Stock
            {
                Id = 3,
                Symbol = "MSFT",
                Name = "Microsoft",
                CurrentPrice = 0
            },
            new Stock
            {
                Id = 4,
                Symbol = "GOOGL",
                Name = "Alphabet",
                CurrentPrice = 0
            },
            new Stock
            {
                Id = 5,
                Symbol = "AMZN",
                Name = "Amazon",
                CurrentPrice = 0
            }
        );
    }
}