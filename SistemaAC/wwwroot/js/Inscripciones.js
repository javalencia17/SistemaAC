var localStorage = window.localStorage;
var idEstudiante, idCurso, idCategoria;
var list = new Array();
var fecha = new Date();

class Inscripciones {

    constructor() {

    }

    filtrarEstudiante(valor, action) {
        valor = (valor == "") ? "null" : valor;
        $.ajax({
            type: "POST",
            url: action,
            data: { valor },
            success: (response) => {
                $('#resultSearchEstudiante').html(response);
            }
        });
    }

    getEstudiante(id, action) {
        $.ajax({
            type: "POST",
            url: action,
            data: { id },
            success: (response) => {
                if (response.length > 0) {
                    document.getElementById("Estudiante").value = response[0].apellidos + " " + response[0].nombre;
                    idEstudiante = response[0].id;
                }
                this.restablecer();
               
            }
        });

    }

    filtrarCurso(valor, action) {
        valor = (valor == "") ? "null" : valor;
        $.ajax({
            type: "POST",
            url: action,
            data: { valor },
            success: (response) => {
                $('#resultSearchCurso').html(response);
            }
        });
    }

    getCurso(id, action) {
        $.ajax({
            type: "POST",
            url: action,
            data: { id },
            success: (response) => {
                if (response.length > 0) {
                    document.getElementById("InscripcionCurso").value = response[0].nombre;
                    document.getElementById("Costo").value = response[0].costo;
                    idCurso = response[0].cursoId;
                    idCategoria = response[0].categoriaID;
                }        
                this.restablecer();
            }
        });
    }

    addCursos(estudiante, curso, grado, costo) {

        if (estudiante == "") {
            document.getElementById("Estudiante").focus(); return;
        } else {
            if (curso == "") {
                document.getElementById("InscripcionCurso").focus(); return;
            } else {
                if (grado == "") {
                    document.getElementById("Grado").focus(); return;
                } else {
                    if (costo == "") {
                        document.getElementById("Costo").focus(); return;
                    } else {
                        var listCurso = new Array({
                            idEstudiante: idEstudiante,
                            estudiante: estudiante,
                            idCurso: idCurso,
                            curso: curso,
                            idCategoria: idCategoria,
                            grado: grado,
                            costo: costo,
                            fecha: fecha
                        });
                        var cursos = JSON.parse(localStorage.getItem("cursos"));
                        if (null != cursos) {
                            if (0 < cursos.length) {
                                for (var i = 0; i <= cursos.length; i++) {
                                    if (i == cursos.length) {
                                        
                                        list.push(listCurso);
                                    } else {
                                        if (idCurso != cursos[i][0].idCurso) {
                                            var listCursos = new Array({
                                                idEstudiante: cursos[i][0].idEstudiante,
                                                estudiante: cursos[i][0].estudiante,
                                                idCurso: cursos[i][0].idCurso,
                                                curso: cursos[i][0].curso,
                                                idCategoria: cursos[i][0].idCategoria,
                                                grado: cursos[i][0].grado,
                                                costo: cursos[i][0].costo,
                                                fecha: cursos[i][0].fecha
                                            });
                                            list.splice(i, 1, listCursos);
                                            //list.push(listCurso);
                                        } else {
                                            alert("Este curso ya esta en la lista");
                                            break;
                                        }
                                    }
                                }
                            } else {
                                
                                list.push(listCurso);
                            }
                        } else {
                                
                            list.push(listCurso);
                        }
                        console.log(list);
                        localStorage.setItem("cursos", JSON.stringify(list));
                        this.mostrarCursos();
                    }
                }
            }
        }

    }

    mostrarCursos() {
        var dataFilter;
        var pago = 0;
        var cursos = JSON.parse(localStorage.getItem("cursos"));
        if (null != cursos) {
            if (0 < cursos.length) {
                for (var i = 0; i < cursos.length; i++) {
                    dataFilter += "<tr>" +
                        "<td>" + cursos[i][0].curso + "</td>" +
                        "<td>" + cursos[i][0].idCategoria+ "</td>" +
                        "<td>" + cursos[i][0].grado + "</td>" +
                        "<td>" + cursos[i][0].costo + "</td>" +
                        "<td>" + cursos[i][0].fecha + "</td>" +
                        "<td>" +
                        "<a  onclick='deleteCurso(" + i + ")' class='btn btn-success'>Eliminar</a>";
                        "</td>" +
                        "</tr>";  
                    pago += parseFloat(cursos[i][0].costo);

                }
            }
        }
        document.getElementById("pagosCursos").innerHTML = "$" + pago;
        $("#resultCursos").html(dataFilter);
    }


    guardarCursos() {
        let listCursos = new Array();
        var cursos = JSON.parse(localStorage.getItem("cursos"));
        if (cursos != null) {
            if (cursos.length > 0) {
                for (var i = 0; i < cursos.length; i++) {
                    listCursos.push({
                        grado: cursos[i][0].grado,
                        cursoID: cursos[i][0].idCurso,
                        estudianteID: cursos[i][0].idEstudiante,
                        fecha: cursos[i][0].fecha,
                        pago: cursos[i][0].costo
                    });
                }
            }
        }
        let ruta = 'Inscripciones/guardarCursos';
        $.ajax({
            type: 'POST',
            url: ruta,
            data: { listCursos },
            success: (response) => {
                if (response[0].code === "Save") {
                    this.deleteData();
                }
                console.log(response);
            }
        });
    }

    deleteData() {
        localStorage.removeItem("cursos");
        document.getElementById("resultCursos").value = "";
        this.restablecer();
    }

    deleteCurso(id) {
       
        let cursos = JSON.parse(localStorage.getItem("cursos"));
        if (null != cursos) {
            if (0 < cursos.length) {
                for (var i = 0; i < cursos.length; i++) {
                    if (i == id) {
                        cursos.splice(i, 1);
                        if (i == cursos.length) {
                            $("#resultCursos").html("");
                        }else {
                            break;
                        }
                    }
                }
                localStorage.setItem("cursos", JSON.stringify(cursos));
            }
        }
        this.mostrarCursos();
    }

    

    restablecer() {
        $("#modalEstudiante").modal("hide");
        document.getElementById("filtrar").value = "";
        $("#modalCurso").modal("hide");
        document.getElementById("filtrarCurso").value = "";
        
    }


}