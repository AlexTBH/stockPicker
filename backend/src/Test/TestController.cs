using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace backend.Controllers;

[ApiController]
[Route("api/test")]
public class TestController : ControllerBase
{
    [HttpGet("public")]
    public IActionResult Public()
    {
        return Ok("Public endpoint works 🚀");
    }

    [Authorize]
    [HttpGet("private")]
    public IActionResult Private()
    {
        return Ok("You are authorized 🔐");
    }
}