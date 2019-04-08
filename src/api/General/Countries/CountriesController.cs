using Microsoft.AspNetCore.Mvc;

using System.Collections.Generic;

namespace api.General.Countries
{
    /// <summary>
    /// General countries service.
    /// </summary>
    [Route("api/General/[controller]")]
    [ApiController]
    public class CountriesController : ControllerBase
    {
        internal static List<Country> Countries { get; } = new List<Country>
        {
            new Country { Id = 1, Name = "United States" },
            new Country { Id = 2, Name = "Canada" },
            new Country { Id = 3, Name = "Mexico" },
            new Country { Id = 4, Name = "Portugal" },
            new Country { Id = 5, Name = "Spain" },
            new Country { Id = 6, Name = "United Kingdom" },
            new Country { Id = 7, Name = "French" },
            new Country { Id = 8, Name = "Ireland" },
            new Country { Id = 9, Name = "Italy" },
            new Country { Id = 10, Name = "French" },
        };

        /// <summary>
        /// Gets the collection of <see cref="Country"/> of the application.
        /// </summary>
        /// <returns><see cref="OkObjectResult"/> with the collection of <see cref="Country"/> of the application.</returns>
        [HttpGet]
        public ActionResult<IReadOnlyCollection<Country>> Get() => Countries.AsReadOnly();
    }
}
