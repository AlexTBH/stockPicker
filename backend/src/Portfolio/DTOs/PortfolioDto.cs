public class PortfolioDto
{
    public decimal CashBalance { get; set; }
    public decimal TotalValue { get; set; }

    public List<PortfolioStockDto> Holdings { get; set; } = [];
}

public class PortfolioStockDto
{
    public string Symbol { get; set; } = null!;
    public decimal Quantity { get; set; }
    public decimal CurrentPrice { get; set; }
    public decimal TotalValue { get; set; }
}