import { Injectable } from '@angular/core';
import swal from "sweetalert2";

@Injectable({
  providedIn: 'root'
})
export class AlertsService {

  constructor() { }

  showSwal(type: number, title: string, text: string) {
    if (type === 1) {
      swal.fire({
        title: "Here's a message!",
        buttonsStyling: false,
        customClass: {
          confirmButton: "btn btn-success"
        }
      })
    } else if (type === 2) {
      swal.fire({
        title: "Here's a message!",
        text: "It's pretty, isn't it?",
        buttonsStyling: false,
        customClass: {
          confirmButton: "btn btn-info"
        }
      })
    } else if (type === 3) {
      swal.fire({
        title: "Good job!",
        text: "You clicked the button!",
        buttonsStyling: false,
        customClass: {
          confirmButton: "btn btn-success",
        },
        icon: "success"
      })
    } else if (type === 4) {
      swal
        .fire({
          title: "Estas seguro?",
          text: "¡No podrás revertir esto!",
          icon: "warning",
          showCancelButton: true,
          customClass: {
            cancelButton: "btn btn-danger",
            confirmButton: "btn btn-success mr-1",
          },
          confirmButtonText: "¡Sí, bórralo!",
          buttonsStyling: false
        })
        .then(result => {
          if (result.value) {
            swal.fire({
              title: "Deleted!",
              text: "Your file has been deleted.",
              icon: "success",
              customClass: {
                confirmButton: "btn btn-success",
              },
              buttonsStyling: false
            });
          }
        })
    } else if (type === 5) {
      swal
        .fire({
          title: "Estas seguro?",
          text: "¡No podrás revertir esto!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "¡Sí, bórralo!",
          cancelButtonText: "Cancelar",
          customClass: {
            confirmButton: "btn btn-success mr-1",
            cancelButton: "btn btn-danger",
          },
          buttonsStyling: false
        })
        .then(result => {
          if (result.value) {
            swal.fire({
              title: "Eliminado!",
              text: "La orden ha sido ejecutada",
              icon: "success",
              customClass: {
                confirmButton: "btn btn-success",
              },
              buttonsStyling: false
            })
          } else {
            swal.fire({
              title: "Cancelado",
              text: "No hemos eliminado nada :)",
              icon: "error",
              customClass: {
                confirmButton: "btn btn-info",
              },
              buttonsStyling: false
            });
          }
        });
    } else if (type === 6) {
      swal.fire({
        title: "HTML example",
        buttonsStyling: false,
        customClass: {
          confirmButton: "btn btn-success mr-1",
        },
        html:
          "You can use <b>bold text</b>, " +
          '<a href="https://github.com">links</a> ' +
          "and other HTML tags"
      });
    } else if (type === 7) {
      swal.fire({
        title: "Auto close alert!",
        text: "I will close in 2 seconds.",
        timer: 2000,
        showConfirmButton: false
      });
    } else if (type === 8) {
      swal
        .fire({
          title: "Input something",
          html:
            '<div class="form-group">' +
            '<input id="input-field" type="text" class="form-control" />' +
            "</div>",
          showCancelButton: true,
          customClass: {
            confirmButton: "btn btn-success mr-1",
            cancelButton: "btn btn-danger",
          },
          buttonsStyling: false
        })
        .then(function (result) {
          swal.fire({
            icon: "success",
            html:
              "You entered: <strong>" +
              (document.getElementById("input-field") as HTMLInputElement)
                .value +
              "</strong>",
            customClass: {
              confirmButton: "btn btn-success",
            },
            buttonsStyling: false
          });
        });
    }
  }

}
