using GradeMasterApp.Data;
using GradeMasterApp.Repositories;
using GradeMasterApp.Services;
using Microsoft.AspNetCore.Cors.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

DotNetEnv.Env.Load();

string mongoConnectionString = Environment.GetEnvironmentVariable("MONGO_CONNECTION_STRING") ?? string.Empty;
string databaseName = Environment.GetEnvironmentVariable("DATABASE_NAME") ?? string.Empty;

builder.Services.Configure<MongoDBSettings>(options =>
{
    options.ConnectionString = mongoConnectionString;
    options.DatabaseName = databaseName;
});

builder.Services.AddSingleton<MongoDBService>();

builder.Services.AddScoped<CourseRepository>();
builder.Services.AddScoped<EnrollmentRepository>();
builder.Services.AddScoped<StudentRepository>();
builder.Services.AddScoped<AssignmentRepository>();
builder.Services.AddScoped<ExamRepository>();

// Add services to the container.

builder.Services.AddControllers();

// Configure CORS with a specific policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigin",
        policy =>
        {
            policy.WithOrigins("http://localhost:4200")
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseCors("AllowSpecificOrigin");

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
