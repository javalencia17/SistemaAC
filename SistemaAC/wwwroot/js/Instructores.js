class Instructores {
    

    constructor() {
    }

    guardarInstructor(especialidad, nombre, apellidos, fecha, documento, email, telefono,
        direccion, estado, action) {

        //validar datos
        if (especialidad == "") {
            document.getElementById("Especialidad").focus();
        }else {
            if (nombre == "") {
                document.getElementById("Nombre").focus();
            } else {
                if (apellidos == "") {
                    document.getElementById("Nombre").focus();
                } else {
                    if (fecha == "") {
                        document.getElementById("FechaNaciento").focus();
                    } else {
                        if (documento == "") {
                            document.getElementById("Documento").focus();
                        } else {
                            if (email == "") {
                                document.getElementById("Email").focus();
                            } else {
                                if (telefono == "") {
                                    document.getElementById("Telefono").focus();
                                } else {
                                    if (direccion == "") {
                                        document.getElementById("Direccion").focus();
                                    }
                                }
                            }
                        }
                    }
                }

            }
                        
        }

        var parametros = new Array({
            especialidad: especialidad, nombre: nombre, apellidos: apellidos, fecha: fecha,
            documento: documento, email: email, telefono: telefono,direccion: direccion, estado: estado
        });

        $.ajax({
            type: "POST",
            url: action,
            data: {
                parametros
            },
            success: (response) => {
                $('#modalIS').modal('hide');
                getInstructores();
                $("#confirmacion").html('<div id="confirmacion" class="alert alert-success alert-dismissible" role="alert"><strong>Buen trabajo!</strong> Creado correctamente.</div>');
                $('#confirmacion').hide(7000);
            }
        });
        
    }

    

    getInstructores()
    {
        $.ajax({
            type: "GET",
            url: 'Instructores/GetInstructores',
            data: null,
            success: (response) => {
                $("#resultTable").html(response[0][0]);
                $('#tableInstructores').DataTable({
                    "language": {
                        "lengthMenu": "Mostar _MENU_ registros por pagina",
                        "zeroRecords": "Lo sentimos - nada encontrado",
                        "info": "Mostrando pagina _PAGE_ de _PAGES_",
                        "infoEmpty": "No hay registros disponibles",
                        "infoFiltered": "(filtrado de _MAX_ registros totales)",
                        "search": "Buscar:"
                      
                    },
                    "paginate": {
                        "first": "Primero",
                        "last": "Ultimo",
                        "next": "Siguiente",
                        "previous": "Anterior"
                    },
                });
            }
        });
    }

    getInstructor(id, funcion, action) {

        $.ajax({
            type: 'POST',
            url: action,
            data: { id },
            success: (response) => {
                if (funcion == 1) {
                    $('#modalISE').modal('show');
                    document.getElementById("EspecialidadE").value = response[0].especialidad;
                    document.getElementById("NombreE").value = response[0].nombre;
                    document.getElementById("ApellidosE").value = response[0].apellidos;
                    document.getElementById("FechaNacimientoE").value = response[0].fechaNacimiento;
                    document.getElementById("DocumentoE").value = response[0].documento;
                    document.getElementById("EmailE").value = response[0].email;
                    document.getElementById("TelefonoE").value = response[0].telefono;
                    document.getElementById("DireccionE").value = response[0].direccion;
                    document.getElementById("EstadoE").checked = response[0].estado;
                    document.getElementById("idOculto").value = response[0].id;

                } else {
                    this.editarInstructor(funcion, response);
                }
            }
        });

    }

   

    editarInstructor(funcion, response) {
        var action = "Instructores/editarInstructor"; 
        var parametros = new Array({
            especialidad: response[0].especialidad, nombre: response[0].nombre, apellidos: response[0].apellidos, fecha: response[0].fecha,
            documento: response[0].documento, email: response[0].email, telefono: response[0].telefono, direccion: response[0].direccion,
            estado: response[0].estado, id: response[0].id
        });
        
        $.ajax({
            type: 'POST',
            url: action,
            data: { parametros, funcion },
            success: (response) => {
                if ("Save" == response[0].code) {
                    $("#tableInstructores").dataTable().fnDestroy();
                    this.getInstructores();
                } else {
                    console.log("Error: " + response);
                }  
            }
        });
    }

    deleteInstructor(id, action) {
        $.ajax({
            type: 'POST',
            url: action,
            data: { id },
            success: (response) => {
                if (1 == response[0].code) {
                    $("#tableInstructores").dataTable().fnDestroy();
                    this.getInstructores();
                } else {
                    console.log("Error: " + response);
                }
            }
        });
    }

    updateInstructor(especialidad, nombre, apellidos, fecha, documento, email, telefono,
        direccion, estado, id, action) {

        //validar datos
        if (especialidad == "") {
            document.getElementById("Especialidad").focus();
        } else {
            if (nombre == "") {
                document.getElementById("Nombre").focus();
            } else {
                if (apellidos == "") {
                    document.getElementById("Nombre").focus();
                } else {
                    if (fecha == "") {
                        document.getElementById("FechaNaciento").focus();
                    } else {
                        if (documento == "") {
                            document.getElementById("Documento").focus();
                        } else {
                            if (email == "") {
                                document.getElementById("Email").focus();
                            } else {
                                if (telefono == "") {
                                    document.getElementById("Telefono").focus();
                                } else {
                                    if (direccion == "") {
                                        document.getElementById("Direccion").focus();
                                    }
                                }
                            }
                        }
                    }
                }

            }
        }

        var parametros = new Array({
            especialidad: especialidad, nombre: nombre, apellidos: apellidos, fecha: fecha,
            documento: documento, email: email, telefono: telefono, direccion: direccion, estado: estado, id: id
        });

        //console.log(parametros); return;

        $.ajax({
            type: "POST",
            url: action,
            data: {
                parametros
            },
            success: (response) => {
                $('#modalISE').modal('hide');
                $("#tableInstructores").dataTable().fnDestroy();
                this.getInstructores();
                $("#confirmacion").html('<div id="confirmacion" class="alert alert-success alert-dismissible" role="alert"><strong>Buen trabajo!</strong> Modificado correctamente.</div>');
                $('#confirmacion').hide(7000);
            }
        });

    }


}