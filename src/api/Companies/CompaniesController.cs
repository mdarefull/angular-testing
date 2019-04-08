using api.General.Countries;

using Microsoft.AspNetCore.Mvc;

using System;
using System.Collections.Generic;
using System.Linq;

using static GenFu.GenFu;

namespace api.Companies
{
    /// <summary>
    /// Company service.
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    public class CompaniesController : ControllerBase
    {
        private static List<Company> Companies { get; }

        static CompaniesController()
        {
            Companies = ListOf<Company>(5);

            var rnd = new Random();
            var id = 1;
            foreach (var company in Companies)
            {
                company.Id = id++;
                company.StockLogoColor = (byte)rnd.Next(1, 5);

                var countryId = rnd.Next(0, CountriesController.Countries.Count);
                company.Country = CountriesController.Countries[countryId];
                company.CreationDate = company.CreationDate.ToUniversalTime();
            }
        }

        /// <summary>
        /// Gets the collection of <see cref="Company"/> of the application.
        /// </summary>
        /// <returns><see cref="OkObjectResult"/> with the collection of <see cref="Company"/> of the application.</returns>
        [HttpGet]
        public ActionResult<IReadOnlyCollection<Company>> Get() => Companies.AsReadOnly();

        /// <summary>
        /// Adds a new <see cref="Company"/> to the application.
        /// </summary>
        /// <param name="newCompany">The <see cref="Company"/> to add</param>
        /// <returns><see cref="CreatedAtActionResult"/> with the created <see cref="Company"/> if success.</returns>
        [HttpPost]
        [ProducesResponseType(201)]
        public ActionResult<Company> Post(NewCompany newCompany)
        {
            var rnd = new Random();
            var company = new Company
            {
                Country = CountriesController.Countries.Find(c => c.Id == newCompany.CountryId),
                CreationDate = DateTime.UtcNow,
                Email = newCompany.Email,
                Id = Companies.Max(c => c.Id) + 1,
                MarketValue = newCompany.MarketValue,
                Name = newCompany.Name,
                StockLogoColor = (byte)rnd.Next(1, 5),
            };
            Companies.Add(company);

            return CreatedAtAction(nameof(Get), company);
        }
    }
}
