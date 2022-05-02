import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  private validationMessages = {
    first_name: [
      { type: 'required', message: 'El nombre es obligatorio' },
      { type: 'minlength', message: 'El nombre debe de tener más de dos caracteres' }
    ],

    last_name: [
      { type: 'required', message: 'El apellido es obligatorio' },
      { type: 'minlength', message: 'El apellido debe de tener más de dos caracteres' }
    ],

    name: [
      { type: 'required', message: 'El nombre completo es obligatorio' },
      { type: 'minlength', message: 'El nombre completo debe de tener más de dos caracteres' }
    ],

    username: [
      { type: 'required', message: 'El nombre de usuario es obligatorio' },
      { type: 'minlength', message: 'El nombre de usuario debe de ser de 3 o más caracteres' }
    ],

    email: [
      { type: 'required', message: 'El email es obligatorio' },
      { type: 'pattern', message: 'El formato del email es inválido' }
    ],

    phone: [
      { type: 'required', message: 'El número de teléfono es obligatorio' },
      { type: 'minlength', message: 'El número de teléfono debe contener 5 o más caracteres' }
    ],

    identification: [
      { type: 'required', message: 'El número de identificación es obligatorio' },
      { type: 'minlength', message: 'El número de identificación debe de ser de 7 o más caracteres' }
    ],

    state: [
      { type: 'required', message: 'El estado es obligatorio' },
      { type: 'minlength', message: 'El estado debe de ser de 3 o más caracteres' }
    ],

    city: [
      { type: 'required', message: 'La ciudad es obligatoria' },
      { type: 'minlength', message: 'El nombre de la ciudad debe de ser de 3 o más caracteres' }
    ],

    address: [
      { type: 'required', message: 'La dirección es obligatoria' },
      { type: 'minlength', message: 'La dirección debe de contener al menos 5 caracteres' }
    ],

    country: [
      { type: 'required', message: 'El país es obligatorio' },
      { type: 'minlength', message: 'El nombre del país debe de contener 3 o más caracteres' }
    ],

    zip: [
      { type: 'required', message: 'El código postal es obligatorio' },
      { type: 'minlength', message: 'El código postal debe de contener 3 o más caracteres' }
    ],

    licence_number: [
      { type: 'required', message: 'El número de licencia es obligatorio' }, //No se a que tipo de licencia hace referencia
      { type: 'minlength', message: 'El número de licencia debe contener 6 o más caracteres' }
    ],

    routing_number: [
      { type: 'required', message: 'El número de ruta es requerido' }, //The routing number is required
      { type: 'minlength', message: 'El número de ruta debe contener 9 o más caracteres' } //The routing number must be 9 or more characters
    ],

    account_number: [
      { type: 'required', message: 'El número de cuenta es obligatorio' },
      { type: 'minlength', message: 'El número de cuenta debe de contener 5 o más caracteres' }
    ],

    current_password: [
      { type: 'required', message: 'Se debe ingresar la contraseña actual' },
      { type: 'minlength', message: 'La contraseña actual debe de contener 8 o más caracteres' }
    ],

    password: [
      { type: 'required', message: 'Se debe de ingresar la contraseña' },
      { type: 'minlength', message: 'La contraseña debe de contener 8 o más caracteres' }
    ],

    password_confirmation: [
      { type: 'required', message: 'La contraseña de confirmación es necesaria' },
      { type: 'minlength', message: 'La contraseña de confirmación debe de contener 8 o más caracteres' }
    ],

    opinion: [
      { type: 'required', message: 'La opinión es obligatoria' },
      { type: 'minlength', message: 'La opinión debe de contener al menos 3 caracteres' },
      { type: 'maxlength', message: 'La opinión debe de tener entre 3 o 20 caracteres' }
    ],

    experience: [
      { type: 'required', message: 'La reseña es obligatoria' },
      { type: 'minlength', message: 'La reseña debe de contener al menos 20 caracteres' },
      { type: 'maxlength', message: 'La reseña debe de tener entre 20 y 300 caracteres' }
    ],

    role: [
      { type: 'required', message: 'Se debe de seleccionar un rol' },
    ],

    title: [
      { type: 'required', message: 'El título es obligatorio' },
      { type: 'minlength', message: 'El título debe de contener al menos 8 caracteres' },
      { type: 'maxlength', message: 'El título debe de tener entre 8 y 100 caracteres' }
    ],
    title_link: [
      { type: 'required', message: 'El título es obligatorio' },
    ],
    link: [
      { type: 'required', message: 'El link es obligatorio' },
    ],

    description: [
      { type: 'required', message: 'La descripción es obligatoria' },
      { type: 'minlength', message: 'La descripción debe de contener al menos 8 caracteres' },
      { type: 'maxlength', message: 'La descripción debe de tener entre 8 y 2000 caracteres' }
    ],

    price: [
      { type: 'required', message: 'El precio es obligatorio' },
      { type: 'minlength', message: 'El precio debe de contener al menos 1 carácter' },
      { type: 'pattern', message: 'Formato de precio incorrecto' }
    ],

    course: [
      { type: 'required', message: 'El curso es obligatorio' }
    ],

    question: [
      { type: 'required', message: 'La pregunta es obligatoria' },
      { type: 'minlength', message: 'La pregunta debe de contener al menos 10 carácter' },
      { type: 'maxlength', message: 'La pregunta debe de tener entre 10 y 100 caracteres ' },
    ],

    optionOne: [
      { type: 'required', message: 'La pregunta número uno es obligatoria' },
      { type: 'minlength', message: 'La pregunta número uno debe de contener al menos 2 caracteres' },
    ],

    optionTwo: [
      { type: 'required', message: 'La pregunta número dos es obligatoria' },
      { type: 'minlength', message: 'La pregunta número dos debe de contener al menos 2 caracteres' },
    ],

  };

  constructor() { }

  getValidationMessages(): object {
    return this.validationMessages;
  }
}
