import { TPayment } from "../../types"
import { IBuyer } from "../../types"
import { IBuyerErrors } from "../../types"
import { IEvents } from "../base/Events"

export class Buyer {
  private payment: TPayment | null = null;
  private email: string = '';
  private phone: string = '';
  private address: string = '';

  constructor(protected events: IEvents) {}

  setAddress(address: string): void {
    this.address = address;
    this.events.emit("buyer:changed");
  }
  
  setPhone(phone: string): void {
    this.phone = phone;
    this.events.emit("buyer:changed");
  }

  setEmail(email: string): void {
    this.email = email;
    this.events.emit("buyer:changed");
  }

  setPayment(payment: TPayment): void {
    this.payment = payment;
    this.events.emit("buyer:changed");
  }

  getBuyerData(): IBuyer {
    return {
      payment: this.payment,
      email: this.email,
      phone: this.phone,
      address: this.address,
    }
  }
  
  clearBuyerData(): void {
    this.payment = null;
    this.email = '';
    this.phone = '';
    this.address = '';
    this.events.emit("buyer:changed");
  }

  validateBuyerData(): IBuyerErrors {
    const errors: IBuyerErrors = {};
    if (this.payment === null) {
      errors.payment = 'Необходимо выбрать способ оплаты';
    }
    if (this.email === '') {
      errors.email = 'Необходимо указать электронную почту';
    }
    if (this.phone === '') {
      errors.phone = 'Необходимо указать номер телефона';
    }
    if (this.address === '') {
      errors.address = 'Необходимо указать адрес';
    }
    return errors;
  }
}