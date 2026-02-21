using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;

[Route("users")]
[ApiController]
public class AccountController : ControllerBase
{
    private readonly RentACarContext _context;

    public AccountController(RentACarContext context)
    {
        _context = context;
    }

    // Register Endpoint
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] User model)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        // Check if username or email already exists
        var existingUser = await _context.Users
            .FirstOrDefaultAsync(u => u.Username == model.Username || u.Email == model.Email);

        if (existingUser != null)
        {
            return BadRequest("Username or Email already exists.");
        }

        // Add new user to the database
        var newUser = new User
        {
            Username = model.Username,
            Email = model.Email,
            Password = model.Password // In a real-world scenario, hash the password before saving!
        };

        _context.Users.Add(newUser);
        await _context.SaveChangesAsync();

        return Ok("User registered successfully.");
    }

    // Login Endpoint
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginModel model)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        // Find user by username or email
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Username == model.Username && u.Password == model.Password);

        if (user == null)
        {
            return Unauthorized("Invalid username or password.");
        }

        return Ok(user);
    }
        [HttpGet]
    public async Task<IActionResult> GetAllUsers()
    {
        var users = await _context.Users
            .ToListAsync();

        return Ok(users);
    }
}
