using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;


    [ApiController]
    [Route("inchirieri")]
    public class InchirieriController : ControllerBase
    {
        private readonly RentACarContext _context;

        public InchirieriController(RentACarContext context)
        {
            _context = context;
        }

        // GET: api/inchirieri
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Inchiriere>>> GetInchirieri()
        {
            // Include Client și Autoturism pentru afișarea datelor complete
            var inchirieri = await _context.Inchirieri
                .Include(i => i.Client)
                .Include(i => i.Autoturism)
                .ToListAsync();

            return Ok(inchirieri);
        }

        // GET: api/inchirieri/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Inchiriere>> GetInchiriere(int id)
        {
         var inchirieri = await _context.Inchirieri
          .Include(i => i.Client) // Include Client details
          .Include(i => i.Autoturism) // Include Autoturism details
          .Where(i => i.UserId == id) // Filter by ClientId
          .ToListAsync();

         // Check if rentals exist for the given user ID


          return Ok(inchirieri);
        }

        // POST: api/inchirieri
        [HttpPost]
        public async Task<ActionResult<Inchiriere>> PostInchiriere([FromBody] Inchiriere newInchiriere)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // Verifică dacă ClientId și AutoturismId sunt valide
            var clientExists = await _context.Clienti.AnyAsync(c => c.ClientId == newInchiriere.ClientId);
            var autoExists   = await _context.Autoturisme.AnyAsync(a => a.AutoturismId == newInchiriere.AutoturismId);

            if (!clientExists)
                return NotFound($"Clientul cu ID={newInchiriere.ClientId} nu există.");
            if (!autoExists)
                return NotFound($"Autoturismul cu ID={newInchiriere.AutoturismId} nu există.");

            // Calculează costul (opțional) – ex. TarifPeZi * nr. de zile
            // Sau poți lăsa logica de calcul în alt serviciu/clasă separată.
            var autoturism = await _context.Autoturisme.FindAsync(newInchiriere.AutoturismId);
            var nrZile = (newInchiriere.DataEnd - newInchiriere.DataStart).Days;
            if (nrZile < 1) nrZile = 1; // minim 1 zi
            newInchiriere.CostTotal = autoturism.TarifPeZi * nrZile;

            _context.Inchirieri.Add(newInchiriere);
            await _context.SaveChangesAsync();

             var createdInchiriere = await _context.Inchirieri
        .Include(i => i.Client)        // Load Client
        .Include(i => i.Autoturism)   // Load Autoturism
        .FirstOrDefaultAsync(i => i.InchiriereId == newInchiriere.InchiriereId);

    if (createdInchiriere == null)
        return NotFound("Eroare la încărcarea detaliilor închirierii nou create.");

    return CreatedAtAction(nameof(GetInchiriere), new { id = createdInchiriere.InchiriereId }, createdInchiriere);
        }

        // PUT: api/inchirieri/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutInchiriere(int id, [FromBody] Inchiriere updatedInchiriere)
        {
            if (id != updatedInchiriere.InchiriereId)
                return BadRequest("ID-ul din URL nu corespunde cu ID-ul închirierii.");

            _context.Entry(updatedInchiriere).State = EntityState.Modified;

            // (Re)Calculează costul dacă DataEnd a fost modificată (opțional)
            var autoturism = await _context.Autoturisme.FindAsync(updatedInchiriere.AutoturismId);
            var nrZile = (updatedInchiriere.DataEnd - updatedInchiriere.DataStart).Days;
            if (nrZile < 1) nrZile = 1;
            updatedInchiriere.CostTotal = autoturism.TarifPeZi * nrZile;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!InchiriereExists(id))
                    return NotFound($"Nu s-a găsit închirierea cu ID={id} pentru actualizare.");
                throw;
            }

    var updatedEntity = await _context.Inchirieri
        .Include(i => i.Client)        // Load Client
        .Include(i => i.Autoturism)   // Load Autoturism
        .FirstOrDefaultAsync(i => i.InchiriereId == id);

    if (updatedEntity == null)
        return NotFound($"Nu s-a găsit închirierea actualizată cu ID={id}.");

    return Ok(updatedEntity);
        }

        // DELETE: api/inchirieri/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteInchiriere(int id)
        {
            var inchiriere = await _context.Inchirieri.FindAsync(id);
            if (inchiriere == null)
                return NotFound($"Nu s-a găsit închirierea cu ID={id} pentru ștergere.");

            _context.Inchirieri.Remove(inchiriere);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool InchiriereExists(int id)
        {
            return _context.Inchirieri.AnyAsync(i => i.InchiriereId == id).Result;
        }
    }

