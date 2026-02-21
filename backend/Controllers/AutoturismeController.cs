using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;




    [ApiController]
    [Route("autoturisme")]
    public class AutoturismeController : ControllerBase
    {
        private readonly RentACarContext _context;

        public AutoturismeController(RentACarContext context)
        {
            _context = context;
        }

        // GET: api/autoturisme
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Autoturism>>> GetAutoturisme()
        {
            var autoturisme = await _context.Autoturisme.ToListAsync();
            return Ok(autoturisme);
        }

        // GET: api/autoturisme/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Autoturism>> GetAutoturism(int id)
        {
            var autoturism = await _context.Autoturisme
                                           .Include(a => a.Inchirieri) // opțional, pentru a include închirierile
                                           .FirstOrDefaultAsync(a => a.AutoturismId == id);

            if (autoturism == null)
                return NotFound($"Nu s-a găsit un autoturism cu ID={id}.");

            return Ok(autoturism);
        }

        // POST: api/autoturisme
        [HttpPost]
        public async Task<ActionResult<Autoturism>> PostAutoturism([FromBody] Autoturism newAuto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            _context.Autoturisme.Add(newAuto);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetAutoturism), new { id = newAuto.AutoturismId }, newAuto);
        }

        // PUT: api/autoturisme/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutAutoturism(int id, [FromBody] Autoturism updatedAuto)
        {
            if (id != updatedAuto.AutoturismId)
                return BadRequest("ID-ul din URL nu corespunde cu ID-ul autoturismului.");

            _context.Entry(updatedAuto).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!AutoturismExists(id))
                    return NotFound($"Nu s-a găsit autoturismul cu ID={id} pentru actualizare.");

                throw;
            }

        var updatedEntity = await _context.Autoturisme.FindAsync(id);

        if (updatedEntity == null)
         {
           return NotFound($"Nu s-a putut găsi autoturismul actualizat cu ID={id}.");
         }

         return Ok(updatedEntity); // 200, returnăm obiectul actualizat
        }

        // DELETE: api/autoturisme/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAutoturism(int id)
        {
            var autoturism = await _context.Autoturisme.FindAsync(id);
            if (autoturism == null)
                return NotFound($"Nu s-a găsit autoturismul cu ID={id} pentru ștergere.");

            _context.Autoturisme.Remove(autoturism);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool AutoturismExists(int id)
        {
            return _context.Autoturisme.AnyAsync(a => a.AutoturismId == id).Result;
        }
    }

