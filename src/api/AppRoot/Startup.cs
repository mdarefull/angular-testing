using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;

namespace api
{
    /// <summary>
    /// Startup class for the application.
    /// </summary>
    public class Startup
    {
        /// <summary>
        /// Registers the services for the application.
        /// </summary>
        /// <param name="services">Application's services container.</param>
        public void ConfigureServices(IServiceCollection services)
            => services
               .AddSwaggerDocument()
               .AddCors()
               .AddMvc()
               .SetCompatibilityVersion(CompatibilityVersion.Latest);

        /// <summary>
        /// Configure the HTTP request pipeline.
        /// </summary>
        /// <param name="app">Instance of the <see cref="IApplicationBuilder"/> to build the application's pipeline.</param>
        /// <param name="env">Instance of the <see cref="IHostingEnvironment"/> to provide information about the hosting environment.</param>
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage()
                   .UseSwagger(config => config.PostProcess = (doc, _) => doc.Info.Title = "Presentation API")
                   .UseSwaggerUi3();
            }

            app.UseCors(builder => builder.WithOrigins("http://localhost:4200")
                                          .AllowAnyHeader()
                                          .AllowAnyMethod())
               .UseMvc();
        }
    }
}
