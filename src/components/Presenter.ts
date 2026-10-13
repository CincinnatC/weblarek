import { Gallery } from "./Viwe/Gallery"
import { CatalogCard } from "./Viwe/card/CatalogCard"
import { PreviewCard } from "./Viwe/card/PreviewCard"
import { Modal } from "./Viwe/Modal"
import { Basket as BasketView } from "./Viwe/Basket"
import { ProductCatalog } from "./Model/ProductCatalog"
import { Basket } from "./Model/Basket"
import { IEvents } from "./base/Events"
import { cloneTemplate } from "../utils/utils"
import { CardBasket } from "./Viwe/card/CardBasket"
import { Header } from "./Viwe/Header"
import { OrderForm } from "./Viwe/form/OrderForm"
import { Buyer } from "./Model/Buyer"
import { TPayment } from "../types"
import { ContactsForm } from "./Viwe/form/ContactsForm";
import { Form } from "./Viwe/form/Form"
import { IOrder } from "../types";
import { ConnectionAPI } from "./Model/ConnectionAPI"
import { OrderSuccess } from "./Viwe/OrderSuccess"

export class Presenter {
  constructor(
    protected events: IEvents,
    protected catalog: ProductCatalog,
    protected gallery: Gallery,
    protected modal: Modal,
    protected basket: Basket,
    protected basketView: BasketView,
    protected header: Header,
    protected orderForm: OrderForm | null,
    protected buyerModel: Buyer,
    protected contactsForm: ContactsForm | null,
    protected api: ConnectionAPI,
    protected orderSuccess: OrderSuccess,
  ) {
    this.events.on("catalog:changed", () => {
        const products = this.catalog.getProducts();
        const cards: HTMLElement[] = [];
        for (const product of products) {
            const card = new CatalogCard(this.events, cloneTemplate<HTMLElement>("#card-catalog"));
            cards.push(card.render(product));
        }
        this.gallery.render({ catalog: cards });
    });
    this.events.on<{ id: string }>("card:open", ({ id }) => {
      const product = this.catalog.getProductById(id)
      if (product === null) {
          return;
      }
      const card = new PreviewCard(this.events, cloneTemplate<HTMLElement>("#card-preview"));
      const content = card.render({...product, buttonText: this.basket.hasProduct(id) ? "Удалить из корзины" : "Купить"});
      this.modal.content = content;
      this.modal.open();
    })
    this.events.on<{ id: string }>("card:buy", ({ id }) => {
      const product = this.catalog.getProductById(id);
      if (product === null) {
        return;
      }
      if (this.basket.hasProduct(id)) {
        this.basket.removeProductById(id);
      } else {
        if (product.price === null) {
          return;
        }
        this.basket.addProduct(product);
      }
      this.modal.close();
    });
    this.events.on("basket:changed", () => {
        const products = this.basket.getBasketProducts();
        const cards: HTMLElement[] = [];
        for (let i = 0; i < products.length; i++) {
            const product = products[i];
            const card = new CardBasket(this.events, cloneTemplate<HTMLElement>("#card-basket"));
            cards.push(card.render({ ...product, index: i + 1 }));
        }
        this.basketView.render({items: cards, price: this.basket.getTotalPrice(), valid: this.basket.getBasketQuantity() > 0 });
        this.header.render({counter: this.basket.getBasketQuantity()})
    });
    this.events.on("basket:open", () => {
      const products = this.basket.getBasketProducts();
      const cards: HTMLElement[] = [];
      for (let i = 0; i < products.length; i++) {
        const product = products[i];
        const card = new CardBasket(this.events, cloneTemplate<HTMLElement>("#card-basket"));
        cards.push(card.render({ ...product, index: i + 1 }));
      }
      this.modal.content = this.basketView.render({
        items: cards,
        price: this.basket.getTotalPrice(),
        valid: this.basket.getBasketQuantity() > 0
      });
      this.modal.open();
    });
    this.events.on("modal:close", () => {
        this.modal.close()
    });
    this.events.on("success:close", () => {
      this.modal.close();
    });
    this.events.on<{ index: number }>("basket:delete", ({ index }) => {
        const products = this.basket.getBasketProducts();
        const id = products[index - 1].id
        this.basket.removeProductById(id)
    });
    this.events.on("basket:order", () => {
      this.orderForm = new OrderForm(this.events, cloneTemplate<HTMLElement>("#order"));
      const content = this.orderForm.render()
      this.modal.content = content;
      this.modal.open();
    });
    this.events.on<{ payment: TPayment }>("payment:change", ({ payment }) => {
      this.buyerModel.setPayment(payment);
    });
    this.events.on("buyer:changed", () => {
      const errors = this.buyerModel.validateBuyerData();
      this.orderForm?.render({
        valid: !errors.payment && !errors.address,
        errors: errors.address ?? (!errors.payment ? "" : errors.payment)
      });

      this.contactsForm?.render({
        valid: !errors.email && !errors.phone,
        errors: [errors.email, errors.phone]
          .filter(Boolean)
          .join(", ")
      });
    });
    this.events.on<{ address: string }>("address:change", ({ address }) => {
      this.buyerModel.setAddress(address);
    });
    this.events.on<{ email: string }>("email:change", ({ email }) => {
      this.buyerModel.setEmail(email);
    });
    this.events.on<{ phone: string }>("phone:change", ({ phone }) => {
      this.buyerModel.setPhone(phone);
    });
    this.events.on<{ form: Form<any> }>("form:submit", ({ form }) => {
      if (form instanceof OrderForm) {
        this.contactsForm = new ContactsForm(this.events,cloneTemplate<HTMLElement>("#contacts"));
        const content = this.contactsForm.render();
        this.modal.content = content;
        this.modal.open();
      }
      if (form instanceof ContactsForm) {
        const buyer = this.buyerModel.getBuyerData();
        const products = this.basket.getBasketProducts();
        const order: IOrder = { ...buyer, total: this.basket.getTotalPrice(), items: products.map(product => product.id)};
        this.api.createOrder(order)
          .then((result) => {
            this.modal.content = this.orderSuccess.render({sum: result.total});
            this.modal.open();
            this.basket.clearBasket();
            this.buyerModel.clearBuyerData();
          })
          .catch((error) => {
            console.error("Ошибка создания заказа:", error);
          });
      }
    });
  }
}