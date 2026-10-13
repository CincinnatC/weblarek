import { ensureElement } from "../../../utils/utils"
import { ProductCard, ProductCardData } from "./ProductCard"
import { IEvents } from "../../base/Events"

interface CardBasketData extends ProductCardData {
  index: number
}

export class CardBasket extends ProductCard<CardBasketData> {
  private itemIndex: HTMLSpanElement;
  private itemIndexValue: number = 0;
  private deleteButton: HTMLButtonElement;

  constructor(protected events: IEvents, container: HTMLElement) {
    super(container)

    this.itemIndex = ensureElement<HTMLSpanElement>(".basket__item-index", this.container);
    this.deleteButton = ensureElement<HTMLButtonElement>(".card__button", this.container);

    this.deleteButton.addEventListener("click", () => {
      this.events.emit("basket:delete", {index: this.itemIndexValue});
    })
  }

  set index(value: number) {
    this.itemIndexValue = value;
    this.itemIndex.textContent = String(value);
  }
}