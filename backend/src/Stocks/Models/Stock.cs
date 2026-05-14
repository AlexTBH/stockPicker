namespace backend.Models;

public class Stock
{
    public int Id { get; set; }

    public string Symbol { get; set; } = null!;

    public string Name { get; set; } = null!;

    public decimal CurrentPrice { get; set; }

    public DateTime? LastUpdated { get; set; }
}