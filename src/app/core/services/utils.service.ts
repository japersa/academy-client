import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  private validationMessages = {
    first_name: [
      { type: 'required', message: 'The first name is required' },
      { type: 'minlength', message: 'The first name must be more than 2 characters' }
    ],

    last_name: [
      { type: 'required', message: 'The last name is required' },
      { type: 'minlength', message: 'The last name must be more than 2 characters' }
    ],

    name: [
      { type: 'required', message: 'The full name is required' },
      { type: 'minlength', message: 'The full name must be more than 2 characters' }
    ],

    username: [
      { type: 'required', message: 'The username is required' },
      { type: 'minlength', message: 'The username be 3 or more characters' }
    ],

    email: [
      { type: 'required', message: 'The email is required' },
      { type: 'pattern', message: 'The email format is invalid' }
    ],

    phone: [
      { type: 'required', message: 'The phone is required' },
      { type: 'minlength', message: 'The phone number must be 5 or more characters' }
    ],

    identification: [
      { type: 'required', message: 'The identification is required' },
      { type: 'minlength', message: 'The identification number must be 7 or more characters' }
    ],

    state: [
      { type: 'required', message: 'The state is required' },
      { type: 'minlength', message: 'The state must be 3 or more characters' }
    ],

    city: [
      { type: 'required', message: 'The city is required' },
      { type: 'minlength', message: 'The city name must be 3 or more characters' }
    ],

    address: [
      { type: 'required', message: 'The adress is required' },
      { type: 'minlength', message: 'The adress number must be 5 or more characters' }
    ],

    country: [
      { type: 'required', message: 'The country is required' },
      { type: 'minlength', message: 'The country must be 3 or more characters' }
    ],

    zip: [
      { type: 'required', message: 'The zip code is required' },
      { type: 'minlength', message: 'The zip code must be 3 or more characters' }
    ],

    licence_number: [
      { type: 'required', message: 'The licence number is required' },
      { type: 'minlength', message: 'The licence number must be 6 or more characters' }
    ],

    routing_number: [
      { type: 'required', message: 'The routing number is required' },
      { type: 'minlength', message: 'The routing number must be 9 or more characters' }
    ],

    account_number: [
      { type: 'required', message: 'The account number is required' },
      { type: 'minlength', message: 'The account number must be 5 or more characters' }
    ],

    current_password: [
      { type: 'required', message: 'The current password password is required' },
      { type: 'minlength', message: 'The current password password must be 8 or more characters' }
    ],

    password: [
      { type: 'required', message: 'The password is required' },
      { type: 'minlength', message: 'The password must be 8 or more characters' }
    ],

    password_confirmation: [
      { type: 'required', message: 'The confirm password is required' },
      { type: 'minlength', message: 'The confirm password must be 8 or more characters' }
    ],

    opinion: [
      { type: 'required', message: 'The opinion is required' },
      { type: 'minlength', message: 'The review must be at least 3 characters' },
      { type: 'maxlength', message: 'The opinion must be 3 or 20 characters' }
    ],

    experience: [
      { type: 'required', message: 'The opinion is required' },
      { type: 'minlength', message: 'The review must be at least 20 characters' },
      { type: 'maxlength', message: 'The opinion must be 20 or 300 characters' }
    ],
    role: [
      { type: 'required', message: 'The role is required' },
    ],

  };

  constructor() { }

  getValidationMessages(): object {
    return this.validationMessages;
  }
}
