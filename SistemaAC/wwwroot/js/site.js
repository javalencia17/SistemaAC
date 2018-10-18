
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
    document.getElementById("filtrar").focus();
    switch (URLactual.pathname) {
        case "/Categorias":
            filtrarDatos(1, "nombre");
            break;
        case "/Cursos":
            getCategorias(0, 0);
            filtrarCurso(1, "nombre");
            break;
    }
});
$('#modalCS').on('show.bs.modal', () => {
    $('#Nombre').focus();
})

var idCategoria, funcion = 0, idCurso;

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