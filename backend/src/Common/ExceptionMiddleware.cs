using backend.Exceptions;

public class ExceptionMiddleware
{
    private readonly RequestDelegate _next;

    public ExceptionMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task Invoke(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (DomainException ex)
        {
            context.Response.ContentType = "application/json";
            context.Response.StatusCode = ex.StatusCode;

            await context.Response.WriteAsJsonAsync(new
            {
                message = ex.Message,
                status = ex.StatusCode
            });
        }
        catch (Exception ex)
        {
            context.Response.ContentType = "application/json";
            context.Response.StatusCode = 500;

            await context.Response.WriteAsJsonAsync(new
            {
                message = "Unexpected error",
                detail = ex.Message
            });
        }
    }
}