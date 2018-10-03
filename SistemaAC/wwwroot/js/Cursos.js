
class Cursos {

    constructor(nombre, descripcion, creditos, horas, estado, categoria, action) {
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.creditos = creditos;
        this.horas = horas;
        this.estado = estado;
        this.categoria = categoria;
        this.action = action
    }

   
    getCategorias() {
        var action = this.action;
        var count = 1;
        $.ajax({
            type: "POST",
            url: action,
            data: {},
            success: (response) => {
                console.log(response);
                if (0 < response.length) {
                    for (var i = 0; i < response.length; i++) {
                        document.getElementById('CategoriaCursos').options[count] = new Option(response[i].nombre, response[i].categoriaId);
                        cont++;
                    }
                }
            }
        });
    }




}
