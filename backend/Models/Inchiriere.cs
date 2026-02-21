public class Inchiriere
{
    public int InchiriereId { get; set; }
    public int ClientId { get; set; }
    public Client? Client { get; set; }
    public int AutoturismId { get; set; }
    public Autoturism? Autoturism { get; set; }
    public int UserId{get;set;}
    private DateTime _dataStart;
    public DateTime DataStart
    {
        get => _dataStart;
        set => _dataStart = DateTime.SpecifyKind(value, DateTimeKind.Utc); // Enforce UTC
    }

    private DateTime _dataEnd;
    public DateTime DataEnd
    {
        get => _dataEnd;
        set => _dataEnd = DateTime.SpecifyKind(value, DateTimeKind.Utc); // Enforce UTC
    }

    public decimal CostTotal { get; set; }
    public string Observatii { get; set; }
}
