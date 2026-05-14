using backend.Models;
using backend.DTOS;
using backend.Repos;
using backend.Exceptions;

public class PortfolioService
{
    private readonly StockService _stockService;
    private readonly IStockRepository _stockRepository;
    private readonly ITransactionRepository _transactionRepository;
    private readonly IPortfolioRepository _portfolioRepository;
    private readonly IUserStockRepository _userStockRepository;

    public PortfolioService(
        StockService stockService,
        IStockRepository stockRepository,
        ITransactionRepository transactionRepository,
        IPortfolioRepository portfolioRepository,
        IUserStockRepository userStockRepository)
    {
        _stockService = stockService;
        _stockRepository = stockRepository;
        _transactionRepository = transactionRepository;
        _portfolioRepository = portfolioRepository;
        _userStockRepository = userStockRepository;
    }

    public async Task<PortfolioDto> GetPortfolioAsync(int userId)
    {
        var portfolioTask = _portfolioRepository.GetByUserIdAsync(userId);
        var userStocksTask = _userStockRepository.GetByUserIdAsync(userId);
    
        await Task.WhenAll(portfolioTask, userStocksTask);
    
        var portfolio = await portfolioTask
            ?? throw new NotFoundException("Portfolio not found");
        var userStocks = await userStocksTask;
    
        var priceTasks = userStocks.Select(us => _stockService.GetPriceAsync(us.Stock.Symbol));
        var prices = await Task.WhenAll(priceTasks);
    
        var holdings = BuildHoldings(userStocks, prices);
        var totalValue = portfolio.CashBalance + holdings.Sum(h => h.TotalValue);
    
        return new PortfolioDto
        {
            CashBalance = portfolio.CashBalance,
            TotalValue = totalValue,
            Holdings = holdings
        };
    }
    public async Task<TransactionResponseDto> BuyAsync(int userId, TransactionRequestDto dto)
    {
        var (stock, price, portfolio) = await ResolveTransactionContextAsync(userId, dto.Symbol);
        var total = price * dto.Quantity;

        if (portfolio.CashBalance < total)
            throw new InsufficientFundsException("Not enough cash to complete purchase.");

        portfolio.CashBalance -= total;
        await _portfolioRepository.UpdateAsync(portfolio);

        await AddOrUpdateUserStockAsync(userId, stock.Id, dto.Quantity);

        var transaction = await RecordTransactionAsync(userId, stock.Id, TransactionType.Buy, dto.Quantity, price);
        return TransactionMapper.ToDto(transaction, stock.Symbol);
    }

    public async Task<TransactionResponseDto> SellAsync(int userId, TransactionRequestDto dto)
    {
        var (stock, price, portfolio) = await ResolveTransactionContextAsync(userId, dto.Symbol);
        var total = price * dto.Quantity;

        var userStock = await _userStockRepository.GetByUserAndStockAsync(userId, stock.Id);
        if (userStock == null || userStock.Quantity < dto.Quantity)
            throw new InsufficientSharesException("Not enough shares to complete sale.");

        userStock.Quantity -= dto.Quantity;

        if (userStock.Quantity == 0) {
            await _userStockRepository.DeleteAsync(userStock);
        }  
        else 
        {
            await _userStockRepository.UpdateAsync(userStock);
        };

        portfolio.CashBalance += total;
        await _portfolioRepository.UpdateAsync(portfolio);

        var transaction = await RecordTransactionAsync(userId, stock.Id, TransactionType.Sell, dto.Quantity, price);
        return TransactionMapper.ToDto(transaction, stock.Symbol);
    }

    private async Task<(Stock stock, decimal price, Portfolio portfolio)> ResolveTransactionContextAsync(int userId, string symbol)
    {
        var stock = await _stockRepository.GetBySymbolAsync(symbol)
            ?? throw new NotFoundException($"Stock '{symbol}' not found.");

        var price = await _stockService.GetPriceAsync(symbol)
            ?? throw new NotFoundException($"Price for '{symbol}' unavailable.");

        var portfolio = await _portfolioRepository.GetByUserIdAsync(userId)
            ?? throw new NotFoundException($"Portfolio for user {userId} not found.");

        return (stock, price, portfolio);
    }

    private async Task AddOrUpdateUserStockAsync(int userId, int stockId, decimal quantity)
    {
        var userStock = await _userStockRepository.GetByUserAndStockAsync(userId, stockId);

        if (userStock == null)
        {
            await _userStockRepository.AddAsync(new UserStock
            {
                UserId = userId,
                StockId = stockId,
                Quantity = quantity
            });
        }
        else
        {
            userStock.Quantity += quantity;
            await _userStockRepository.UpdateAsync(userStock);
        }
    }

    private async Task<Transaction> RecordTransactionAsync(
        int userId, int stockId, TransactionType type, decimal quantity, decimal price)
    {
        var transaction = new Transaction
        {
            UserId = userId,
            StockId = stockId,
            Type = type,
            Quantity = quantity,
            PriceAtTransaction = price,
            CreatedAt = DateTime.UtcNow
        };

        await _transactionRepository.AddAsync(transaction);
        return transaction;
    }

    private List<PortfolioStockDto> BuildHoldings(List<UserStock> userStocks, decimal?[] prices)
    {
        var holdings = new List<PortfolioStockDto>();
    
        for (int i = 0; i < userStocks.Count; i++)
        {
            var price = prices[i];
            if (price == null)
                continue;
    
            var userStock = userStocks[i];
            holdings.Add(new PortfolioStockDto
            {
                Symbol = userStock.Stock.Symbol,
                Quantity = userStock.Quantity,
                CurrentPrice = price.Value,
                TotalValue = price.Value * userStock.Quantity
            });
        }
    
        return holdings;
    }
}