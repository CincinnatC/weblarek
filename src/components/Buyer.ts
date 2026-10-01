import { TPayment } from "../types"

import { IBuyer } from "../types"

import { IBuyerErrors } from "../types"

export class Buyer {
  payment: TPayment = '';
  email: string = '';
  phone: string = '';
  address: string = '';

  setAddress(address: string): void {
    this.address = address;
  }
  
  setPhone(phone: string): void {
    this.phone = phone;
  }

  setEmail(email: string): void {
    this.email = email;
  }

  setPayment(payment: TPayment): void {
    this.payment = payment;
  }

  getBuyerData(): IBuyer {
    return {
      payment: this.payment,
      email: this.email,
      phone: this.phone,
      address: this.address,
    }
  }
  
  cleanBuyerData(): void {
    this.payment = '';
    this.email = '';
    this.phone = '';
    this.address = '';
  }

  validationBuyerData(): IBuyerErrors {
    const errors: IBuyerErrors = {};
    if (this.payment === '') {
      errors.payment = 'Не выбран способ оплаты';
    }
    if (this.email === '') {
      errors.email = 'Не указана электронная почта';
    }
    if (this.phone === '') {
      errors.phone = 'Не указан номер телефона';
    }
    if (this.address === '') {
      errors.address = 'Не указан адресс';
    }
    return errors;
  }
}

//я очень устал :(