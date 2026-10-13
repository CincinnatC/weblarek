import { Component } from "../base/Component"
import { ensureElement } from "../../utils/utils"
import { IEvents } from "../base/Events"

interface BasketData {
  price: number;
  items: HTMLElement[];
  valid: boolean;
}

export class Basket extends Component<BasketData> {
  protected basketButton: HTMLButtonElement;
  protected basketPrice: HTMLSpanElement;
  protected basketList: HTMLUListElement;

  constructor(protected events: IEvents, container: HTMLElement) {
    super(container);

    this.basketButton = ensureElement<HTMLButtonElement>(".basket__button", this.container);
    this.basketPrice = ensureElement<HTMLSpanElement>(".basket__price", this.container);
    this.basketList = ensureElement<HTMLUListElement>(".basket__list", this.container);

    this.basketButton.addEventListener("click", () => {
      this.events.emit("basket:order");
    });
  }

  set price(value: number) {
    this.basketPrice.textContent = `${value} синапсов`;
  }
  set items(cards: HTMLElement[]) {
    this.basketList.replaceChildren(...cards);
  }
  set valid(value: boolean) {
    this.basketButton.disabled = !value;
  }
}