using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using System.IO;

namespace CompetencyCertificate.Services
{
    public class QuestPdfGeneratorService
    {
        public static byte[] GenerateCertificatePdf(string employeeName, string employeeId, string department, string subDepartment, string designation, string validity, byte[] contractorLogoBytes)
        {
            var document = Document.Create(container =>
            {
                container.Page(page =>
                {
                    page.Size(PageSizes.A4.Landscape());
                    page.Margin(0.75f, Unit.Inch);
                    page.PageColor(Colors.White);

                    // Add border
                    page.Content().Border(3).BorderColor(Colors.Blue.Darken4).Padding(20).Column(column =>
                    {
                        // Header section
                        column.Item().Row(row =>
                        {
                            // Logo if available
                            if (contractorLogoBytes != null && contractorLogoBytes.Length > 0)
                            {
                                try
                                {
                                    row.RelativeItem(1).Height(50).Image(contractorLogoBytes);
                                }
                                catch
                                {
                                    row.RelativeItem(1).Text(""); // fallback
                                }
                            }
                            else
                            {
                                row.RelativeItem(1).Text("");
                            }

                            row.RelativeItem(4).Column(headerCol =>
                            {
                                headerCol.Item().Text("CHENNAI METRO RAIL LIMITED").Bold().FontSize(18).FontColor(Colors.Blue.Darken4).AlignCenter();
                                headerCol.Item().Text("COMPETENCY CERTIFICATE").Bold().FontSize(14).FontColor(Colors.Grey.Darken3).AlignCenter();
                            });

                            row.RelativeItem(1).Text(""); // right spacer
                        });

                        column.Item().PaddingTop(20).PaddingBottom(20).BorderBottom(1).BorderColor(Colors.Blue.Darken4);

                        // Body text
                        column.Item().AlignLeft().Text(text =>
                        {
                            text.Span("This is to certify that ").FontSize(12);
                            text.Span(employeeName).Bold().FontSize(14).Underline();
                            text.Span(" (ID: ").FontSize(12);
                            text.Span(employeeId).Bold().FontSize(12);
                            text.Span(") has been assessed and found competent in the required skills and safety compliance standards for the following area:").FontSize(12);
                        });

                        column.Item().PaddingBottom(20);

                        // Details table
                        column.Item().Table(table =>
                        {
                            table.ColumnsDefinition(columns =>
                            {
                                columns.ConstantColumn(120);
                                columns.RelativeColumn();
                            });

                            table.Cell().BorderBottom(1).BorderColor(Colors.Grey.Lighten2).Padding(8).Text("Department").Bold();
                            table.Cell().BorderBottom(1).BorderColor(Colors.Grey.Lighten2).Padding(8).Text(department ?? "N/A");

                            table.Cell().BorderBottom(1).BorderColor(Colors.Grey.Lighten2).Padding(8).Text("Sub-Department").Bold();
                            table.Cell().BorderBottom(1).BorderColor(Colors.Grey.Lighten2).Padding(8).Text(subDepartment ?? "N/A");

                            table.Cell().BorderBottom(1).BorderColor(Colors.Grey.Lighten2).Padding(8).Text("Designation").Bold();
                            table.Cell().BorderBottom(1).BorderColor(Colors.Grey.Lighten2).Padding(8).Text(designation ?? "N/A");

                            table.Cell().BorderBottom(1).BorderColor(Colors.Grey.Lighten2).Padding(8).Text("Validity Period").Bold();
                            table.Cell().BorderBottom(1).BorderColor(Colors.Grey.Lighten2).Padding(8).Text(validity ?? "Permanent");
                        });

                        column.Item().PaddingBottom(40);

                        // Signatures row
                        column.Item().Row(row =>
                        {
                            row.RelativeItem().Column(sigCol =>
                            {
                                sigCol.Item().Text("_______________________").AlignCenter();
                                sigCol.Item().Text("Assessor Signature").FontSize(10).AlignCenter();
                            });

                            row.RelativeItem().Column(sigCol =>
                            {
                                sigCol.Item().Text("_______________________").AlignCenter();
                                sigCol.Item().Text("HOD / Approving Authority").FontSize(10).AlignCenter();
                            });
                        });
                    });
                });
            });

            using (var stream = new MemoryStream())
            {
                document.GeneratePdf(stream);
                return stream.ToArray();
            }
        }
    }
}
