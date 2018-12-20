using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using SistemaAC.Data;
using SistemaAC.ModelClass;

namespace SistemaAC.Controllers
{
    public class InscripcionesController : Controller
    {
        private InscripcionesModels inscripcion;

        public InscripcionesController(ApplicationDbContext context)
        {
            inscripcion = new InscripcionesModels(context);
        }

        public IActionResult Index()
        {
            return View();
        }
    }
}