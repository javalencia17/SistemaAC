using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using SistemaAC.Data;
using SistemaAC.ModelClass;
using SistemaAC.Models;

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

        public String filtrarEstudiante(String valor)
        {   
            return inscripcion.filtrarEstudiante(valor);
        }

        public List<Estudiante> getEstudiante(int id)
        {
            return inscripcion.getEstudiante(id);
        }

        public String filtrarCurso(String valor)
        {
            return inscripcion.filtrarCurso(valor);
        }

        public List<Curso> getCurso(int id)
        {
            return inscripcion.getCurso(id);
        }

        public List<IdentityError> guardarCursos(List<Inscripcion> listCursos)
        {
            return inscripcion.guardarCursos(listCursos);
        }
    }
}