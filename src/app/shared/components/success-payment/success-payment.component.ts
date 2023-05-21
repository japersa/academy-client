import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';
import { UserDataService } from 'src/app/core/services/user-data.service';

@Component({
  selector: 'app-success-payment',
  template: `
  <div class="modal-header">
    <h4 class="modal-title pull-left">{{title}}</h4>
    <button type="button" class="btn-close close pull-right" aria-label="Close" (click)="bsModalRef.hide()">
      <span aria-hidden="true" class="visually-hidden">&times;</span>
    </button>
  </div>
  <div class="modal-body">
  <p>
  Estimado/a {{ userDataService.userData$.value.first_name }}, <br>  <br>
  Nos complace informarte que hemos recibido tu pago correctamente por el servicio de autogestion de fondos que has adquirido.<br><br>
  Detalle de la orden: <br>
  Número de orden: 5798738 <br>
  Servicio: ICEX AG <br>
  Monto: 200 USDT <br>
  Método de pago: Tarjeta de crédito  <br> <br>
  Agradecemos tu compra y esperamos que disfrutes de tu servicio. Si tienes alguna pregunta, no dudes en contactarnos. <br>
  Saludos cordiales, <br>
  Equipo ICEX
  </p>
  </div>
  <div class="modal-footer">
    <button type="button" routerLink="/funding-program/home" (click)="bsModalRef.hide()" class="btn btn-default">Ir a autogestión</button>
  </div>
` ,
  styleUrls: ['./success-payment.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SuccessPaymentComponent {
  title?: string;

  constructor(public bsModalRef: BsModalRef,
    public userDataService: UserDataService) { }
}
