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
        private Boolean estados;

        public CursoModels(ApplicationDbContext context)
        {
            this.context = context;
        }

        internal List<Categoria> getCategorias()
        {
            return context.Categoria.Where(c => c.Estado == true).ToList();
        }

        public List<Categoria> getCategoria(int id)
        {
            return context.Categoria.Where(c => c.CategoriaId == id).ToList();
        }

        public  List<Curso> getCurso(int id)
        {
            return context.Curso.Where(c => c.CursoId == id).ToList();
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

        public  List<IdentityError> editarCurso(int id, string nombre, string descripcion, byte creditos,
             byte horas, decimal costo, Boolean estado, int categoriaID, int funcion)
        {
            switch (funcion)
            {
                case 0:
                    if (estado)
                    {
                        estados = false;
                    }
                    else
                    {
                        estados = true;    
                    }
                    break;
                case 1:
                    estados = estado;
                    break;
            }
            var curso = new Curso
            {
                CursoId = id,
                Nombre = nombre,
                Descripcion = descripcion,
                Creditos = creditos,
                Horas = horas,
                Costo = costo,
                Estado = estados,
                CategoriaID = categoriaID
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

            errorList.Add(new IdentityError
            {
                Code = code,
                Description = des
            });

            return errorList;
        }

        public List<object[]> filtrarCurso(int numPagina, string valor, string order)
        {
            int cant, numRegistros = 0, inicio = 0, reg_por_pagina = 3;
            int cant_paginas, pagina;
            string dataFilter = "", paginador = "", Estado = null;
            List<Object[]> data = new List<object[]>();
            IEnumerable<Curso> query;
            List<Curso> cursos = null;
            switch (order)
            {
                case "nombre":
                    cursos = context.Curso.OrderBy(c => c.Nombre).ToList();
                    break;
                case "des":
                    cursos = context.Curso.OrderBy(c => c.Descripcion).ToList();
                    break;
                case "creditos":
                    cursos = context.Curso.OrderBy(c => c.Creditos).ToList();
                    break;
                case "horas":
                    cursos = context.Curso.OrderBy(c => c.Horas).ToList();
                    break;
                case "costo":
                    cursos = context.Curso.OrderBy(c => c.Costo).ToList();
                    break;
                case "estado":
                    cursos = context.Curso.OrderBy(c => c.Estado).ToList();
                    break;
                case "categoria":
                    cursos = context.Curso.OrderBy(c => c.categoria).ToList();
                    break;
            }
            numRegistros = cursos.Count();
            if ((numRegistros % reg_por_pagina) > 0)
            {
                numRegistros += 1;
            }
            inicio = (numPagina - 1) * reg_por_pagina;
            cant_paginas = (numRegistros / reg_por_pagina);
            if (valor == null)
            {
                query = cursos.Skip(inicio).Take(reg_por_pagina);
            }
            else
            {
                query = cursos.Where(c => c.Nombre.StartsWith(valor) || c.Descripcion.StartsWith
                (valor)).Skip(inicio).Take(reg_por_pagina);
            }

            cant = query.Count();
            foreach (var item in query)
            {
                var categoria = getCategoria(item.CategoriaID);
                if (item.Estado == true)
                {
                    Estado = "<a data-toggle='modal' data-target='#modalEstadoCurso' " +
                        "onclick='editarEstadoCurso(" + item.CursoId + ',' + 0 + ")' class='btn btn-success'>" +
                        "Activo</a>";
                }
                else
                {
                    Estado = "<a data-toggle='modal' data-target='#modalEstadoCurso' " +
                        "onclick='editarEstadoCurso(" + item.CursoId + ',' + 0 + ")' class='btn btn-danger'>" +
                        "No activo</a>";
                }
                dataFilter += "<tr>" +
                    "<td>" + item.Nombre + "</td>" +
                    "<td>" + item.Descripcion + "</td>" +
                    "<td>" + item.Creditos + "</td>" +
                    "<td>" + item.Horas + "</td>" +
                    "<td>" + item.Costo + "</td>" +
                    "<td>" + Estado + "</td>" +
                    "<td>" + categoria[0].Nombre + "</td>" +
                    "<td>" +
                    "<a data-toggle='modal' data-target='#modalCS' onclick='editarEstadoCurso(" + item.CursoId +
                      ',' + 1 + ")' class='btn btn-success'>Edit</a>" +
                    "</td>" +
                    "<td>" +
                        getInstructorCurso(item.CursoId)
                    + "</td>" +
                 "</tr>";
            }
            if (valor == null)
            {
                if (numPagina > 1)
                {
                    pagina = numPagina - 1;
                    paginador += "<a class='btn btn-default' onclick='filtrarCurso(" + 1 + ',' + '"' +
                        order + '"' + ")'> << </a>" +
                       "<a class='btn btn-default' onclick='filtrarCurso(" + pagina + ',' + '"' + order + '"'
                       + ")'> < </a>";

                }
                if (1 < cant_paginas)
                {
                    paginador += "<strong class='btn btn-success'> " + numPagina + ".de." + cant_paginas +
                        "</strong>";
                }
                if (numPagina < cant_paginas)
                {
                    pagina = numPagina + 1;
                    paginador += "<a class='btn btn-default' onclick='filtrarCurso(" + pagina + ',' + '"' + order + '"'
                       + ")'> > </a>" +
                        "<a class='btn btn-default' onclick='filtrarCurso(" + cant_paginas + ',' + '"' + order + '"'
                       + ")'> >> </a>";

                }
            }

            Object[] dataObj = { dataFilter, paginador };
            data.Add(dataObj);
            return data;

        }

        private string getInstructorCurso(int cursoID) 
        {
            string boton;
            var data = context.Asignacion.Where(c => c.CursoID == cursoID).ToList();

            if (data.Count > 0)
            {
                boton = "<a href='#' onclick='getInstructorCurso(" + data[0].AsignacionID + ',' + cursoID + ','
                    + data[0].InstructorID + ',' + 2 + ")' class='btn btn-info'> Actualizar</a>";
            }
            else
            {
                boton = "<a href='#' onclick='getInstructorCurso(" + 0 + ',' + cursoID + ','
                    + 0 + ',' + 3 + ")' class='btn btn-info'> Asignar</a>";
            }

            return boton;

        }

        internal List<Instructor> getInstructor()
        {
            return context.Instructor.Where(c => c.Estado == true).ToList();
        }

        internal List<IdentityError> instructorCurso(List<Asignacion> asig)
        {
            var asignacion = new Asignacion
            {
                AsignacionID = asig[0].AsignacionID,
                CursoID = asig[0].CursoID,
                InstructorID = asig[0].InstructorID,
                Fecha = asig[0].Fecha
            };

            try
            {
                context.Update(asignacion);
                context.SaveChanges();
                code = "Save";
                des = "Save";
            }
            catch (Exception ex)
            {
                code = "Error";
                des = ex.Message;
            }
            errorList.Add(new IdentityError {
                Code = code,
                Description = des
            });

            return errorList;

        }
    }
}
