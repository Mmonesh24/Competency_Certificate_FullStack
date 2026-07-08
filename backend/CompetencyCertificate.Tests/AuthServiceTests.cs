using Xunit;
using Moq;
using CompetencyCertificate.Services;
using CompetencyCertificate.Repositories;
using CompetencyCertificate.Models;
using CompetencyCertificate.DTOs;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using System.Collections.Generic;
using System;

namespace CompetencyCertificate.Tests
{
    public class AuthServiceTests
    {
        private readonly Mock<IGenericRepository<EmployeeLogin>> _employeeLoginRepoMock;
        private readonly Mock<IGenericRepository<HRLogin>> _hrLoginRepoMock;
        private readonly Mock<IEmployeeRepository> _employeeRepoMock;
        private readonly Mock<IConfiguration> _configMock;
        private readonly AuthService _authService;

        public AuthServiceTests()
        {
            _employeeLoginRepoMock = new Mock<IGenericRepository<EmployeeLogin>>();
            _hrLoginRepoMock = new Mock<IGenericRepository<HRLogin>>();
            _employeeRepoMock = new Mock<IEmployeeRepository>();
            _configMock = new Mock<IConfiguration>();

            _authService = new AuthService(
                _employeeLoginRepoMock.Object,
                _hrLoginRepoMock.Object,
                _employeeRepoMock.Object,
                _configMock.Object
            );
        }

        [Fact]
        public async Task RegisterEmployeeAsync_ShouldReturnTrue_WhenLoginDoesNotExist()
        {
            // Arrange
            var dto = new EmployeeRegisterDto
            {
                EmployeeId = "EMP101",
                Password = "SecretPassword"
            };

            _employeeLoginRepoMock
                .Setup(repo => repo.GetByIdAsync(dto.EmployeeId))
                .ReturnsAsync((EmployeeLogin?)null);

            _employeeLoginRepoMock
                .Setup(repo => repo.AddAsync(It.IsAny<EmployeeLogin>()))
                .Returns(Task.CompletedTask);

            _employeeLoginRepoMock
                .Setup(repo => repo.SaveChangesAsync())
                .ReturnsAsync(true);

            // Act
            var result = await _authService.RegisterEmployeeAsync(dto);

            // Assert
            Assert.True(result);
            _employeeLoginRepoMock.Verify(repo => repo.AddAsync(It.Is<EmployeeLogin>(l => l.employee_id == dto.EmployeeId)), Times.Once);
            _employeeLoginRepoMock.Verify(repo => repo.SaveChangesAsync(), Times.Once);
        }

        [Fact]
        public async Task RegisterEmployeeAsync_ShouldReturnFalse_WhenLoginAlreadyExists()
        {
            // Arrange
            var dto = new EmployeeRegisterDto
            {
                EmployeeId = "EMP101",
                Password = "SecretPassword"
            };

            var existingLogin = new EmployeeLogin { employee_id = dto.EmployeeId };

            _employeeLoginRepoMock
                .Setup(repo => repo.GetByIdAsync(dto.EmployeeId))
                .ReturnsAsync(existingLogin);

            // Act
            var result = await _authService.RegisterEmployeeAsync(dto);

            // Assert
            Assert.False(result);
            _employeeLoginRepoMock.Verify(repo => repo.AddAsync(It.IsAny<EmployeeLogin>()), Times.Never);
            _employeeLoginRepoMock.Verify(repo => repo.SaveChangesAsync(), Times.Never);
        }
    }
}
