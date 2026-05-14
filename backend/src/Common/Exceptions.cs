namespace backend.Exceptions;
public abstract class DomainException : Exception
{
    public int StatusCode { get; }

    protected DomainException(string message, int statusCode) : base(message)
    {
        StatusCode = statusCode;
    }
}

public class NotFoundException : DomainException
{
    public NotFoundException(string message) : base(message, 404) { }
}

public class InsufficientFundsException : DomainException
{
    public InsufficientFundsException(string message) : base(message, 402) { }
}

public class InsufficientSharesException : DomainException
{
    public InsufficientSharesException(string message) : base(message, 409) { }
}


