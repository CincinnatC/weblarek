import { TPayment } from "../types"

import { IBuyer } from "../types"

import { IBuyerErrors } from "../types"

export class Buyer {
  private payment: TPayment | null = null;
  private email: string = '';
  private phone: string = '';
  private address: string = '';

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
  
  clearBuyerData(): void {
    this.payment = null;
    this.email = '';
    this.phone = '';
    this.address = '';
  }

  validateBuyerData(): IBuyerErrors {
    const errors: IBuyerErrors = {};
    if (this.payment === null) {
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