using backend.Models;

namespace backend.Models;
public class UserStock
{
    public int Id { get; set; }

    public int UserId { get; set; }
    public User User { get; set; } = null!;

    public int StockId { get; set; }
    public Stock Stock { get; set; } = null!;

    public decimal Quantity { get; set; }

    public decimal AvgBuyPrice { get; set; }
}