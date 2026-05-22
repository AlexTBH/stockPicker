using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Caching.Memory;

namespace backend.Controllers;

[ApiController]
[Route("api/test")]
public class TestController : ControllerBase
{

    private readonly IMemoryCache _cache;

    public TestController(IMemoryCache cache)
    {
        _cache = cache;
    }
    [HttpGet("public")]
    public IActionResult Public()
    {
        return Ok("Public endpoint works");
    }

    [Authorize]
    [HttpGet("private")]
    public IActionResult Private()
    {
        return Ok("You are authorized");
    }

}

