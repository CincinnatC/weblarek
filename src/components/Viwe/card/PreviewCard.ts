import { ensureElement } from "../../../utils/utils"
import { ProductCard, ProductCardData } from "./ProductCard"
import { IEvents } from "../../base/Events"
import { CDN_URL } from "../../../utils/constants";

interface PreviewCardData extends ProductCardData {
  description: string;
  image: string;
  buttonText: string;
}

export class PreviewCard extends ProductCard<PreviewCardData> {
  private previewImage: HTMLImageElement;
  private previewButton: HTMLButtonElement;
  private descriptionCard: HTMLParagraphElement;
  private isInBasket = false;
  private currentPrice: number | null = null;

  constructor(protected events: IEvents, container: HTMLElement) {
    super(container)

    this.previewImage = ensureElement<HTMLImageElement>(".card__image", this.container);
    this.descriptionCard = ensureElement<HTMLParagraphElement>(".card__text", this.container);
    this.previewButton = ensureElement<HTMLButtonElement>(".card__button", this.container);

    this.previewButton.addEventListener("click", () => {
      this.events.emit("card:buy", { id: this.id });
    })
  }
  set description(value: string) {
    this.descriptionCard.textContent = value;
  }
  set image(value: string) {
    this.setImage(this.previewImage, CDN_URL + value);
  }
  set price(value: number | null) {
    super.price = value;
    this.currentPrice = value;
    this.updateButton();
  }
  set buttonText(value: string) {
    this.isInBasket = value === "Удалить из корзины";
    this.updateButton();
  }
  private updateButton(): void {
    if (this.currentPrice === null) {
      this.previewButton.disabled = true;
      this.previewButton.textContent = "Недоступно";
    } else {
      this.previewButton.disabled = false;
      this.previewButton.textContent = this.isInBasket ? "Удалить из корзины" : "Купить";
    }
  }
}