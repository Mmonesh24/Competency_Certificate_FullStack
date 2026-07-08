using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CompetencyCertificate.Migrations
{
    /// <inheritdoc />
    public partial class AddApprovalLevelToInitiate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ApprovalLevel",
                table: "Initiate",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ApprovalLevel",
                table: "Initiate");
        }
    }
}
