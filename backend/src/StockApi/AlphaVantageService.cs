using System.Text.Json;
using backend.Interface;

namespace backend.Services;

public class AlphaVantageService : IStockPriceService
{
    private readonly HttpClient _httpClient;
    private readonly IConfiguration _config;

    public AlphaVantageService(HttpClient httpClient, IConfiguration config)
    {
        _httpClient = httpClient;
        _config = config;
    }

    public async Task<decimal?> GetCurrentPriceAsync(string symbol)
    {
        var apiKey = _config["AlphaVantage:Key"];
        var url = $"https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol={symbol}&apikey={apiKey}";

        using var httpResponse = await _httpClient.GetAsync(url);
        if (!httpResponse.IsSuccessStatusCode)
            return null;

        var response = await httpResponse.Content.ReadAsStringAsync();

        using var json = JsonDocument.Parse(response);

        if (!json.RootElement.TryGetProperty("Global Quote", out var quote))
            return null;

        if (!quote.TryGetProperty("05. price", out var priceElement))
            return null;

        if (decimal.TryParse(priceElement.GetString(), System.Globalization.NumberStyles.Any,
            System.Globalization.CultureInfo.InvariantCulture, out var price))
            return price;

        return null;
    }
}