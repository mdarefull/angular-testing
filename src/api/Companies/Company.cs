using api.General.Countries;

using System;

namespace api.Companies
{
    /// <summary>
    /// Represents a company in the application.
    /// </summary>
    public class Company
    {
        /// <summary>
        /// Unique Identifier.
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        /// Color of the stock logo.
        /// </summary>
        public byte StockLogoColor { get; set; }

        /// <summary>
        /// Name
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// Email
        /// </summary>
        public string Email { get; set; }

        /// <summary>
        /// Country
        /// </summary>
        public Country Country { get; set; }

        /// <summary>
        /// Market value
        /// </summary>
        public decimal MarketValue { get; set; }

        /// <summary>
        /// Profile creation date.
        /// </summary>
        public DateTime CreationDate { get; set; }
    }
}
