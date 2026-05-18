using backend.DTOS;
using backend.Models;
using backend.Repos;
using Microsoft.EntityFrameworkCore;

namespace backend.Services;

public class TransactionService
{
    private readonly ITransactionRepository _transactionRepository;

    public TransactionService(ITransactionRepository transactionRepository)
    {
        _transactionRepository = transactionRepository;
    }

    public async Task<PagedTransactionsDto> GetByUserIdAsync(int userId, int page, int pageSize)
    {
        var query = _transactionRepository
            .Query()
            .Where(t => t.UserId == userId);

        return await GetPagedAsync(query, page, pageSize);
    }

    public async Task<PagedTransactionsDto> GetAllAsync(int page, int pageSize)
    {
        var query = _transactionRepository.Query();

        return await GetPagedAsync(query, page, pageSize);
    }

    private async Task<PagedTransactionsDto> GetPagedAsync(IQueryable<Transaction> query, int page, int pageSize)
    {
        var totalCount = await query.CountAsync();

        var items = await query
            .OrderByDescending(t => t.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(t => Map(t))
            .ToListAsync();

        return new PagedTransactionsDto
        {
            Items = items,
            CurrentPage = page,
            PageSize = pageSize,
            TotalCount = totalCount,
            TotalPages = (int)Math.Ceiling(totalCount / (double)pageSize)
        };
    }

    private static TransactionResponseDto Map(Transaction t)
    {
        return new TransactionResponseDto
        {
            TransactionId = t.Id,
            Symbol = t.Stock.Symbol,
            Type = t.Type.ToString(),
            Quantity = t.Quantity,
            PriceAtTransaction = t.PriceAtTransaction,
            TotalAmount = t.Quantity * t.PriceAtTransaction,
            CreatedAt = t.CreatedAt
        };
    }
}