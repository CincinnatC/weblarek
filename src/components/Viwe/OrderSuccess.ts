import { Component } from "../base/Component"
import { ensureElement } from "../../utils/utils"
import { IEvents } from "../base/Events"

interface OrderSuccessData {
  sum: number;
}

export class OrderSuccess extends Component<OrderSuccessData> {
  protected textOrderSuccess: HTMLHeadingElement;
  protected sumOrderSuccess: HTMLParagraphElement;
  protected buttonOrderSuccess: HTMLButtonElement;

  constructor(protected events: IEvents, container: HTMLElement) {
    super(container)

    this.textOrderSuccess = ensureElement<HTMLHeadingElement>(".order-success__title", this.container);
    this.sumOrderSuccess = ensureElement<HTMLParagraphElement>(".order-success__description", this.container);
    this.buttonOrderSuccess = ensureElement<HTMLButtonElement>(".button", this.container);

    this.buttonOrderSuccess.addEventListener("click", () => {
      this.events.emit("success:close");
    })
  }

  set sum(value: number) {
    this.sumOrderSuccess.textContent = `Списано ${value} синапсов`
  }
}