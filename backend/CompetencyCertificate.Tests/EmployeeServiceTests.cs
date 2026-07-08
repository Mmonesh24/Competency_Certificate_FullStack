using Xunit;
using Moq;
using CompetencyCertificate.Services;
using CompetencyCertificate.Repositories;
using CompetencyCertificate.Models;
using CompetencyCertificate.DTOs;
using System.Threading.Tasks;
using System.Collections.Generic;
using System;

namespace CompetencyCertificate.Tests
{
    public class EmployeeServiceTests
    {
        private readonly Mock<IEmployeeRepository> _employeeRepoMock;
        private readonly EmployeeService _employeeService;

        public EmployeeServiceTests()
        {
            _employeeRepoMock = new Mock<IEmployeeRepository>();
            _employeeService = new EmployeeService(_employeeRepoMock.Object);
        }

        [Fact]
        public async Task GetEmployeeByIdAsync_ShouldReturnEmployeeDto_WhenEmployeeExists()
        {
            // Arrange
            var employeeId = "EMP123";
            var employee = new Employee
            {
                Employee_id = employeeId,
                Employee_name = "Test Employee",
                Employee_type = EmployeeType.Executive,
                CategoryName = Category.CMRLEmployee,
                DOB = new DateTime(1990, 1, 1),
                JoiningDate = new DateTime(2020, 1, 1),
                AadharNo = "123456789012"
            };

            _employeeRepoMock
                .Setup(repo => repo.GetEmployeeWithRelationsAsync(employeeId))
                .ReturnsAsync(employee);

            // Act
            var result = await _employeeService.GetEmployeeByIdAsync(employeeId);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(employeeId, result.Employee_id);
            Assert.Equal("Test Employee", result.Employee_name);
        }

        [Fact]
        public async Task GetEmployeeByIdAsync_ShouldReturnNull_WhenEmployeeDoesNotExist()
        {
            // Arrange
            var employeeId = "EMP123";
            _employeeRepoMock
                .Setup(repo => repo.GetEmployeeWithRelationsAsync(employeeId))
                .ReturnsAsync((Employee?)null);

            // Act
            var result = await _employeeService.GetEmployeeByIdAsync(employeeId);

            // Assert
            Assert.Null(result);
        }

        [Fact]
        public async Task AddEmployeeAsync_ShouldReturnTrue_WhenSuccess()
        {
            // Arrange
            var dto = new EmployeeCreateDto
            {
                Employee_id = "EMP123",
                Employee_name = "New Employee",
                AadharNo = "123456789012",
                DOB = new DateTime(1990, 1, 1),
                JoiningDate = new DateTime(2020, 1, 1)
            };

            _employeeRepoMock
                .Setup(repo => repo.AddAsync(It.IsAny<Employee>()))
                .Returns(Task.CompletedTask);

            _employeeRepoMock
                .Setup(repo => repo.SaveChangesAsync())
                .ReturnsAsync(true);

            // Act
            var result = await _employeeService.AddEmployeeAsync(dto);

            // Assert
            Assert.True(result);
            _employeeRepoMock.Verify(repo => repo.AddAsync(It.IsAny<Employee>()), Times.Once);
            _employeeRepoMock.Verify(repo => repo.SaveChangesAsync(), Times.Once);
        }
    }
}
