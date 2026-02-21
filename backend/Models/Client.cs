

using System.Text.Json.Serialization;

public class Client
{
    public int ClientId { get; set; }

    public string Nume { get; set; }          // ex: Popescu
    public string Prenume { get; set; }       // ex: Ion
    public string CNP { get; set; }           // sau alt cod de identificare
    public string Adresa { get; set; }
    public string Telefon { get; set; }
    public string Email { get; set; }

    // Status: activ, inactiv etc.
    public string Status { get; set; } = "activ";

    // Relație cu Inchiriere: un client poate avea mai multe închirieri
    [JsonIgnore]
    public ICollection<Inchiriere> Inchirieri { get; set; } = new List<Inchiriere>();
}
