import { IApi } from '../types'
import { IProductsResponse } from '../types'
import { IOrder } from '../types'
import { IOrderResult } from '../types'

export class ConnectionAPI {
  constructor(private api: IApi) {
  }
  getProducts(): Promise<IProductsResponse> {
    return this.api.get<IProductsResponse>('/product/');
  }
  createOrder(order: IOrder): Promise<IOrderResult> {
    return this.api.post<IOrderResult>('/order/', order);
  }
}