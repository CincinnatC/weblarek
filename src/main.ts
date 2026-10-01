import './scss/styles.scss';

console.log('API ORIGIN:', import.meta.env.VITE_API_ORIGIN);

import { ProductCatalog } from './components/ProductCatalog';
import { Basket } from './components/Basket';
import { Buyer } from './components/Buyer';
import { apiProducts } from './utils/data.ts';
import { ConnectionAPI } from './components/ConnectionAPI';
import { Api } from './components/base/Api';
import { API_URL } from './utils/constants';

const productsModel = new ProductCatalog();
const basketModel = new Basket();
const buyerModel = new Buyer();

//проверка ProductCatalog
productsModel.savingArray(apiProducts.items);
console.log('1. Массив товаров:', productsModel.getArray());

console.log(
  '2. Поиск существующего товара:',
  productsModel.oneProduct(apiProducts.items[0].id)
);

console.log(
  '3. Поиск несуществующего товара:',
  productsModel.oneProduct('несуществующий-id')
);

productsModel.preservationProduct(apiProducts.items[0]);
console.log('4. Выбранный товар:', productsModel.getProduct());

// проерка Basket
basketModel.addProduct(apiProducts.items[0]);
basketModel.addProduct(apiProducts.items[1]);

console.log('5. Товары в корзине:', basketModel.getProductBasket());

console.log('6. Количество товаров:', basketModel.quantityProductBasket());

console.log('7. Общая стоимость:', basketModel.priceAllProduct());

console.log(
  '8. Проверка наличия товара:',
  basketModel.checkProductInBasket(apiProducts.items[0].id)
);

basketModel.deleteProduct(apiProducts.items[0]);
console.log('9. Корзина после удаления:', basketModel.getProductBasket());

basketModel.cleaningBasket();
console.log('10. Корзина после очистки:', basketModel.getProductBasket());

console.log(
  '11. Количество товаров после очистки:',
  basketModel.quantityProductBasket()
);

// Проверка Buyer
buyerModel.setAddress('Северный Полюс');
buyerModel.setPhone('+676767676767');
buyerModel.setEmail('bebebe@yandex.ru');
buyerModel.setPayment('card');

console.log('12. Данные покупателя:', buyerModel.getBuyerData());

console.log('13. Валидация заполненных данных:', buyerModel.validationBuyerData());

buyerModel.cleanBuyerData();

console.log('14. Данные после очистки:', buyerModel.getBuyerData());

console.log('15. Валидация пустых данных:', buyerModel.validationBuyerData());


const api = new Api(API_URL);
const connectionAPI = new ConnectionAPI(api);
connectionAPI.getProducts()
  .then((response) => {
    productsModel.savingArray(response.items);
    console.log('Товары с сервера:', productsModel.getArray());
  })
  .catch((error) => {
    console.error('Ошибка загрузки товаров:', error);
  });