namespace backend.Interface;

public interface IStockPriceService
{
    Task<decimal?> GetCurrentPriceAsync(string symbol);
}