using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/stocks")]
public class StockController : ControllerBase
{
    private readonly IStockRepository _stockRepository;
    private readonly StockService _stockService;

    public StockController(IStockRepository stockRepository, StockService stockService)
    {
        _stockRepository = stockRepository;
        _stockService = stockService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllStocks()
    {
        var stocks = await _stockRepository.GetAllAsync();
        return Ok(stocks);
    }

    [HttpGet("{symbol}")]
    public async Task<IActionResult> GetStock(string symbol)
    {
        var stock = await _stockRepository.GetBySymbolAsync(symbol);

        if (stock == null)
            return NotFound();

        return Ok(stock);
    }

    [HttpGet("{symbol}/price")]
    public async Task<IActionResult> GetPrice(string symbol)
    {
        var price = await _stockService.GetPriceAsync(symbol);

        if (price == null)
            return NotFound();

        return Ok(new
        {
            symbol,
            price
        });
    }
}