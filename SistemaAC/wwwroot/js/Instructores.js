class Instructores {

    constructor() {
    }

    GuardarInstructor(especialidad, nombre, apellidos, fecha, documento, email, telefono,
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
                console.log(response);
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
                    }
                });
            }
        });
    }


}