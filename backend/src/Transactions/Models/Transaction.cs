namespace backend.Models;

public class Transaction
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public User User { get; set; } = null!;
    public int StockId { get; set; }
    public Stock Stock { get; set; } = null!;
    public TransactionType Type { get; set; }
    public decimal Quantity { get; set; }
    public decimal PriceAtTransaction { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

public enum TransactionType 
{
    Buy,
    Sell
}