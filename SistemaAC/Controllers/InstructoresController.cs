using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using SistemaAC.Data;
using SistemaAC.ModelClass;
using SistemaAC.Models;

namespace SistemaAC.Controllers
{
    public class InstructoresController : Controller
    {
        private readonly ApplicationDbContext _context;
        // 1 creo la instancia 
        private InstructorModels instructor;

        public InstructoresController(ApplicationDbContext context)
        {
            _context = context;
            // 2 inicializa la instancia
            instructor = new InstructorModels(context);
        }

        // GET: Instructors
        public async Task<IActionResult> Index()
        {
            return View(await _context.Instructor.ToListAsync());
        }

        //POST: guardarInstructor
        public List<IdentityError> GuardarInstructor(List<Instructor> parametros)
        {
            return instructor.GuardarInstructor(parametros);
        }

        // GET: getInstructor
        public List<object[]> GetInstructores()
        {
            return instructor.GetInstructores();
        }

        // POST: getInstructor
        public List<Instructor> getInstructor(int id)
        {
            return instructor.getInstructor(id);
        }

        //POST: editarInstructor
        public List<IdentityError> editarInstructor(List<Instructor> parametros, int funcion)
        {
            return instructor.editarInstructor(parametros,funcion);
        }

        //POST: deleteInstructor
        public List<IdentityError> deleteInstructor(int id)
        {
            return instructor.deleteInstructor(id);
        }

        //POST: updateInstructor
        public List<IdentityError> updateInstructor(List<Instructor> parametros)
        {
            return instructor.updateInstructor(parametros);
        }
        



    }
}
