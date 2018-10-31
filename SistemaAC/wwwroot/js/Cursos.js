var promesa = new Promise((resolve, reject) => {

})
class Cursos {

    constructor(nombre, descripcion, creditos, horas, costo, estado, categoria, action) {
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.creditos = creditos;
        this.costo = costo;
        this.horas = horas;
        this.estado = estado;
        this.categoria = categoria;
        this.action = action;
    }

   
    getCategorias(id, funcion) {
        var action = this.action;
        var count = 1;
        $.ajax({
            type: "POST",
            url: action,
            data: {},
            success: (response) => {
                //console.log(action);
                document.getElementById("CategoriaCursos").options[0] = new Option("Seleccione un curso",0);
                if (0 < response.length) {
                    for (var i = 0; i < response.length; i++) {
                        if (0 == funcion) {
                            document.getElementById('CategoriaCursos').options[count] = new Option(response[i].nombre, response[i].categoriaId);
                            count++;
                        } else {
                            if (id == response[i].categoriaId) {
                                document.getElementById('CategoriaCursos').options[0] = new Option(response[i].nombre, response[0].categoriaId);
                                document.getElementById('CategoriaCursos').selectedIndex = 0;
                                break;
                            }
                        }
                       
                    }
                    
                }
            }
        });
    }

    agregarCurso(id, funcion) {
        if (this.nombre == "") {
            document.getElementById('Nombre').focus();
        } else {
            if (this.descripcion == "") {
                document.getElementById('Descripcion').focus();
            } else {
                if (this.creditos == "") {
                    document.getElementById('Creditos').focus();
                } else {
                    if (this.horas == "") {
                        document.getElementById('Horas').focus();
                    } else {
                        if (this.costo == "") {
                            document.getElementById('Costo').focus();
                        } else {
                            if (this.categoria == 0) {
                                document.getElementById('mensaje').innerHTML = "Seleccione un curso";
                            } else {
                                var nombre = this.nombre;
                                var descripcion = this.descripcion;
                                var creditos = this.creditos;
                                var costo = this.costo;
                                var horas = this.horas;
                                var estado = this.estado;
                                var categoria = this.categoria;
                                var action = this.action;

                                //console.log(nombre);

                                $.ajax({
                                    type: 'POST',
                                    url: action,
                                    data: {
                                        id ,nombre, descripcion, creditos, costo
                                        , horas, estado, categoria, funcion
                                    },
                                    success: (response) => {
                                        if ("Save" == response[0].code) {
                                            this.restablecer();
                                        } else {
                                            document.getElementById('mensaje').innerHTML = "No se puede guardar el curso";
                                        }
                                    }
                                });
                            }
                        }
                    }
                }
            }
        }
    }

    getCursos(id, fun) {
        var action = this.action;
        $.ajax({
            type: 'POST',
            url: action,
            data: { id },
            success: (response) => {
                //console.log(response);
                if (fun == 0) {
                    if (response[0].estado == true) {
                        document.getElementById('titleCurso').innerHTML = "Esta seguro de desactivar el curso"
                            + response[0].nombre;
                    } else {
                        document.getElementById('titleCurso').innerHTML = "Esta seguro de habilitar el curso"
                            + response[0].nombre;
                    }
                    promesa = Promise.resolve({
                        id: response[0].cursoId,
                        nombre: response[0].nombre,
                        descripcion: response[0].descripcion,
                        creditos: response[0].creditos,
                        horas: response[0].horas,
                        costo: response[0].costo,
                        estado: response[0].estado,
                        categoria: response[0].categoriaID
                    });

                } else {
                    document.getElementById("Nombre").value = response[0].nombre;
                    document.getElementById("Descripcion").value = response[0].descripcion;
                    document.getElementById("Creditos").value = response[0].creditos;
                    document.getElementById("Horas").value = response[0].horas;
                    document.getElementById("Costo").value = response[0].costo;
                    getCategorias(response[0].categoriaID, 1);
                    if (response[0].estado == true) {
                        document.getElementById("Estado").checked = true;
                    } else {
                        document.getElementById("Estado").checked = false;
                    }
                }
            }
        });
    }

    editarEstadoCurso(id, funcion) { 
        var  nombre, descripcion, creditos, horas, costo, estado, categoria;
        var action = this.action;
        promesa.then(data => {
            //id = data.id;
            nombre = data.nombre;
            descripcion = data.descripcion;
            creditos = data.creditos;
            horas = data.horas;
            costo = data.costo;
            estado = data.estado;
            categoria = data.categoria;
            $.ajax({
                type: 'POST',
                url: action,
                data: { id, nombre, descripcion, creditos, horas, costo, estado, categoria, funcion },
                success: (response) => {
                    console.log("hola");
                    if (response[0].code == "Save") {
                        this.restablecer();
                    } else {
                        document.getElementById("titleCurso").innerHTML = response[0].descripcion;
                    }
                }
            })
        });
     
    }



    restablecer() {
        document.getElementById('Nombre').value = "";
        document.getElementById('Descripcion').value = "";
        document.getElementById('Creditos').value = "";
        document.getElementById('Horas').value = "";
        document.getElementById('Costo').value = "";
        document.getElementById('Estado').checked = false;
        $('#CategoriaCursos').val(0);
        //document.getElementById('CategoriaCursos').selectedIndex = 0;
        //categorias.options[categorias.selectedIndex].value = "";
        document.getElementById('mensaje').innerHTML = "";
        filtrarCurso(1,"nombre");
        $('#modalCS').modal('hide');
        $('#modalEstadoCurso').modal('hide');

    }

    filtrarCurso(numPagina, order) {
        var valor = this.nombre;
        var action = this.action;
        if (valor == "") {
            valor = null;
        }
        $.ajax({
            type: 'POST',
            url: action,
            data: { valor, numPagina, order },
            success: (response) => {
                console.log(response);
                $.each(response, (index, val) => {
                    $('#resultSearch').html(val[0]);
                    $('#paginadoCurso').html(val[1]);
                });
               
            }
        });

    }

   

}
