using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;




    [ApiController]
    [Route("home")]
    public class HomeController : ControllerBase
    {
        private readonly RentACarContext _context;

        public HomeController(RentACarContext context)
        {
            _context = context;
        }
        [HttpGet("numbers/{id}")]
        public ActionResult<Home> GetNumbers(int id)
        {
            Home x=new Home();
            x.AutoturismeCount=_context.Autoturisme.Count();
            x.ClientiCount=_context.Clienti.Count();
            x.InchirieriCount=_context.Inchirieri.Where(i=>i.UserId==id).Count();
             return Ok(x);
        }
    }