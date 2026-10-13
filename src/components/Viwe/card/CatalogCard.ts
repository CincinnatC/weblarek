import { ensureElement } from "../../../utils/utils"
import { ProductCard, ProductCardData } from "./ProductCard"
import { IEvents } from "../../base/Events"
import { categoryMap, CDN_URL } from "../../../utils/constants"

type CategoryKey = keyof typeof categoryMap;

interface CatalogCardData extends ProductCardData{
  category: string;
  image: string;
}

export class CatalogCard extends ProductCard<CatalogCardData> {
  private catalogButton: HTMLButtonElement;
  private cardCategory: HTMLSpanElement;
  private cardImage: HTMLImageElement;

  constructor(protected events: IEvents, container: HTMLElement) {
    super(container)

    this.catalogButton = this.container as HTMLButtonElement;
    this.cardCategory = ensureElement<HTMLSpanElement>(".card__category", this.container);
    this.cardImage = ensureElement<HTMLImageElement>(".card__image", this.container);

    this.catalogButton.addEventListener("click", () => {
      this.events.emit("card:open", { id: this.id });
    })
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