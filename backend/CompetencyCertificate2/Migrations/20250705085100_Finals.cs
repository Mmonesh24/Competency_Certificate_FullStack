using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CompetencyCertificate.Migrations
{
    /// <inheritdoc />
    public partial class Finals : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_Initiate",
                table: "Initiate");

            migrationBuilder.DropIndex(
                name: "IX_Initiate_employee_id",
                table: "Initiate");

            migrationBuilder.DropColumn(
                name: "Id",
                table: "Initiate");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Initiate",
                table: "Initiate",
                column: "employee_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_Initiate",
                table: "Initiate");

            migrationBuilder.AddColumn<int>(
                name: "Id",
                table: "Initiate",
                type: "int",
                nullable: false,
                defaultValue: 0)
                .Annotation("SqlServer:Identity", "1, 1");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Initiate",
                table: "Initiate",
                column: "Id");

            migrationBuilder.CreateIndex(
                name: "IX_Initiate_employee_id",
                table: "Initiate",
                column: "employee_id");
        }
    }
}
