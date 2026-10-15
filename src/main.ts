import './scss/styles.scss';

import { ProductCatalog } from './components/Model/ProductCatalog';
import { Basket } from './components/Model/Basket.ts';
import { Buyer } from './components/Model/Buyer';
import { ConnectionAPI } from './components/ConnectionAPI.ts';
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
import { CatalogCard } from './components/Viwe/card/CatalogCard.ts';
import { PreviewCard } from './components/Viwe/card/PreviewCard.ts';
import { CardBasket } from './components/Viwe/card/CardBasket.ts';
import { OrderForm } from './components/Viwe/form/OrderForm.ts';
import { ContactsForm } from './components/Viwe/form/ContactsForm.ts';
import { Form } from './components/Viwe/form/Form.ts';
import { TPayment } from './types/index.ts';
import { IOrder } from './types/index.ts';
import { IProduct } from './types/index.ts';

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
const previewCard = new PreviewCard({
    onClick: () => {
      const product = productsModel.getSelectedProduct();
      if (product) {
        events.emit("card:toggle", { id: product.id });
      }
    }
  },
  cloneTemplate<HTMLElement>("#card-preview")
);
const orderForm = new OrderForm(events, cloneTemplate<HTMLElement>("#order"));
const contactsForm = new ContactsForm(events, cloneTemplate<HTMLElement>("#contacts"));

events.on("catalog:changed", () => {
  const products = productsModel.getProducts();
  const cards: HTMLElement[] = [];
    for (const product of products) {
      const card = new CatalogCard({onClick: () => events.emit("card:select", product)},cloneTemplate<HTMLElement>("#card-catalog"));
      cards.push(card.render(product));
    }
    gallery.render({ catalog: cards });
});

events.on<IProduct>("card:select", (product) => {
  productsModel.selectProduct(product);
});

events.on("product:selected", () => {
  const product = productsModel.getSelectedProduct()
  if (product === null) {
     return;
  }
  const inBasket = basketModel.hasProduct(product.id);
  const content = previewCard.render({
    ...product,
    buttonText: product.price === null ? "Недоступно" : inBasket === true ? "Удалить из корзины" : "Купить",
    buttonDisabled: product.price === null
  });
  modal.content = content;
  modal.open();
})

events.on<{ id: string }>("card:toggle", ({ id }) => {
  const product = productsModel.getProductById(id);
  if (product === null) {
    return;
  }
  if (basketModel.hasProduct(id)) {
    basketModel.removeProductById(id);
  } else {
    if (product.price === null) {
      return;
    }
    basketModel.addProduct(product);
  }
  modal.close();
});

events.on("basket:changed", () => {
    const products = basketModel.getBasketProducts();
    const cards: HTMLElement[] = [];
    for (let i = 0; i < products.length; i++) {
        const product = products[i];
        const card = new CardBasket({onClick: () => events.emit("basket:delete", { id: product.id })},cloneTemplate<HTMLElement>("#card-basket"));
        cards.push(card.render({ ...product, index: i + 1 }));
    }
    basketView.render({items: cards, price: basketModel.getTotalPrice(), valid: basketModel.getBasketQuantity() > 0 });
    header.render({counter: basketModel.getBasketQuantity()})
});

events.on("basket:open", () => {
  modal.content = basketView.render();
  modal.open();
});

events.on("modal:close", () => {
    modal.close()
});

events.on("success:close", () => {
  modal.close();
});

events.on<{ id: string }>("basket:delete", ({ id }) => {
  basketModel.removeProductById(id);
});

events.on("basket:order", () => {
  const content = orderForm.render()
  modal.content = content;
  modal.open();
});

events.on<{ payment: TPayment }>("payment:change", ({ payment }) => {
  buyerModel.setPayment(payment);
});

events.on<{ form: Form<any> }>("form:submit", ({ form }) => {
  if (form instanceof OrderForm) {
    const content = contactsForm.render();
    modal.content = content;
    modal.open();
  }
  if (form instanceof ContactsForm) {
    const buyer = buyerModel.getBuyerData();
    const products = basketModel.getBasketProducts();
    const order: IOrder = { ...buyer, total: basketModel.getTotalPrice(), items: products.map(product => product.id)};
    connectionAPI.createOrder(order)
      .then((result) => {
        modal.content = orderSuccess.render({sum: result.total});
        modal.open();
        basketModel.clearBasket();
        buyerModel.clearBuyerData();
      })
      .catch((error) => {
        console.error("Ошибка создания заказа:", error);
      });
  }
});

events.on("buyer:changed", () => {
  const buyer = buyerModel.getBuyerData();
  const errors = buyerModel.validateBuyerData();

  orderForm.render({
    payment: buyer.payment,
    address: buyer.address,
    valid: !errors.payment && !errors.address,
    errors: errors.address ?? (!errors.payment ? "" : errors.payment)
  });

  let errorMessage = "";
  if (errors.email && errors.phone) {
    errorMessage = `${errors.email}, ${errors.phone}`;
  } else if (errors.email) {
    errorMessage = errors.email;
  } else if (errors.phone) {
    errorMessage = errors.phone;
  }
  contactsForm.render({
    email: buyer.email,
    phone: buyer.phone,
    valid: !errors.email && !errors.phone,
    errors: errorMessage
  });
});

events.on<{ address: string }>("address:change", ({ address }) => {
  buyerModel.setAddress(address);
});
events.on<{ email: string }>("email:change", ({ email }) => {
  buyerModel.setEmail(email);
});
events.on<{ phone: string }>("phone:change", ({ phone }) => {
  buyerModel.setPhone(phone);
});

connectionAPI.getProducts()
  .then((response) => {
    productsModel.setProducts(response.items);
  })
  .catch((error) => {
    console.error('Ошибка загрузки товаров:', error);
  });