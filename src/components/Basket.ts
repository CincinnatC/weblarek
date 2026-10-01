import { IProduct } from "../types"

export class Basket {
  purchasedProduct: IProduct[] = [];
  
  getProductBasket(): IProduct[] {
    return this.purchasedProduct;
  }

  addProduct(product: IProduct): void {
    this.purchasedProduct.push(product);
  }

  deleteProduct(product: IProduct): void {
    const index = this.purchasedProduct.findIndex(
      (item) => item.id === product.id
    );
    if (index >= 0) {
      this.purchasedProduct.splice(index, 1);
    }
  }

  cleaningBasket(): void {
    this.purchasedProduct.splice(0, this.purchasedProduct.length);
  }

  priceAllProduct(): number {
    let price: number = 0;
    for (const item of this.purchasedProduct) {
      if (item.price === null) {
        price += 0;
      }
      else {
        price += item.price;
      }
    }
    return price;
  }

  quantityProductBasket(): number {
    return this.purchasedProduct.length;
  }

  checkProductInBasket(id: string): boolean {
    for (const element of this.purchasedProduct) {
      if (element.id === id) {
        return true;
      }
    }
    return false;
  }
}