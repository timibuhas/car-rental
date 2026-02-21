using Microsoft.EntityFrameworkCore;



public class RentACarContext : DbContext
{
    public DbSet<Client> Clienti { get; set; }
    public DbSet<Autoturism> Autoturisme { get; set; }
    public DbSet<Inchiriere> Inchirieri { get; set; }
    public DbSet<User> Users {get;set;}

    public RentACarContext(DbContextOptions<RentACarContext> options)
        : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)

    {
            modelBuilder.Entity<Inchiriere>()
        .Property(i => i.DataStart)
        .HasColumnType("timestamp with time zone");

        modelBuilder.Entity<Inchiriere>()
        .Property(i => i.DataEnd)
        .HasColumnType("timestamp with time zone");
        // Configurări suplimentare, ex. unicitate, relații etc.
        modelBuilder.Entity<Client>()
            .HasMany(c => c.Inchirieri)
            .WithOne(i => i.Client)
            .HasForeignKey(i => i.ClientId);

        modelBuilder.Entity<Autoturism>()
            .HasMany(a => a.Inchirieri)
            .WithOne(i => i.Autoturism)
            .HasForeignKey(i => i.AutoturismId);

        // Poți seta constrângeri, ex. Unicitate la NumarInmatriculare
        modelBuilder.Entity<Autoturism>()
            .HasIndex(a => a.NumarInmatriculare)
            .IsUnique(true);

        base.OnModelCreating(modelBuilder);
    }
}
