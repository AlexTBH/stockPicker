using backend.DTOS;
using backend.Repos;

namespace backend.Services;

public class TransactionService

{ 
    private readonly ITransactionRepository _transactionRepository;

    public TransactionService(ITransactionRepository transactionRepository)
    {
        _transactionRepository = transactionRepository;
    }

    public async Task<List<TransactionResponseDto>> GetByUserIdAsync(int userId)
    {
        var transactions = await _transactionRepository.GetByUserIdAsync(userId);

        return transactions
            .OrderByDescending(t => t.CreatedAt)
            .Select(t => new TransactionResponseDto
            {
                TransactionId = t.Id,
                Symbol = t.Stock.Symbol,
                Type = t.Type.ToString(),
                Quantity = t.Quantity,
                PriceAtTransaction = t.PriceAtTransaction,
                TotalAmount = t.Quantity * t.PriceAtTransaction,
                CreatedAt = t.CreatedAt
            })
            .ToList();
    }
}