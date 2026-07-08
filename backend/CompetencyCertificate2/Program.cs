using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.OpenApi.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.RateLimiting;
using System.Threading.RateLimiting;
using CompetencyCertificate.Models;
using CompetencyCertificate.Repositories;
using CompetencyCertificate.Services;
using Microsoft.AspNetCore.Server.Kestrel.Core;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

builder.WebHost.ConfigureKestrel(options =>
{
    options.ListenLocalhost(7269, listenOptions =>
    {
        listenOptions.UseHttps();
        listenOptions.Protocols = HttpProtocols.Http1;
    });
});

builder.Services.AddScoped<CompetencyCertificate.Filters.TenantFilter>();
builder.Services.AddControllers(options =>
{
    options.Filters.Add<CompetencyCertificate.Filters.TenantFilter>();
});

// CORS Configuration - More permissive for development
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins("http://localhost:4200", "https://localhost:4200")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials()
              .SetPreflightMaxAge(TimeSpan.FromMinutes(30)); // Cache preflight for 30 minutes
    });

    // Alternative policy name if you prefer
    options.AddPolicy("AllowAngularApp", policy =>
    {
        policy.WithOrigins("http://localhost:4200", "https://localhost:4200")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials()
              .WithExposedHeaders("Authorization"); // Expose Authorization header
    });
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "CompetencyCertificate", Version = "v1" });
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "Enter **Bearer** followed by your JWT token",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id   = "Bearer"
                },
                Scheme = "oauth2",
                Name   = "Bearer",
                In     = ParameterLocation.Header
            },
            new List<string>()
        }
    });
});

var connectionString = Environment.GetEnvironmentVariable("DB_CONNECTION") 
    ?? builder.Configuration.GetConnectionString("DevConnection");

if (string.IsNullOrEmpty(connectionString))
{
    throw new InvalidOperationException("Connection string 'DevConnection' is not configured.");
}

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(connectionString));

builder.Services.AddHttpContextAccessor();

// Repositories
builder.Services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));
builder.Services.AddScoped<IEmployeeRepository, EmployeeRepository>();
builder.Services.AddScoped<ICertificateRepository, CertificateRepository>();

// Services
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IEmployeeService, EmployeeService>();
builder.Services.AddScoped<ICertificateService, CertificateService>();
builder.Services.AddScoped<IMasterDataService, MasterDataService>();
builder.Services.AddScoped<IContractorService, ContractorService>();
builder.Services.AddScoped<IEmailService, EmailService>();
builder.Services.AddHttpClient<IAiService, GeminiAiService>();

var jwtSecret = Environment.GetEnvironmentVariable("JWT_SECRET") 
    ?? builder.Configuration["AppSettings:JWTSecret"];

if (string.IsNullOrEmpty(jwtSecret))
{
    throw new InvalidOperationException("JWT Secret is not configured.");
}

// JWT Authentication
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(options =>
{
    options.SaveToken = false;
    options.RequireHttpsMetadata = false;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = false,
        ValidateAudience = false,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ClockSkew = TimeSpan.FromMinutes(5),
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret))
    };
});

// Add Rate Limiting Services
builder.Services.AddRateLimiter(options =>
{
    options.GlobalLimiter = PartitionedRateLimiter.Create<HttpContext, string>(context =>
    {
        return RateLimitPartition.GetFixedWindowLimiter(
            partitionKey: context.Connection.RemoteIpAddress?.ToString() ?? "global",
            factory: partition => new FixedWindowRateLimiterOptions
            {
                AutoReplenishment = true,
                PermitLimit = 100,
                QueueLimit = 10,
                QueueProcessingOrder = QueueProcessingOrder.OldestFirst,
                Window = TimeSpan.FromMinutes(1)
            });
    });

    options.AddTokenBucketLimiter("SensitiveEndpointsPolicy", tokenOptions =>
    {
        tokenOptions.TokenLimit = 20;
        tokenOptions.QueueLimit = 2;
        tokenOptions.QueueProcessingOrder = QueueProcessingOrder.OldestFirst;
        tokenOptions.ReplenishmentPeriod = TimeSpan.FromSeconds(10);
        tokenOptions.TokensPerPeriod = 5;
        tokenOptions.AutoReplenishment = true;
    });

    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
});

// Configure QuestPDF Community License
QuestPDF.Settings.License = QuestPDF.Infrastructure.LicenseType.Community;

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
    app.UseSwagger();
    app.UseSwaggerUI();
}

// CRITICAL: CORS must be applied BEFORE other middleware
app.UseCors("AllowAngularApp"); // This uses the default policy
app.UseRateLimiter();

// Alternative: Use named policy
// app.UseCors("AllowAngularApp");

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Seed Database on startup if empty
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    
    // Seed Departments
    if (!context.Department.Any())
    {
        context.Department.AddRange(
            new Department { DepartmentName = "HR", DepartmentCode = "HR01" },
            new Department { DepartmentName = "Operations", DepartmentCode = "OP01" }
        );
        context.SaveChanges();
    }

    // Seed Designations
    if (!context.Designation.Any())
    {
        context.Designation.AddRange(
            new Designation { Designation_Name = "HR", DesignationCode = "HRD01", designation_type = EmployeeType.Executive },
            new Designation { Designation_Name = "HOD", DesignationCode = "HOD01", designation_type = EmployeeType.Executive },
            new Designation { Designation_Name = "Signal Engineer", DesignationCode = "EMP01", designation_type = EmployeeType.NonExecutive }
        );
        context.SaveChanges();
    }

    // Seed Contractors
    if (!context.Contractor.Any())
    {
        context.Contractor.Add(new Contractor { ContractorName = "L&T", Logo = new byte[] { 1, 2, 3 } });
        context.SaveChanges();
    }

    // Seed HR Logins
    if (!context.HRLogin.Any())
    {
        context.HRLogin.Add(new HRLogin
        {
            employee_id = "HR1001",
            Password = BCrypt.Net.BCrypt.HashPassword("AdminPassword123"),
            Designation = "HR"
        });
        context.SaveChanges();
    }

    // Seed Employees & Logins
    if (!context.Employee.Any())
    {
        // 1. HOD Employee
        var hodEmployee = new Employee
        {
            Employee_id = "HOD1002",
            Employee_name = "HOD Administrator",
            DOB = new DateTime(1985, 5, 12),
            JoiningDate = new DateTime(2015, 1, 10),
            Employee_type = EmployeeType.Executive,
            CategoryName = Category.CMRLEmployee,
            Designation_Name = "HOD",
            DepartmentName = "Operations",
            EPF_UAN_NO = "UAN123456",
            ESA_NO = "ESA123456",
            BankName = "State Bank of India",
            BankAccountNumber = "SBI123456789",
            AadharNo = "123456789012",
            BloodGroup = "O+",
            ContactNo = "9876543210",
            EmerContactNo = "9876543211",
            Photo = new byte[] { 0 },
            Passbook = new byte[] { 0 }
        };
        context.Employee.Add(hodEmployee);
        context.EmployeeLogin.Add(new EmployeeLogin
        {
            employee_id = "HOD1002",
            Password = BCrypt.Net.BCrypt.HashPassword("HodPassword123")
        });

        // 2. Standard Employee
        var stdEmployee = new Employee
        {
            Employee_id = "EMP1003",
            Employee_name = "John Doe",
            DOB = new DateTime(1990, 8, 20),
            JoiningDate = new DateTime(2020, 3, 1),
            Employee_type = EmployeeType.NonExecutive,
            CategoryName = Category.NonCMRLEmployee,
            ContractorName = "L&T",
            Designation_Name = "Signal Engineer",
            DepartmentName = "Operations",
            EPF_UAN_NO = "UAN789012",
            ESA_NO = "ESA789012",
            BankName = "HDFC Bank",
            BankAccountNumber = "HDFC789012",
            AadharNo = "987654321098",
            BloodGroup = "A+",
            ContactNo = "9988776655",
            EmerContactNo = "9988776654",
            Photo = new byte[] { 0 },
            Passbook = new byte[] { 0 }
        };
        context.Employee.Add(stdEmployee);
        context.EmployeeLogin.Add(new EmployeeLogin
        {
            employee_id = "EMP1003",
            Password = BCrypt.Net.BCrypt.HashPassword("EmpPassword123")
        });

        context.SaveChanges();
    }
}

app.Run();