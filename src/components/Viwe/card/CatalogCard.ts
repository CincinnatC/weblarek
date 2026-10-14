import { ensureElement } from "../../../utils/utils"
import { ProductCard, ProductCardData } from "./ProductCard"
import { categoryMap, CDN_URL } from "../../../utils/constants"

type CategoryKey = keyof typeof categoryMap;

interface CatalogCardData extends ProductCardData{
  category: string;
  image: string;
}
interface CatalogCardActions {
  onClick: () => void;
}

export class CatalogCard extends ProductCard<CatalogCardData> {
  private catalogButton: HTMLButtonElement;
  private cardCategory: HTMLSpanElement;
  private cardImage: HTMLImageElement;

  constructor(actions: CatalogCardActions, container: HTMLElement) {
    super(container)

    this.catalogButton = this.container as HTMLButtonElement;
    this.cardCategory = ensureElement<HTMLSpanElement>(".card__category", this.container);
    this.cardImage = ensureElement<HTMLImageElement>(".card__image", this.container);

    this.catalogButton.addEventListener("click", actions.onClick);
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
  set image(value: string) {
    this.setImage(this.cardImage, CDN_URL + value);
  }
}