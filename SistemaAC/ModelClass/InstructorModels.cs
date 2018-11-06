using Microsoft.AspNetCore.Identity;
using SistemaAC.Data;
using SistemaAC.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SistemaAC.ModelClass
{
    public class InstructorModels
    {

        //Declaro mi contexto 
        private ApplicationDbContext context;
        //identiry error
        private List<IdentityError> identityError = new List<IdentityError>();
        private string code = "", des = "";

        //Metodo constructor
        public InstructorModels(ApplicationDbContext context)
        {
            this.context = context;
        }

        //Guardar instructor
        public List<IdentityError> GuardarInstructor(List<Instructor> parametros)
        {
            var instructor = new Instructor
            {
                Especialidad = parametros[0].Especialidad,
                Nombre = parametros[0].Nombre,
                Apellidos = parametros[0].Apellidos,
                FechaNacimiento = parametros[0].FechaNacimiento,
                Documento = parametros[0].Documento,
                Email = parametros[0].Email,
                Telefono = parametros[0].Telefono,
                Direccion = parametros[0].Direccion,
                Estado = parametros[0].Estado
            };

            try
            {
                context.Instructor.Add(instructor);
                context.SaveChanges();

                code = "Save";
                des = "Save";

            }
            catch (Exception ex)
            {
                code = "Not Save";
                des = ex.Message;
            }

            identityError.Add(new IdentityError
            {
                Code = code,
                Description = des,
            });

            return identityError;
        }

        //Obtener Instructores
        public List<object[]> GetInstructores()
        {
            string estado = "";
            string rows = "";
            List<object[]> data = new List<object[]>();
            List<Instructor> instructores;
            instructores = context.Instructor.ToList();

            foreach (var item in instructores)
            {
                if (item.Estado)
                {
                    estado = "<a onclick='editarInstructor(" + item.Id + ',' + 0 + ")'  class='btn btn-success'>" +
                        "Activo</a> ";
                }
                else
                {
                    estado = "<a onclick='editarInstructor(" + item.Id + ',' + 0 + ")'  class='btn btn-success'>" +
                        "No activo</a> ";
                }
                rows += "<tr>" +
                       "<td>" + item.Especialidad + "</td>" +
                       "<td>" + item.Nombre + "</td>" +
                       "<td>" + item.Apellidos + "</td>" +
                       "<td>" + item.FechaNacimiento + "</td>" +
                       "<td>" + item.Documento + "</td>" +
                       "<td>" + item.Email + "</td>" +
                       "<td>" + item.Telefono + "</td>" +
                       "<td>" + item.Direccion + "</td>" +
                       "<td>" + estado + "</td>" +
                       "</tr>";

            }

            object[] dataObj = { rows };
            data.Add(dataObj);

            return data;


        }
    }
}
