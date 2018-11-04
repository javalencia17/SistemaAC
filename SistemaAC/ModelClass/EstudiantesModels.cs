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
        
        public EstudiantesModels(ApplicationDbContext context)
        {
            this.context = context;
        }

        public List<IdentityError> guardarEstudiante(int id,string codigo, string nombre,string  apellidos,
            DateTime fecha, string documento,string email,string telefono, string direccion,Boolean
            estado, int funcion)
        {
            var estudiante = new Estudiante
            {
                Id = id,
                Codigo = codigo,
                Nombre = nombre,
                Apellidos = apellidos,
                FechaNacimiento = fecha,
                Documento = documento,
                Email = email,
                Telefono = telefono,
                Direccion = direccion,
                Estado = estado
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

        public List<object[]> filtrarEstudiantes(int numPagina,string valor,string order)
        {
            int cant, numRegistros = 0, inicio = 0, reg_por_pagina = 6;
            int cant_paginas, paginas = 0, count = 1;
            string dataFilter = "", paginador = "", estado = null;
            List<object[]> data = new List<object[]>();
            IEnumerable<Estudiante> query;
            List<Estudiante> estudiantes = null;

            estudiantes = context.Estudiante.OrderBy(p => p.Nombre).ToList();
            numRegistros = estudiantes.Count();
            inicio = (numPagina - 1) * reg_por_pagina;
            cant_paginas = (numRegistros / reg_por_pagina);
            if (valor == "null")
                query = estudiantes.Skip(inicio).Take(reg_por_pagina);
            else
                query = estudiantes.Where(p => p.Documento.StartsWith(valor) || p.Nombre.StartsWith(valor)
                || p.Apellidos.StartsWith(valor)).Skip(inicio).Take(reg_por_pagina);
            cant = query.Count();
           
        }

    }
}
