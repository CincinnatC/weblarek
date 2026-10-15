import { ensureElement } from "../../../utils/utils"
import { ProductCard, ProductCardData } from "./ProductCard"
import { categoryMap, CDN_URL } from "../../../utils/constants";

type CategoryKey = keyof typeof categoryMap;

interface PreviewCardData extends ProductCardData {
  description: string;
  image: string;
  buttonText: string;
  buttonDisabled: boolean;
}

interface PreviewCardActions {
  onClick: () => void;
}

export class PreviewCard extends ProductCard<PreviewCardData> {
  private previewImage: HTMLImageElement;
  private previewButton: HTMLButtonElement;
  private descriptionCard: HTMLParagraphElement;
  private cardCategory: HTMLElement;

  constructor(actions: PreviewCardActions, container: HTMLElement) {
    super(container)

    this.previewImage = ensureElement<HTMLImageElement>(".card__image", this.container);
    this.descriptionCard = ensureElement<HTMLParagraphElement>(".card__text", this.container);
    this.previewButton = ensureElement<HTMLButtonElement>(".card__button", this.container);

    this.previewButton.addEventListener("click", actions.onClick);
    this.cardCategory = ensureElement<HTMLElement>(".card__category", this.container);
  }
  set description(value: string) {
    this.descriptionCard.textContent = value;
  }
  set image(value: string) {
    this.setImage(this.previewImage, CDN_URL + value);
  }
  set buttonText(value: string) {
    this.previewButton.textContent = value;
  }
  set buttonDisabled(value: boolean) {
    this.previewButton.disabled = value;
  }
  set category(value: string) {
    this.cardCategory.textContent = value;
    
    for (const key in categoryMap) {
      this.cardCategory.classList.toggle(
        categoryMap[key as CategoryKey],
        key === value
      );
    }
  }
}