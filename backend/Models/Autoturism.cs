


using System.Text.Json.Serialization;

public class Autoturism
{
    public int AutoturismId { get; set; }

    public string Marca { get; set; }         // ex: Dacia, Volkswagen, BMW
    public string Model { get; set; }         // ex: Logan, Passat, X5
    public string NumarInmatriculare { get; set; }
    public decimal TarifPeZi { get; set; }
    
    // Disponibil, Închiriat, Service etc.
    public bool Disponibil { get; set; } = true;

    // Relație cu Inchiriere: un autoturism poate apărea în mai multe închirieri în timp
    [JsonIgnore]
    public ICollection<Inchiriere> Inchirieri { get; set; }= new List<Inchiriere>();
}
