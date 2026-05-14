using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using backend.DTOS;

[ApiController]
[Route("api/portfolio")]
[Authorize]
public class PortfolioController : ControllerBase
{
    private readonly PortfolioService _portfolioService;

    public PortfolioController(PortfolioService portfolioService)
    {
        _portfolioService = portfolioService;
    }

    [HttpGet]
    public async Task<IActionResult> GetPortfolio()
    {
        var userId = User.GetUserId();

        var result = await _portfolioService.GetPortfolioAsync(userId);

        return Ok(result);
    }

    [HttpPost("buy")]
    public async Task<IActionResult> Buy(TransactionRequestDto dto)
    {
        var userId = User.GetUserId();

        var result = await _portfolioService.BuyAsync(userId, dto);

        return Ok(result);
    }

    [HttpPost("sell")]
    public async Task<IActionResult> Sell(TransactionRequestDto dto)
    {
        var userId = User.GetUserId();

        var result = await _portfolioService.SellAsync(userId, dto);

        return Ok(result);
    }
}