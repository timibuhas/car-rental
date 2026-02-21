using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;


    [ApiController]
    [Route("clienti")]
    public class ClientiController : ControllerBase
    {
        private readonly RentACarContext _context;

        public ClientiController(RentACarContext context)
        {
            _context = context;
        }

        // GET: api/clienti
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Client>>> GetClienti()
        {
            var clienti = await _context.Clienti.ToListAsync();
            return Ok(clienti);
        }

        // GET: api/clienti/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Client>> GetClient(int id)
        {
            var client = await _context.Clienti
                                       .Include(c => c.Inchirieri) // opțional, pentru a include închirierile
                                       .FirstOrDefaultAsync(c => c.ClientId == id);
            if (client == null)
                return NotFound($"Nu s-a găsit un client cu ID={id}.");

            return Ok(client);
        }

        // POST: api/clienti
        [HttpPost]
        public async Task<ActionResult<Client>> PostClient([FromBody] Client newClient)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            _context.Clienti.Add(newClient);
            await _context.SaveChangesAsync();

            // Returnăm 201 Created + locația resursei nou create
            return CreatedAtAction(nameof(GetClient), new { id = newClient.ClientId }, newClient);
        }

        // PUT: api/clienti/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutClient(int id, [FromBody] Client updatedClient)
        {

            if (id != updatedClient.ClientId)
                return BadRequest("ID-ul din URL nu corespunde cu ID-ul clientului.");

            _context.Entry(updatedClient).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                // Verificăm dacă clientul încă există
                if (!ClientExists(id))
                    return NotFound($"Nu s-a găsit un client cu ID={id} pentru actualizare.");

                throw; // altfel, relansăm eroarea
            }

        var updatedEntity = await _context.Clienti.FindAsync(id);

        if (updatedEntity == null)
         {
           return NotFound($"Nu s-a putut găsi clientul actualizat cu ID={id}.");
         }

         return Ok(updatedEntity); // 200, returnăm obiectul actualizat
        }

        // DELETE: api/clienti/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteClient(int id)
        {
            var client = await _context.Clienti.FindAsync(id);
            if (client == null)
                return NotFound($"Nu s-a găsit clientul cu ID={id} pentru ștergere.");

            _context.Clienti.Remove(client);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ClientExists(int id)
        {
            return _context.Clienti.AnyAsync(c => c.ClientId == id).Result;
        }
    }

