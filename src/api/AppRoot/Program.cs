using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;

namespace api.AppRoot
{
    /// <summary>
    /// Angular-testing example API.
    /// </summary>
    public static class Program
    {
        /// <summary>
        /// Main entry point for the application.
        /// </summary>
        /// <param name="args">Not used.</param>
        public static void Main(string[] args) => CreateWebHostBuilder(args).Build().Run();

        private static IWebHostBuilder CreateWebHostBuilder(string[] args) =>
            WebHost.CreateDefaultBuilder(args)
                .UseStartup<Startup>();
    }
}
