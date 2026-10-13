import { Component } from "../../base/Component"
import { ensureElement } from "../../../utils/utils"

export interface ProductCardData {
  id: string;
  title: string;
  price: number | null;
}

export class ProductCard<T extends ProductCardData> extends Component<T>{
  protected productTitle: HTMLElement;
  protected productPrice: HTMLElement;
  protected id: string = "";

  constructor(container: HTMLElement) {
    super(container)

    this.productTitle = ensureElement<HTMLElement>(".card__title", this.container);
    this.productPrice = ensureElement<HTMLElement>(".card__price", this.container);
  }

  set title(value: string) {
    this.productTitle.textContent = value;
  }
  set price(value: number | null) {
    this.productPrice.textContent = value === null ? 'Бесценно' : `${value} синапсов`;
  }
}