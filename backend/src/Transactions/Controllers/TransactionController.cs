using backend.DTOS;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class TransactionController : ControllerBase
{
    private readonly PortfolioService _portfolioService;
    private readonly TransactionService _transactionService;

    public TransactionController(
        PortfolioService portfolioService,
        TransactionService transactionService)
    {
        _portfolioService = portfolioService;
        _transactionService = transactionService;
    }

    [HttpGet]
    public async Task<IActionResult> GetTransactions()
    {
        var userId = GetUserId();

        var result = await _transactionService.GetByUserIdAsync(userId);

        return Ok(result);
    }

    [HttpPost("buy")]
    public async Task<IActionResult> Buy([FromBody] TransactionRequestDto dto)
    {
        var userId = GetUserId();

        var result = await _portfolioService.BuyAsync(userId, dto);

        return Ok(result);
    }

    [HttpPost("sell")]
    public async Task<IActionResult> Sell([FromBody] TransactionRequestDto dto)
    {
        var userId = GetUserId();

        var result = await _portfolioService.SellAsync(userId, dto);

        return Ok(result);
    }

    private int GetUserId()
    {
        return int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
    }
}