import { ensureElement } from "../../../utils/utils"
import { ensureAllElements } from "../../../utils/utils"
import { Form, FormData } from "./Form.ts"
import { IEvents } from "../../base/Events"
import { TPayment } from "../../../types/index.ts"

interface OrderFormData extends FormData {
  payment: TPayment | null;
  address: string;
}

export class OrderForm extends Form<OrderFormData> {
  paymentButtons: HTMLButtonElement[];
  addressInput: HTMLInputElement;
  constructor(protected events: IEvents, container: HTMLElement) {
    super(events, container)
    this.paymentButtons = ensureAllElements<HTMLButtonElement>(".button_alt", this.container);
    this.addressInput = ensureElement<HTMLInputElement>('[name="address"]', this.container);

    this.paymentButtons.forEach((button) => {
      button.addEventListener("click", () => {
        this.events.emit("payment:change", {payment: button.name as TPayment});
      });
    });
    this.addressInput.addEventListener("input", () => {
      this.events.emit("address:change", {address: this.addressInput.value});
    })
  }

  set payment(value: TPayment | null) {
    for (const button of this.paymentButtons)  {
      if (button.name === value) {
        button.classList.add("button_alt-active")
      } else {
        button.classList.remove("button_alt-active")
      }
    }
  }
  set address(value: string) {
    this.addressInput.value = value;
  }
}