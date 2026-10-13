import { ensureElement } from "../../../utils/utils"
import { Form, FormData } from "./Form.ts"
import { IEvents } from "../../base/Events"

interface ContactsFormData extends FormData {
  email: string
  phone: string
}

export class ContactsForm extends Form<ContactsFormData> {
  private emailInput: HTMLInputElement;
  private phoneInput: HTMLInputElement;
  
  constructor(protected events: IEvents, container: HTMLElement) {
    super(events, container)

    this.emailInput = ensureElement<HTMLInputElement>('[name="email"]', this.container);
    this.phoneInput = ensureElement<HTMLInputElement>('[name="phone"]', this.container);

    this.emailInput.addEventListener("input", () => {
      this.events.emit("email:change", {email: this.emailInput.value});
    })
    this.phoneInput.addEventListener("input", () => {
      this.events.emit("phone:change", {phone: this.phoneInput.value});
    })
  }

  set email(value: string) {
    this.emailInput.value = value;
  }
  set phone(value: string) {
    this.phoneInput.value = value;
  }
}