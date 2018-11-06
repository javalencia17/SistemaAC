using Microsoft.AspNetCore.Identity;
using SistemaAC.Data;
using SistemaAC.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SistemaAC.ModelClass
{
    public class EstudiantesModels
    {
        private ApplicationDbContext context;
        private List<IdentityError> identityError = new List<IdentityError>();
        private string code = "", des = "";
        private Boolean estados;

        public EstudiantesModels(ApplicationDbContext context)
        {
            this.context = context;
        }

        public List<IdentityError> guardarEstudiante(List<Estudiante> response, int funcion)
        {
            switch (funcion)
            {
                case 0:
                    if (response[0].Estado)
                        estados = false;
                    else
                        estados = true;
                    break;
                case 1:
                    estados = response[0].Estado;
                    break;
            }
            var estudiante = new Estudiante
            {
                Id = response[0].Id,
                Codigo = response[0].Codigo,
                Nombre = response[0].Nombre,
                Apellidos = response[0].Apellidos,
                FechaNacimiento = response[0].FechaNacimiento,
                Documento = response[0].Documento,
                Email = response[0].Email,
                Telefono = response[0].Telefono,
                Direccion = response[0].Direccion,
                Estado = estados
            };

            try
            {
                context.Update(estudiante);
                context.SaveChanges();
                code = "1";
                des = "Save";

            }
            catch (Exception ex)
            {
                code = "0";
                des = ex.Message;
            }

            identityError.Add(new IdentityError
            {
                Code = code,
                Description = des
            });

            return identityError;
        }

        public List<object[]> filtrarEstudiantes(int numPagina, string valor, string order)
        {
            int cant, numRegistros = 0, inicio = 0, reg_por_pagina = 1;
            int cant_paginas, pagina = 0, count = 1;
            string dataFilter = "", paginador = "", estado = null;
            List<object[]> data = new List<object[]>();
            IEnumerable<Estudiante> query;
            List<Estudiante> estudiantes = null;

            estudiantes = context.Estudiante.OrderBy(p => p.Nombre).ToList();
            numRegistros = estudiantes.Count();
            if ((numRegistros % reg_por_pagina) > 0)
            {
                numRegistros += 1; 
            }
            inicio = (numPagina - 1) * reg_por_pagina;
            cant_paginas = (numRegistros / reg_por_pagina);
            if (valor == "null")
                query = estudiantes.Skip(inicio).Take(reg_por_pagina);
            else
                query = estudiantes.Where(p => p.Documento.StartsWith(valor) || p.Nombre.StartsWith(valor)
                || p.Apellidos.StartsWith(valor)).Skip(inicio).Take(reg_por_pagina);
            cant = query.Count();
            foreach (var item in query)
            {
                if (item.Estado)
                {
                    estado = "<a onclick='editarEstudiante(" + item.Id + ',' + 0 + ")'  class='btn btn-success'>" +
                        "Activo</a> ";
                }
                else
                {
                    estado = "<a onclick='editarEstudiante(" + item.Id + ',' + 0 + ")'  class='btn btn-danger'>" +
                         "No activo</a> ";
                }
                dataFilter += "<tr>" +
                        "<td>" + item.Codigo + "</td>" +
                        "<td>" + item.Documento + "</td>" +
                        "<td>" + item.Nombre + "</td>" +
                        "<td>" + item.Apellidos + "</td>" +
                        "<td>" + item.FechaNacimiento + "</td>" +
                        "<td>" + item.Telefono + "</td>" +
                        "<td>" + item.Email + "</td>" +
                        "<td>" + item.Direccion + "</td>" +
                        "<td>" + estado + "</td>" +
                        "<td>" +
                        "<a data-toggle='modal' data-target='#modalAS' onclick='editarEstudiante(" + item.Id + ',' + 1 + ")'  class='btn btn-success'>" +
                        "Editar</a> " +
                        "</td>" +
                        "<td>" +
                        "<a data-toggle='modal' data-target='#modalDeleteAS' onclick='deleteEstudiante(" + item.Id + ")'  class='btn btn-danger'>" +
                        "Eliminar</a> " +
                        "</td>";
            }
            if (valor == "null")
            {
                if (numPagina > 1)
                {
                    pagina = numPagina - 1;
                    paginador += "<a  class='btn btn-default'  onclick='filtrarEstudiantes(" + 1 + ',' + '"'
                        + order +  '"' + ")'> << </a> " +
                        "<a  class='btn btn-default'  onclick='filtrarEstudiantes(" + pagina + ',' + '"'
                        + order + '"' + ")'> < </a> ";
                }
                if (1 < cant_paginas)
                {
                    for (int i = numPagina; i <= cant_paginas; i++)
                    {
                        paginador += "<strong  class='btn btn-success'  onclick='filtrarEstudiantes(" + i + ',' + '"'
                        + order + '"' + ")'>" + i + " </strong> ";
                        if (count == 5)
                        {
                            break;
                        }
                        count++;
                    }
                }
                if (numPagina < cant_paginas)
                {
                    pagina = numPagina + 1;
                    paginador += "<a  class='btn btn-default'  onclick='filtrarEstudiantes(" + pagina + ','
                        + '"' + order + '"' + ")'> < </a> " +
                        "<a  class='btn btn-default'  onclick='filtrarEstudiantes(" + cant_paginas + ','
                        + '"' + order + '"' + ")'> >> </a> ";
                }
            }

            object[] dataObj = {dataFilter, paginador };
            data.Add(dataObj);
            return data;

           
        }

        public List<Estudiante> getEstudiante(int id)
        {
            return context.Estudiante.Where(c => c.Id == id).ToList();
        }

        public List<IdentityError> deleteEstudiante(int id)
        {
            var estudiante = context.Estudiante.FirstOrDefault(m => m.Id == id);
            if (estudiante == null)
            {
                code = "0";
                des = "Not";
            }
            else
            {
                context.Estudiante.Remove(estudiante);
                context.SaveChanges();

                code = "1";
                des = "Save";
            }

            identityError.Add(new IdentityError {
                Code = code,
                Description = des
            });

            return identityError;
        }

    }
}
