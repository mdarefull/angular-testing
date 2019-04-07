namespace api.Companies
{
    /// <summary>
    /// View Model to create a new <see cref="Company"/>
    /// </summary>
    public class NewCompany
    {
        /// <summary>
        /// Name
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// Email
        /// </summary>
        public string Email { get; set; }

        /// <summary>
        /// Id of the country.
        /// </summary>
        public short CountryId { get; set; }

        /// <summary>
        /// Market value
        /// </summary>
        public decimal MarketValue { get; set; }
    }
}
