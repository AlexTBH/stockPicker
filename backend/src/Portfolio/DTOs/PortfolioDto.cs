public class PortfolioDto
{
    public decimal CashBalance { get; set; }
    public decimal TotalValue { get; set; }

    public List<PortfolioStockDto> Holdings { get; set; } = [];
}

public class PortfolioStockDto
{
    public string Symbol { get; set; } = string.Empty;
    public decimal Quantity { get; set; }
    public decimal CurrentPrice { get; set; }
    public decimal AvgBuyPrice { get; set; }
    public decimal TotalValue { get; set; }
    public decimal ProfitLoss { get; set; }
}

public class PortfolioHistoryDto
{
    public DateTime Date { get; set; }
    public decimal TotalValue { get; set; }
}