using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using System.Threading.Tasks;

namespace CompetencyCertificate.Filters
{
    public class TenantFilter : IAsyncActionFilter
    {
        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            var httpContext = context.HttpContext;
            
            if (!httpContext.Request.Headers.TryGetValue("X-Tenant-Id", out var tenantId) || string.IsNullOrEmpty(tenantId))
            {
                httpContext.Items["TenantId"] = "DefaultTenant";
            }
            else
            {
                httpContext.Items["TenantId"] = tenantId.ToString();
            }

            await next();
        }
    }
}
