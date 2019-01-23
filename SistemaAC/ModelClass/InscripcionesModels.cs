using Microsoft.AspNetCore.Identity;
using SistemaAC.Data;
using SistemaAC.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SistemaAC.ModelClass
{
    public class InscripcionesModels
    {
        private ApplicationDbContext context;
        private List<IdentityError> errorList = new List<IdentityError>();
        private string code = "", des = "";

        public InscripcionesModels(ApplicationDbContext context)
        {
            this.context = context;
        }

        public String filtrarEstudiante(String valor)
        {
            String dataFilter = "";
            if (valor != "null")
            {
                var estudiantes = context.Estudiante.OrderBy(e => e.Nombre).ToList();
                var query = estudiantes.Where(p => p.Documento.StartsWith(valor) || p.Nombre.StartsWith(valor) ||
                            p.Apellidos.StartsWith(valor));

                foreach (var item in query)
                {
                    dataFilter += "<tr>" +
                        "<td>" + "<input type='checkbox' name='cboxEstudiante[]' id='cboxEstudiante'" +
                        " value='" + item.Id + "'>" + "</td>" +
                        "<td>" + item.Apellidos + " " + item.Nombre + "</td>" +
                        "<td>" + item.Documento + "</td>" +
                        "<td>" + item.Email + "</td>" +
                        "<td>" + item.Telefono + "</td>" +
                        "</tr>";
                }
            }

            return dataFilter;

        }

        public List<Estudiante> getEstudiante(int id)
        {
            return context.Estudiante.Where(e => e.Id == id).ToList();
        }

        public String filtrarCurso(string valor)
        {
           
            String dataFilter = "";
            if (valor != "null")
            {
                var listCursos = from c in context.Curso
                                 join a in context.Asignacion on c.CursoId equals a.CursoID
                                 select new
                                 {
                                     c.CursoId,
                                     c.Nombre,
                                     c.CategoriaID,
                                     c.Creditos,
                                     c.Horas,
                                     c.Costo
                                 };



                var cursos = listCursos.OrderBy(e => e.Nombre).ToList();
                var query = cursos.Where(p => p.Nombre.StartsWith(valor));

                foreach (var item in query)
                {
                    dataFilter += "<tr>" +
                        "<td>" + "<input type='checkbox' name='cboxCurso[]' id='cboxCurso'" +
                        " value='" + item.CursoId + "'>" + "</td>" +
                        "<td>" + item.Nombre + "</td>" +
                        "<td>" + getCategoria(item.CategoriaID) + "</td>" +
                        "<td>" + item.Creditos + "</td>" +
                        "<td>" + item.Horas + "</td>" +
                        "<td>" + item.Costo+ "</td>" +
                        "</tr>";
                }
            }

            return dataFilter;
        }

        public string getCategoria(int id)
        {
            var data = context.Categoria.Where(c => c.CategoriaId == id).ToList();

            return data[0].Nombre;
        }

        public List<Curso> getCurso(int id)
        {
            return context.Curso.Where(e => e.CursoId == id).ToList();
        }


        public List<IdentityError> guardarCursos(List<Inscripcion> listCursos)
        {
            try
            {
                for (int i = 0; i < listCursos.Count; i++)
                {
                    context.Add(listCursos[i]);
                    context.SaveChanges();
                }

                code = "Save";
                des = "Save";
            }
            catch (Exception ex)
            {
                code = "Error";
                des = ex.Message;

            }

            errorList.Add(new IdentityError
            {
                Code = code,
                Description = des
            });

            return errorList;
        }
    }
}
