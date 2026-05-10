using backend.Models;

public class Portfolio
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public User User { get; set; } = null!;
    public decimal CashBalance { get; set; }

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}