using backend.Models;
using backend.DTOS;

public static class TransactionMapper
{
    public static TransactionResponseDto ToDto(Transaction transaction, string symbol)
    {
        return new TransactionResponseDto
        {
            TransactionId = transaction.Id,
            Symbol = symbol,
            Type = transaction.Type.ToString(),
            Quantity = transaction.Quantity,
            PriceAtTransaction = transaction.PriceAtTransaction,
            TotalAmount = transaction.PriceAtTransaction * transaction.Quantity,
            CreatedAt = transaction.CreatedAt
        };
    }
}