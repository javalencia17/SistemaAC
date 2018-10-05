using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using SistemaAC.Data;
using SistemaAC.Models;

namespace SistemaAC.ModelClass
{
    public class CursoModels
    {
        private ApplicationDbContext context;
        private List<IdentityError> errorList = new List<IdentityError>();
        private string code = "", des = "";

        public CursoModels(ApplicationDbContext context)
        {
            this.context = context;
        }

        internal List<Categoria> getCategorias()
        {
            return context.Categoria.Where(c => c.Estado == true).ToList();
        }

        internal List<IdentityError> agregarCurso(int id, string nombre, string descripcion, byte creditos,
            byte horas, decimal costo, bool estado, int categoria, string funcion)
        {
            var curso = new Curso
            {
                Nombre = nombre,
                Descripcion = descripcion,
                Creditos = creditos,
                Horas = horas,
                Costo = costo,
                Estado = estado,
                CategoriaID = categoria
            };
            try
            {
                context.Update(curso);
                context.SaveChanges();
                code = "Save";
                des = "Save";
            }
            catch (Exception e)
            {
                code = "error";
                des = e.Message;
            }

            errorList.Add(new IdentityError {
                Code = code,
                Description = des
            });

            return errorList;
        }

        internal List<object[]> filtrarCurso(int numPagina, string valor, string order)
        {
            throw new NotImplementedException();
        }
    }
}
