import { IProduct } from "../types"

export class ProductCatalog {
  arrayProducts: IProduct[] = [];
  selectedProduct: IProduct | null = null;
  
  savingArray(products: IProduct[]): void {
    this.arrayProducts = products;
  }

  getArray(): IProduct[] {
    return this.arrayProducts;
  }

  oneProduct(id: string): IProduct | null {
    for (const element of this.arrayProducts) {
      if (element.id === id) {
         return element;
      }
    }
    return null
  }

  preservationProduct(products: IProduct): void  {
    this.selectedProduct = products;
  }

  getProduct(): IProduct | null{
    return this.selectedProduct;
  }
}