using Microsoft.AspNetCore.Mvc;
using SistemaAC.Data;
using SistemaAC.ModelClass;
using SistemaAC.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SistemaAC.Controllers
{
    public class MisCursosController : Controller
    {
        private MisCursosModels misCursos;
        public MisCursosController(ApplicationDbContext context)
        {
            misCursos = new MisCursosModels(context);
        }

        public IActionResult Index()
        {
            return View();
        }

        public List<object[]> filtrarMisCursos(int numPagina, string valor)
        {
            return misCursos.filtrarMisCursos(numPagina, valor);
        }

        public List<Curso> getMisCursos(string query)
        {
            return misCursos.getMisCursos(query);
        }

    }
}
