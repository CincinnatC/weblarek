import { IProduct } from "../types"

export class Basket {
  private purchasedProduct: IProduct[] = [];
  
  getBasketProducts(): IProduct[] {
    return this.purchasedProduct;
  }

  addProduct(product: IProduct): void {
    this.purchasedProduct.push(product);
  }

  removeProductById(product: string): void {
    this. purchasedProduct = this. purchasedProduct.filter((item) => item.id !== product);
  }

  clearBasket(): void {
    this.purchasedProduct = [];
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