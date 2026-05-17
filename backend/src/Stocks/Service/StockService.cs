using backend.Interface;
using backend.Models;
using Microsoft.Extensions.Caching.Memory;

namespace backend.Services;
public class StockService
{
    private readonly IStockPriceService _priceService;
    private readonly IStockRepository _stockRepository;
    private readonly IMemoryCache _cache;

    public StockService(IStockPriceService priceService, IStockRepository stockRepository, IMemoryCache cache)
    {
        _priceService = priceService;
        _stockRepository = stockRepository;
        _cache = cache;
    }

    public async Task<decimal?> GetPriceAsync(string symbol)
    {
        if (_cache.TryGetValue(symbol, out decimal cached))
            return cached;

        var stock = await _stockRepository.GetBySymbolAsync(symbol);

        if (stock == null)
            return null;

        var shouldRefresh =
            stock.LastUpdated == null ||
            stock.LastUpdated < DateTime.UtcNow.AddHours(-6);

        if (shouldRefresh)
        {
            var latestPrice = await _priceService.GetCurrentPriceAsync(symbol);

            if (latestPrice != null)
            {
                stock.CurrentPrice = latestPrice.Value;
                stock.LastUpdated = DateTime.UtcNow;

                await _stockRepository.UpdateAsync(stock);
            }
        }

        if (stock.CurrentPrice == 0)
            return null;

        _cache.Set(symbol, stock.CurrentPrice, TimeSpan.FromMinutes(30));

        return stock.CurrentPrice;
    }
}