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
            int cant, numRegistros = 0, inicio = 0, reg_por_pagina = 2;
            int cant_paginas, pagina;
            string dataFilter = "", paginador = "", Estado = null;
            List<Object[]> data = new List<object[]>();
            IEnumerable<Curso> query;
            List<Curso> categorias = null;
            switch (order)
            {
                case "nombre":
                    categorias = context.Curso.OrderBy(c => c.Nombre).ToList();
                    break;
                case "des":
                    categorias = context.Curso.OrderBy(c => c.Descripcion).ToList();
                    break;
                case "creditos":
                    categorias = context.Curso.OrderBy(c => c.Creditos).ToList();
                    break;
                case "horas":
                    categorias = context.Curso.OrderBy(c => c.Horas).ToList();
                    break;
                case "costo":
                    categorias = context.Curso.OrderBy(c => c.Costo).ToList();
                    break;
                case "estado":
                    categorias = context.Curso.OrderBy(c => c.Estado).ToList();
                    break;
                case "categoria":
                    categorias = context.Curso.OrderBy(c => c.categoria).ToList();
                    break;
            }
            numRegistros = categorias.Count();
            inicio = (numPagina - 1) * reg_por_pagina;
            cant_paginas = (numRegistros / reg_por_pagina);
            if (valor == null)
            {
                query = categorias.Skip(inicio).Take(reg_por_pagina);
            }
            else
            {
                query = categorias.Where(c => c.Nombre.StartsWith(valor) || c.Descripcion.StartsWith
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
                 "</tr>";
            }

            Object[] dataObj = { dataFilter, paginador };
            data.Add(dataObj);
            return data;

        }
    }
}
