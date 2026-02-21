using System.ComponentModel.DataAnnotations;

public class User
{
    public int UserId { get; set; }

    public string Username { get; set; }

    [EmailAddress]
    public string Email { get; set; }


    [MinLength(6)]
    public string Password { get; set; }
}
