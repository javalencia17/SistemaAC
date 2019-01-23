
class MisCursos
{
    constructor() {

    }

    filtrarMisCursos(numPagina, valor) {
        if (valor == "") {
            valor = "null";
        }
        $.ajax({
            type: "POST",
            url: "MisCursos/filtrarMisCursos",
            data: { numPagina, valor},
            success: (response) => {
                //console.log(response);
                $("#resultMisCursos").html(response[0][0]);
            }
        });
    }

    getMisCursos(curso, id) {
        document.getElementById("Curso").value = curso[0];
        document.getElementById("Estudiante").value = curso[1];
        document.getElementById("Docente").value = curso[2];
        document.getElementById("Grado").value = curso[3];
        document.getElementById("Pago").value = curso[4];
        document.getElementById("Fecha").value = curso[5];






    }

}
