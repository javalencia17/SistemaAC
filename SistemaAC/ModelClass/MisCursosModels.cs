using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json;
using SistemaAC.Data;
using SistemaAC.Models;

namespace SistemaAC.ModelClass
{
    public class MisCursosModels : ListObject
    {
        private string dataFilter = "", paginador = "", curso;
        private int count = 0, cant, numRegistros = 0, inicio = 0, reg_por_pagina = 2;
        private int can_paginas, pagina;

        public MisCursosModels(ApplicationDbContext context)
        {
            this.context = context;
        }

        public List<Object[]> filtrarMisCursos(int numPagina, string valor)
        {
            count = 0;
            var inscripcion = context.Inscripcion.OrderBy(c => c.Fecha).ToList();
            numRegistros = inscripcion.Count;
            if ((numRegistros % reg_por_pagina) > 0)
            {
                numRegistros += 1;
            }
            inicio = (numPagina - 1) * reg_por_pagina;
            can_paginas = (numRegistros / reg_por_pagina);
            if (valor == "null")
            {
                dataInscripcion = inscripcion.Skip(inicio).Take(reg_por_pagina).ToList();
            }
            else
            {
                cursos = getCursos(valor);
                cursos.ForEach(item => {
                    var data = inscripcion.Where(c => c.CursoID == item.CursoId).Skip(inicio).Take(reg_por_pagina).ToList();
                    if (0 < data.Count)
                    {
                        var inscripciones = new Inscripcion
                        {
                            Grado = data[0].Grado,
                            CursoID = data[0].CursoID,
                            EstudianteID = data[0].EstudianteID,
                            Fecha = data[0].Fecha,
                            Pago = data[0].Pago 
                        };
                        dataInscripcion.Add(inscripciones);
                    }
                });
            }
            foreach (var item in dataInscripcion)
            {
                if (0 < cursos.Count)
                {
                    curso = cursos[count].Nombre;
                }
                else
                {
                    curso = getCurso(item.CursoID);
                }
                object[] dataCurso = {
                    curso,
                    getEstudiante(item.EstudianteID),
                    getInstructor(getAsignacion(item.CursoID)),
                    item.Grado,
                    item.Pago,
                    item.Fecha
                };

                dataFilter += "<tr>" +
                    "<td>" + curso + "</td>" +
                    "<td>" + getEstudiante(item.EstudianteID)+ "</td>" +
                    "<td>" + getInstructor(getAsignacion(item.CursoID)) + "</td>" +
                    "<td>" + item.Grado + "</td>" +
                    "<td>" + '$' + item.Pago+ "</td>" +
                    "<td>" + item.Fecha + "</td>" +
                    "<td>" +
                    "<a data-toggle='modal' data-target='#modalMisCS' onclick='getMisCurso(" +
                        JsonConvert.SerializeObject(dataCurso) + ',' + item.InscripcionID + ")' class='btn btn-success' >Edit</a>" +  
                    "</td>" +
                    "</tr>";
                count++;
            }
            Object[] dataObj = { dataFilter, paginador };
            data.Add(dataObj);
            return data;


        }

        internal List<Curso> getMisCursos(string query)
        {
            cursos = getCursos(query);
            cursos.ForEach(item => 
            {
                if (getAsignacion2(item.CursoId))
                {
                    misCursos.Add( new Curso
                    {
                        CursoId = item.CursoId,
                        Nombre = item.Nombre
                    });

                }
            });
            return misCursos;
        }

        private bool getAsignacion2(int id)
        {
            var asignacion = context.Asignacion.Where(c => c.CursoID == id).ToList();

            if (0 < asignacion.Count)
            {
                return true;
            }
            else
            {
                return false;     
            }
        }

        public List<Curso> getCursos(string curso)
        {
            return context.Curso.Where(c => c.Nombre.StartsWith(curso)).ToList();
        }

        public String getCurso(int id)
        {
            var curso = context.Curso.Where(c => c.CursoId == id).ToList();
            return curso[0].Nombre;
            
        }

        public string getEstudiante(int idEstudiante)
        {
            var estudiante = context.Estudiante.Where(e => e.Id == idEstudiante).ToList();

            return estudiante[0].Nombre;
        }

        public int getAsignacion(int id)
        {
            var asignacion = context.Asignacion.Where(a => a.CursoID == id).ToList();
            return asignacion[0].InstructorID;
        }

        public string getInstructor(int id)
        {
            var instructor = context.Instructor.Where(a => a.Id == id).ToList();
            return instructor[0].Nombre;
        }

    }
}
