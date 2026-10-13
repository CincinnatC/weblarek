import './scss/styles.scss';

import { Presenter } from './components/Presenter.ts';
import { ProductCatalog } from './components/Model/ProductCatalog';
import { Basket } from './components/Model/Basket.ts';
import { Buyer } from './components/Model/Buyer';
import { ConnectionAPI } from './components/Model/ConnectionAPI';
import { Api } from './components/base/Api';
import { API_URL } from './utils/constants';
import { cloneTemplate } from './utils/utils.ts';
import { EventEmitter } from './components/base/Events.ts';
import { ensureElement } from './utils/utils.ts';
import { Header } from './components/Viwe/Header.ts';
import { OrderSuccess } from './components/Viwe/OrderSuccess.ts';
import { Basket as BasketView } from './components/Viwe/Basket.ts';
import { Gallery } from './components/Viwe/Gallery.ts';
import { Modal } from './components/Viwe/Modal.ts';

const events = new EventEmitter();

const productsModel = new ProductCatalog(events);
const basketModel = new Basket(events);
const buyerModel = new Buyer(events);

const header = new Header(events, ensureElement<HTMLElement>('.header'));
const modal = new Modal(events, ensureElement<HTMLElement>('.page'))

const gallery = new Gallery(
  ensureElement<HTMLElement>('.page__wrapper')
);
const basketView = new BasketView(events, cloneTemplate<HTMLElement>("#basket"))
const api = new Api(API_URL);
const connectionAPI = new ConnectionAPI(api);
const orderSuccess = new OrderSuccess(events, cloneTemplate<HTMLElement>("#success"));
const presenter = new Presenter(
  events,
  productsModel,
  gallery,
  modal,
  basketModel,
  basketView,
  header,
  null,
  buyerModel,
  null,
  connectionAPI,
  orderSuccess,
);
connectionAPI.getProducts()
  .then((response) => {
    productsModel.setProducts(response.items);
  })
  .catch((error) => {
    console.error('Ошибка загрузки товаров:', error);
  });