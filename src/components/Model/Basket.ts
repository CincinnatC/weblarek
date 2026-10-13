import { IProduct } from "../../types"
import { IEvents } from "../base/Events"

export class Basket {
  private purchasedProduct: IProduct[] = [];
  
  constructor(protected events: IEvents) {}

  getBasketProducts(): IProduct[] {
    return this.purchasedProduct;
  }

  addProduct(product: IProduct): void {
    this.purchasedProduct.push(product);
    this.events.emit("basket:changed");
  }

  removeProductById(product: string): void {
    const index = this.purchasedProduct.findIndex((item) => item.id === product);
    if (index !== -1) {this.purchasedProduct.splice(index, 1);}
    this.events.emit("basket:changed");
  }

  clearBasket(): void {
    this.purchasedProduct = [];
    this.events.emit("basket:changed");
  }

  getTotalPrice(): number {
    return this. purchasedProduct.reduce((total, item) => total + (item.price || 0), 0);
  }

  getBasketQuantity(): number {
    return this.purchasedProduct.length;
  }

  hasProduct(id: string): boolean {
    return this. purchasedProduct.some(item => item.id === id)
  }
}