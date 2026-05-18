using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

[ApiController]
[Route("api/admin")]
[Authorize(Roles = "Admin")]
public class AdminController : ControllerBase
{
    private readonly TransactionService _transactionService;
    private readonly UserService _userService;

    public AdminController(
        TransactionService transactionService,
        UserService userService)
    {
        _transactionService = transactionService;
        _userService = userService;
    }

    [HttpGet("transactions")]
    public async Task<IActionResult> GetAllTransactions(int page = 1, int pageSize = 10)
    {
        var result = await _transactionService.GetAllAsync(page, pageSize);
        return Ok(result);
    }

    [HttpGet("users")]
    public async Task<IActionResult> GetUsers()
    {
        var result = await _userService.GetAllAsync();
        return Ok(result);
    }

    [HttpGet("me")]
    public IActionResult Me()
    {
        var claims = User.Claims.Select(c => new { c.Type, c.Value });
        return Ok(claims);
    }
}