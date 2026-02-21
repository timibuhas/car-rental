using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace MyWebAPI.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Autoturisme",
                columns: table => new
                {
                    AutoturismId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Marca = table.Column<string>(type: "text", nullable: false),
                    Model = table.Column<string>(type: "text", nullable: false),
                    NumarInmatriculare = table.Column<string>(type: "text", nullable: false),
                    TarifPeZi = table.Column<decimal>(type: "numeric", nullable: false),
                    Disponibil = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Autoturisme", x => x.AutoturismId);
                });

            migrationBuilder.CreateTable(
                name: "Clienti",
                columns: table => new
                {
                    ClientId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Nume = table.Column<string>(type: "text", nullable: false),
                    Prenume = table.Column<string>(type: "text", nullable: false),
                    CNP = table.Column<string>(type: "text", nullable: false),
                    Adresa = table.Column<string>(type: "text", nullable: false),
                    Telefon = table.Column<string>(type: "text", nullable: false),
                    Email = table.Column<string>(type: "text", nullable: false),
                    Status = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Clienti", x => x.ClientId);
                });

            migrationBuilder.CreateTable(
                name: "Inchirieri",
                columns: table => new
                {
                    InchiriereId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    ClientId = table.Column<int>(type: "integer", nullable: false),
                    AutoturismId = table.Column<int>(type: "integer", nullable: false),
                    DataStart = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    DataEnd = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CostTotal = table.Column<decimal>(type: "numeric", nullable: false),
                    Observatii = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Inchirieri", x => x.InchiriereId);
                    table.ForeignKey(
                        name: "FK_Inchirieri_Autoturisme_AutoturismId",
                        column: x => x.AutoturismId,
                        principalTable: "Autoturisme",
                        principalColumn: "AutoturismId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Inchirieri_Clienti_ClientId",
                        column: x => x.ClientId,
                        principalTable: "Clienti",
                        principalColumn: "ClientId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Autoturisme_NumarInmatriculare",
                table: "Autoturisme",
                column: "NumarInmatriculare",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Inchirieri_AutoturismId",
                table: "Inchirieri",
                column: "AutoturismId");

            migrationBuilder.CreateIndex(
                name: "IX_Inchirieri_ClientId",
                table: "Inchirieri",
                column: "ClientId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Inchirieri");

            migrationBuilder.DropTable(
                name: "Autoturisme");

            migrationBuilder.DropTable(
                name: "Clienti");
        }
    }
}
