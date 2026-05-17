using backend.Models;

namespace backend.DTOS;

public class TransactionResponseDto
{
    public int TransactionId { get; set; }

    public string Symbol { get; set; } = null!;

    public string Type { get; set; } = null!;

    public decimal Quantity { get; set; }

    public decimal PriceAtTransaction { get; set; }

    public decimal TotalAmount { get; set; }

    public DateTime CreatedAt { get; set; }
}

public class TransactionRequestDto
{
    public string Symbol { get; set; } = null!;
    public decimal Quantity { get; set; }
}

public class TransactionDto
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public int StockId { get; set; }

    public TransactionType Type { get; set; }

    public decimal Quantity { get; set; }

    public decimal PriceAtTransaction { get; set; }

    public DateTime CreatedAt { get; set; }
}