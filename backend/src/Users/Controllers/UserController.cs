using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using backend.DTOS;
using backend.Services;

[ApiController]
[Route("api/users")]
public class UserController : ControllerBase
{

    private readonly UserService _userService;
    public UserController(UserService userService)
    {
        _userService = userService;
    }


}