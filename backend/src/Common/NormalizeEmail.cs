namespace backend.Common;
public static class EmailHelper
{
    public static string Normalize(string email)
    {
        return email.Trim().ToLowerInvariant();
    }
}