import { IProduct } from "../../types"
import { IEvents } from "../base/Events"

export class ProductCatalog {
  private arrayProducts: IProduct[] = [];
  private selectedProduct: IProduct | null = null;

  constructor(protected events: IEvents) {}
  
  setProducts(products: IProduct[]): void {
    this.arrayProducts = products;
    this.events.emit("catalog:changed");
  }

  getProducts(): IProduct[] {
    return this.arrayProducts;
  }

  getProductById(id: string): IProduct | null {
    for (const element of this.arrayProducts) {
      if (element.id === id) {
         return element;
      }
    }
    return null
  }

  selectProduct(products: IProduct): void  {
    this.selectedProduct = products;
    this.events.emit("product:selected");
  }

  getSelectedProduct(): IProduct | null{
    return this.selectedProduct;
  }
}