using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CompetencyCertificate.Migrations
{
    /// <inheritdoc />
    public partial class ExpandPasswordColumnLimit : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Password",
                table: "HRLogin",
                type: "NVARCHAR(256)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "NVARCHAR(60)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Password",
                table: "EmployeeLogin",
                type: "NVARCHAR(256)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "NVARCHAR(60)");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Password",
                table: "HRLogin",
                type: "NVARCHAR(60)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "NVARCHAR(256)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Password",
                table: "EmployeeLogin",
                type: "NVARCHAR(60)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "NVARCHAR(256)");
        }
    }
}
