import { IProduct } from "../types"

export class ProductCatalog {
  private arrayProducts: IProduct[] = [];
  private selectedProduct: IProduct | null = null;
  
  setProducts(products: IProduct[]): void {
    this.arrayProducts = products;
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
  }

  getSelectedProduct(): IProduct | null{
    return this.selectedProduct;
  }
}