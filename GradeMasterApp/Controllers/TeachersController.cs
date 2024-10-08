﻿using GradeMasterApp.DTOs;
using GradeMasterApp.Models;
using GradeMasterApp.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Cryptography;
using System.Text;

namespace GradeMasterApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TeachersController : ControllerBase
    {
        private readonly MongoDBService _mongoDBContext;

        public TeachersController(MongoDBService mongoDBService)
        {
            _mongoDBContext = mongoDBService;
        }

        // Registers a new teacher
        [HttpPost("register")]
        public async Task<ActionResult<TeacherDTO>> Register(RegisterDTO registerDto)
        {
            if (registerDto.Password != registerDto.ConfirmPassword)
            {
                return BadRequest("Passwords do not match");
            }

            // Check if the email is already taken
            if (await TeacherExists(registerDto.Email))
            {
                return BadRequest("Email is already taken");
            }

            using var hmac = new HMACSHA512();

            // Create a new teacher
            var teacher = new Teacher
            {
                Email = registerDto.Email.ToLower(),
                FirstName = registerDto.FirstName,
                LastName = registerDto.LastName,
                Institution = registerDto.Institution,
                PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(registerDto.Password)),
                PasswordSalt = hmac.Key
            };

            await _mongoDBContext.CreateTeacherAsync(teacher);
            return Ok();
        }

        // Authenticates a teacher based on their email and password
        [HttpPost("login")]
        public async Task<ActionResult> Login(LoginDTO loginDto)
        {
            var teacher = await _mongoDBContext.GetTeacherAsync(loginDto.Email.ToLower());

            // Check if the user exists
            if (teacher == null)
            {
                return Unauthorized(new { Message = "Invalid email or password" });
            }

            using var hmac = new HMACSHA512(teacher.PasswordSalt);
            var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(loginDto.Password));

            for (int i = 0; i < computedHash.Length; i++)
            {
                if (computedHash[i] != teacher.PasswordHash[i])
                {
                    return Unauthorized(new { Message = "Invalid email or password" });
                }
            }

            return Ok(new TeacherDTO
            {
                Id = teacher.Id,
                Email = teacher.Email,
                FirstName = teacher.FirstName,
                LastName = teacher.LastName,
                Institution = teacher.Institution
            });
        }

        // Helper method to check if a teacher with a specific email exists
        private async Task<bool> TeacherExists(string email)
        {
            if (string.IsNullOrWhiteSpace(email))
            {
                return false;
            }

            var user = await _mongoDBContext.GetTeacherAsync(email.ToLower());
            return user != null;
        }

        // Changes the password for a teacher
        [HttpPost("change-password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDTO changePasswordDto)
        {
            var teacher = await _mongoDBContext.GetTeacherAsync(changePasswordDto.Email.ToLower());
            if (teacher == null) return NotFound("Teacher not found");

            // Verify the current password
            using var hmac = new HMACSHA512(teacher.PasswordSalt);
            var currentPasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(changePasswordDto.CurrentPassword));
            for (int i = 0; i < currentPasswordHash.Length; i++)
            {
                if (currentPasswordHash[i] != teacher.PasswordHash[i]) return BadRequest(new { Message = "Current password is incorrect" });
            }

            // Update with new password
            using var newHmac = new HMACSHA512();
            var newPasswordHash = newHmac.ComputeHash(Encoding.UTF8.GetBytes(changePasswordDto.NewPassword));
            var newPasswordSalt = newHmac.Key;

            await _mongoDBContext.UpdateTeacherPasswordAsync(teacher.Id, newPasswordHash, newPasswordSalt);
            return Ok(new { Message = "Password changed successfully." });
        }
    }
}
