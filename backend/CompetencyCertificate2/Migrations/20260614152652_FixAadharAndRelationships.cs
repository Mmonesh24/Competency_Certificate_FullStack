using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CompetencyCertificate.Migrations
{
    /// <inheritdoc />
    public partial class FixAadharAndRelationships : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "AadharNo",
                table: "Employee",
                type: "nvarchar(12)",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                name: "AadharNo",
                table: "Employee",
                type: "int",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(12)");
        }
    }
}
