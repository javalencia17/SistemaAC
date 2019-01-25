
$('#modalEditar').on('shown.bs.modal', function () {
    $('#myInput').focus()
});
$('#modalAC').on('shown.bs.modal', function () {
    $('#Nombre').focus()
});

function getUsuario(id, action)
{
    $.ajax({
        type: "POST",
        url: action,
        data: { id },
        success: function (response) {
            mostrarUsuario(response);
        }
    });
}

var items;
var j = 0;
//variables globales por cada propiedad del usuario
var id;
var username;
var email;
var phoneNumber;
var role;
var selectRole;
//Otras variables donde almacenaremos los datos del registro, pero estos datos no seran modificados
var accessFailedCount;
var concurrencyStamp;
var emailConfirmed;
var lockoutEnabled;
var lockoutEnd;
var normalizedUserName;
var normalizedEmail;
var passwordHash;
var phoneNumberConfirmed;
var securityStamp;
var twoFactorEnabled;

function mostrarUsuario(response)
{
    j = 0;
    items = response;
    for (var i = 0; i < 3; i++) {
        var x = document.getElementById('Select');
        x.remove(i);
    }

    $.each(items, function (index, val) {
        $('#id').val(val.id);
        $('#UserName').val(val.userName);
        $('#Email').val(val.email);
        $('#PhoneNumber').val(val.phoneNumber);
        document.getElementById('Select').options[0] = new Option(val.role, val.roleId);

        //mostrar detalles de usuario
        $('#dEmail').text(val.email);
        $('#dUserName').text(val.userName);
        $('#dPhoneNumber').text(val.phoneNumber);
        $('#dRole').text(val.role);

        //mostrar eliminar Usuario
        $('#eUsuario').text(val.email);
        $('#eIdUsuario').val(val.id);


    });
}

function getRoles(action)
{
    $.ajax({
        type: 'POST',
        url: action,
        data: null,
        success: function (response) {
            if (j == 0) {
                for (var i = 0; i < response.length; i++) {
                    document.getElementById('Select').options[i] = new Option(response[i].text, response[i].value);
                    document.getElementById('SelectNuevo').options[i] = new Option(response[i].text, response[i].value);

                }
                j = 1;
            }
        }

    });
}

function editarUsuario(action)
{
    //get inputs of form
    id = $('#id').val();
    email = $('#Email').val();
    phoneNumber = $('#PhoneNumber').val();
    role = document.getElementById('Select');
    selectRole = role.options[role.selectedIndex].text;
    
    $.each(items, function (index, val) {
        userName = val.userName;
        accessFailedCount = val.accessFailedCount;
        concurrencyStamp = val.concurrencyStamp;
        emailConfirmed = val.emailConfirmed;
        lockoutEnabled = val.lockoutEnabled;
        lockoutEnd = val.lockoutEnd;
        normalizedUserName = val.normalizedUserName;
        normalizedEmail = val.normalizedEmail;
        passwordHash = val.passwordHash;
        phoneNumberConfirmed = val.phoneNumber;
        securityStamp = val.securityStamp;
        twoFactorEnabled = val.twoFactorEnabled;
    });

    $.ajax({
        type: "POST",
        url: action,
        data: {
            id, userName, email, phoneNumber, accessFailedCount,
            concurrencyStamp, emailConfirmed, lockoutEnabled, lockoutEnd,
            normalizedUserName, normalizedEmail, passwordHash, phoneNumberConfirmed,
            securityStamp, twoFactorEnabled, selectRole
        },
        success: function (response) {
            if (response == "Save") {
                window.location.href = "Usuarios";
            }
            else {
                alert("No se puede editar los datos del usuario");
            }
        }

    });

}

function ocultarDetalleUsuario()
{
    $('#modalDetalle').modal('hide');
}

function eliminarUsuario(action)
{
    var id = $('#eIdUsuario').val();
    $.ajax({
        type: 'POST',
        url: action,
        data: { id },
        success: function (response) {
            if (response === "Delete") {
                window.location.href = "Usuarios";
            }
            else {
                alert("No se puede eliminar el registro");
            }
        }

    });
}

function crearUsuario(action)
{

    //obtener los datos de los imputs
    email = $('#EmailNuevo').val();
    phoneNumber = $('#PhoneNumberNuevo').val();
    passwordHash = $('#PasswordHashNuevo').val();
    role = document.getElementById('SelectNuevo');
    selectRole = role.options[role.selectedIndex].text;

    // validar que los datos no esten vacios

    if (email == "") {
        $('#EmailNuevo').focus();
        alert("ingrese el email del usuario");
    }
    else {
        if (passwordHash == "") {
            $('#PasswordHashNuevo').focus();
            alert("ingrese la contraseña del usuario");
        }
        else {
            $.ajax({
                type: 'POST',
                url: action,
                data: { email, phoneNumber, passwordHash, selectRole },
                success: function (response) {
                    if (response == "Save") {
                        window.location.href = "Usuarios";
                    }
                    else {
                        $('#mensajeNuevo').html("No se puede guardar el usuario. <br> Seleccione un rol <br> Ingrese un email correcto <br> la contraseña debe tener de 6-100 caracteres, al menos un caracter especial , una letra mayuscula y un numero" );
                    }
                }
            });
        }
    }

   
}

$().ready(() => {
    var URLactual = window.location;
    //document.getElementById("filtrar").focus();
    switch (URLactual.pathname) {
        case "/Categorias":
            filtrarDatos(1, "nombre");
            break;
        case "/Cursos":
            getCategorias(0, 0);
            filtrarCurso(1, "nombre");
            break;
        case "/Estudiantes":
            filtrarEstudiantes(1, "nombre");
            break;
        case "/Instructores":
            getInstructores();
            break;
        case "/Inscripciones":
            filtrarEstudianteInscripcion();
            filtrarCursoInscripcion();
            mostrarCursos();
            break;
        case "/MisCursos":
            filtrarMisCursos(1);
            break;
    }
});
$('#modalCS').on('show.bs.modal', () => {
    $('#Nombre').focus();
})

$('#modalAS').on('show.bs.modal', () => {
    $('#Nombre').focus();
})

var idCategoria, funcion = 0, idCurso;
var idEstudiante = 0, idInstructor = 0;
var asignacionID = 0;

/**
    CODIGO DE CATEGORIAS
*/
var agregarCategoria = () => {
    var nombre = document.getElementById("Nombre").value;
    var descripcion = document.getElementById("Descripcion").value;
    var estados = document.getElementById("Estado");
    var estado = estados.options[estados.selectedIndex].value;
    if (funcion == 0) {
        var action = 'Categorias/guardarCategoria';
    } else {
        var action = 'Categorias/editarCategoria';
    }
    var categoria = new Categorias(nombre, descripcion, estado, action);
    categoria.agregarCategoria(idCategoria, funcion);
    funcion = 0;
}

var filtrarDatos = (numPagina,order) => {
    var valor = document.getElementById("filtrar").value;
    var action = 'Categorias/filtrarDatos';
    var categoria = new Categorias(valor, "", "", action);
    categoria.filtrarDatos(numPagina,order);

}

var editarEstado = (id, fun) => {
    idCategoria = id;
    funcion = fun;
    var action = 'Categorias/getCategorias';
    var categoria = new Categorias("", "", "", action);
    categoria.getCategorias(id, funcion);

}

var editarCategoria = () => {
    var action = 'Categorias/editarCategoria';
    var categoria = new Categorias("", "", "", action);
    categoria.editarCategoria(idCategoria, funcion);
    $('#modalEstado').modal('hide');
}

/**
    CODIGO DE CURSOS
*/

var getCategorias = (id, funcion) => {
    var action = 'Cursos/getCategorias';
    var cursos = new Cursos("", "", "", "","" , "", "", action);
    cursos.getCategorias(id, funcion); 
}

var agregarCurso = () => {
    if (funcion == 0) {
        var action = "Cursos/agregarCurso";
    } else {
        var action = "Cursos/editarCurso";
    }
    
    var nombre = document.getElementById('Nombre').value;
    var descripcion = document.getElementById('Descripcion').value;
    var creditos = document.getElementById('Creditos').value;
    var horas = document.getElementById('Horas').value;
    var costo = document.getElementById('Costo').value;
    var estado = document.getElementById('Estado').checked;
    //var categorias = document.getElementById('CategoriaCursos').value;
    //var categoria = categorias.options[categorias.selectedIndex].text;
    var categoria = $('#CategoriaCursos').val();
    var cursos = new Cursos(nombre, descripcion, creditos, horas, costo, estado, categoria, action);
    cursos.agregarCurso(idCurso, funcion);
    funcion = 0;

}

var filtrarCurso = (numPagina, order) => {
    var valor = document.getElementById('filtrar').value;
    var action = 'Cursos/filtrarCurso';
    var cursos = new Cursos(valor, "", "", "", "", "", "", action);
    cursos.filtrarCurso(numPagina, order);

}

var editarEstadoCurso = (id, fun) => {
    funcion = fun;
    idCurso = id;
    var action = 'Cursos/getCursos';
    var cursos = new Cursos("", "", "", "", "", "", "", action);
    cursos.getCursos(id, fun);
}

var editarEstadoCurso1 = () => {
    var action = 'Cursos/editarCurso';
    var cursos = new Cursos("", "", "", "", "", "", "", action);
    cursos.editarEstadoCurso(idCurso, funcion);
}

var restablecer = () => {
    var cursos = new Cursos("", "", "", "", "", "", "", "");
    cursos.restablecer();
}

var getInstructorCurso = (asignacion, curso, instructor, fun) => {
    $('#modalAsignacion').modal('show');
    idCurso = curso;
    asignacionID = asignacion;  
    var action = 'Cursos/getCursos';
    var cursos = new Cursos("", "", "", "", "", "", "", action);
    cursos.getCursos(curso, fun);
    var action = "Cursos/getInstructor";
    cursos.getInstructors(instructor, fun, action);
    

}

var instructorCurso = () => {
    var action = 'Cursos/instructorCurso';
    var instructors = document.getElementById("instructorsCursos")
    var instructor = instructors.options[instructors.selectedIndex].value;
    var fecha = document.getElementById("Fecha").value;
    var cursos = new Cursos("", "", "", "", "", "", "", "");
    cursos.instructorCurso(asignacionID, idCurso, instructor, fecha, action);
    asignacionID = 0;
    idCurso = 0;
}

/**
    CODIGO DE ESTUDIANTES
*/

var estudiante = new Estudiantes();
var guardarEstudiante = () => {
    var action = 'Estudiantes/guardarEstudiante';
    var codigo = document.getElementById('Codigo').value;
    var nombre = document.getElementById('Nombre').value;
    var apellidos = document.getElementById('Apellidos').value;
    var fecha = document.getElementById('FechaNacimiento').value;
    var documento = document.getElementById('Documento').value;
    var email = document.getElementById('Email').value;
    var telefono = document.getElementById('Telefono').value;
    var direccion = document.getElementById('Direccion').value;
    var estado = document.getElementById('Estado').checked;
    estudiante.guardarEstudiante(idEstudiante, funcion,action, codigo, nombre,apellidos,fecha,documento,email,telefono,
        direccion, estado);
    idEstudiante = 0;
}

var filtrarEstudiantes = (numPagina, order) => {
    var valor = document.getElementById("filtrar").value;
    var action = "Estudiantes/filtrarEstudiantes";
    estudiante.filtrarEstudiantes(numPagina, valor, order, action);

}

var editarEstudiante = (id, fun) => {
    funcion = fun;
    idEstudiante = id;
    var action = 'Estudiantes/getEstudiante';
    estudiante.getEstudiante(id,fun,action);

}

var deleteEstudiante = (id) =>{
    idEstudiante = id;
}

var deleteEstudiantes = () => {
    var action = 'Estudiantes/deleteEstudiante';
    estudiante.deleteEstudiantes(idEstudiante, action);
    idEstudiante = 0; 
}

var restablecerEstudiantes = () => {
    estudiante.restablecer();
}

/**
    CODIGO DE INSTRUCTORES
*/

var instructor = new Instructores();

var guardarInstructor = () => {
    var action = "Instructores/GuardarInstructor";
    var especialidad = document.getElementById("Especialidad").value;
    var nombre = document.getElementById('Nombre').value;
    var apellidos = document.getElementById('Apellidos').value;
    var fecha = document.getElementById('FechaNacimiento').value;
    var documento = document.getElementById('Documento').value;
    var email = document.getElementById('Email').value;
    var telefono = document.getElementById('Telefono').value;
    var direccion = document.getElementById('Direccion').value;
    var estado = document.getElementById('Estado').checked;
    instructor.guardarInstructor(especialidad, nombre, apellidos, fecha, documento, email, telefono,
        direccion, estado, action);
}
var getInstructores = () => { 
    instructor.getInstructores();
}

var editarInstructor = (id, fun) => {
    funcion = fun;
    idInstructor  = id;
    var action = 'Instructores/getInstructor';
    instructor.getInstructor(id, funcion, action);
}
var eliminarInstructor = (id) => {
    swal({
        title: "Esta seguro?",
        text: "Una vez Eliminado,No se podra recuperar los datos !",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    })
    .then((willDelete) => {
        if (willDelete) {
            var action = 'Instructores/deleteInstructor';
            instructor.deleteInstructor(id,action);
        } 
    });
}

var updateInstructor = () =>{
    var action = "Instructores/updateInstructor";
    var especialidad = document.getElementById("EspecialidadE").value;
    var nombre = document.getElementById('NombreE').value;
    var apellidos = document.getElementById('ApellidosE').value;
    var fecha = document.getElementById('FechaNacimientoE').value;
    var documento = document.getElementById('DocumentoE').value;
    var email = document.getElementById('EmailE').value;
    var telefono = document.getElementById('TelefonoE').value;
    var direccion = document.getElementById('DireccionE').value;
    var estado = document.getElementById('EstadoE').checked;
    var id = document.getElementById('idOculto').value;
    
    instructor.updateInstructor(especialidad, nombre, apellidos, fecha, documento, email, telefono,
        direccion, estado,id, action);
}

/**
    CODIGO DE INSCRIPCIONES 
*/


var inscripciones = new Inscripciones();

var filtrarEstudianteInscripcion = () => {
    var action = "Inscripciones/filtrarEstudiante";
    var valor = document.getElementById("filtrar").value;
    inscripciones.filtrarEstudiante(valor, action);
}

var getEstudiante = () => {
    var count = 0, id;
    var chk = document.getElementsByName('cboxEstudiante[]');
    for (var i = 0; i < chk.length; i++) {
        if (chk[i].checked) {
            id = chk[i].value;
            count++;
        }
    }
    if (count > 1) {
        document.getElementById("mensajeEstudiante").innerHTML = "Seleccione un estudiante";
    } else {
        var action = 'Inscripciones/getEstudiante';
        inscripciones.getEstudiante(id, action);
    }
}

var filtrarCursoInscripcion = () => {
    var action = "Inscripciones/filtrarCurso";
    var valor = document.getElementById("filtrarCurso").value;
    inscripciones.filtrarCurso(valor, action);
}

var getCurso = () => {
    var count = 0, id;
    var chk = document.getElementsByName('cboxCurso[]');
    for (var i = 0; i < chk.length; i++) {
        if (chk[i].checked) {
            id = chk[i].value;
            count++;
        }
    }
    if (count > 1) {
        document.getElementById("mensajeEstudiante").innerHTML = "Seleccione un curso";
    } else {
        var action = 'Inscripciones/getCurso';
        inscripciones.getCurso(id, action);
    }
}

var addCursos = () => {
    var estudiante = document.getElementById("Estudiante").value;
    var curso = document.getElementById("InscripcionCurso").value;
    var grado = document.getElementById("Grado").value;
    var costo = document.getElementById("Costo").value;
    inscripciones.addCursos(estudiante, curso, grado, costo);


}

var mostrarCursos = () => {
    inscripciones.mostrarCursos();
}

var deleteCurso = (id) => {
    inscripciones.deleteCurso(id);
}

var guardarCursos = () => {
    inscripciones.guardarCursos();
}

var restablecer = () => {
    inscripciones.deleteData();
}


/**
    CODIGO DE MIS CURSOS   
 */

var misCursos = new MisCursos();

var filtrarMisCursos = (pagina) => {
    var valor = document.getElementById("filtrar").value;
    misCursos.filtrarMisCursos(pagina, valor);
}

var getMisCurso = (curso, id) => {
    misCursos.getMisCurso(curso, id);
}

$('#Curso').typeahead({
    source: function (query, result) {
        getMisCursos(query, result); 
    }
});

var getMisCursos = (query, result) => {
    misCursos.getMisCursos(query, result);
}




