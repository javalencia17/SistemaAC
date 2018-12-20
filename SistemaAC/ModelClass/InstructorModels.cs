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
                    estado = "<a onclick='editarInstructor(" + item.Id + ',' + 0 + ")'  class='btn btn-danger'>" +
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
                       "<td><a onclick='editarInstructor(" + item.Id + ',' + 1 + ")'  class='btn btn-success'>" +
                        "Editar</a><a onclick='eliminarInstructor(" + item.Id + ")'  class='btn btn-danger'>" +
                        "Borrar</a>" +
                        "</td>" +
                       "</tr>";

            }

            object[] dataObj = { rows };
            data.Add(dataObj);

            return data;


        }

        //Obtener instructor por id

        public List<Instructor> getInstructor(int id)
        {
            return context.Instructor.Where(c => c.Id == id).ToList();
        }

        //editar instructor
        public List<IdentityError> editarInstructor(List<Instructor> parametros, int funcion)
        {
            var EstadoTMP = true;
            if (funcion == 0)
            {
                if (parametros[0].Estado)
                {
                    EstadoTMP = false;
                }
                else
                {
                    EstadoTMP = true;
                }
                
            }
            else
            {

                EstadoTMP = parametros[0].Estado;
            }


            var instructor = new Instructor
            {
                Id = parametros[0].Id,
                Especialidad = parametros[0].Especialidad,
                Nombre = parametros[0].Nombre,
                Apellidos = parametros[0].Apellidos,
                FechaNacimiento = parametros[0].FechaNacimiento,
                Documento = parametros[0].Documento,
                Email = parametros[0].Email,
                Telefono = parametros[0].Telefono,
                Direccion = parametros[0].Direccion,
                Estado = EstadoTMP
            };

            try
            {
                context.Instructor.Update(instructor);
                context.SaveChanges();

                code = "Save";
                des = "Save";
            }
            catch (Exception ex)
            {

                code = "Error";
                des = ex.Message;
            }

            identityError.Add(new IdentityError {

                Code = code,
                Description = des

            });

            return identityError;
        }

        //Eliminar instructor
        public List<IdentityError> deleteInstructor(int id)
        {
            var instructor = context.Instructor.FirstOrDefault(i => i.Id == id);
            if (instructor == null)
            {
                code = "0";
                des = "Not";
            }
            else
            {
                context.Instructor.Remove(instructor);
                context.SaveChanges();

                code = "1";
                des = "Save";
            }

            identityError.Add(new IdentityError
            {
                Code = code,
                Description = des
            });

            return identityError;
        }

        //Update instructor
        public List<IdentityError> updateInstructor(List<Instructor> parametros)
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
                Estado = parametros[0].Estado,
                Id = parametros[0].Id
            };

            try
            {

                context.Instructor.Update(instructor);
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


    }
}
