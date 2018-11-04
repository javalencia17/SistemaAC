
class Estudiantes {

    constructor() {

    }

    guardarEstudiante(id, funcion,...data) {
        var action = data[0], codigo = data[1], nombre = data[2], apellidos = data[3];
        var fecha = data[4], documento = data[5], email = data[6], telefono = data[7];
        var direccion = data[8], estado = data[9];

        //validaciones 

        if (codigo == "") {
            document.getElementById('Codigo').focus();
        } else {
            if (nombre == "") {
                document.getElementById('Nombre').focus();
            } else {
                if (apellidos == "") {
                    document.getElementById('Apellidos').focus();
                } else {
                    if (fecha == "") {
                        document.getElementById('FechaNacimiento').focus();
                    } else {
                        if (documento == "") {
                            document.getElementById('Documento').focus();
                        } else {
                            if (email == "") {
                                document.getElementById('Email').focus();
                            } else {
                                if (telefono == "") {
                                    document.getElementById('Telefono').focus();
                                } else {
                                    if (direccion == "") {
                                        document.getElementById('Direccion').focus();
                                    } else {
                                        $.post(
                                            action,
                                            {id, codigo, nombre, apellidos, fecha, documento, email, telefono,
                                                direccion, estado, funcion},
                                            (response) => {

                                            }
                                        );
                                    } 
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    filtrarEstudiantes(numPagina, valor, order, action) {
        valor = (valor == "") ? "null" : valor;
        $.post(
            action,
            { numPagina, valor, order },
            (response) => {
                $("#resultSearch").html(response[0]);
                $("#paginado").html(response[1]);
            },
        );
    }

}