import './scss/styles.scss';

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
productsModel.setProducts(apiProducts.items);
console.log('1. Массив товаров:', productsModel.getProducts());

console.log(
  '2. Поиск существующего товара:',
  productsModel.getProductById(apiProducts.items[0].id)
);

console.log(
  '3. Поиск несуществующего товара:',
  productsModel.getProductById('несуществующий-id')
);

productsModel.selectProduct(apiProducts.items[0]);
console.log('4. Выбранный товар:', productsModel.getSelectedProduct());

// проерка Basket
basketModel.addProduct(apiProducts.items[0]);
basketModel.addProduct(apiProducts.items[1]);

console.log('5. Товары в корзине:', basketModel.getBasketProducts());

console.log('6. Количество товаров:', basketModel.getBasketQuantity());

console.log('7. Общая стоимость:', basketModel.getTotalPrice());

console.log(
  '8. Проверка наличия товара:',
  basketModel.hasProduct(apiProducts.items[0].id)
);

basketModel.removeProductById(apiProducts.items[0].id);
console.log('9. Корзина после удаления:', basketModel.getBasketProducts());

basketModel.clearBasket();
console.log('10. Корзина после очистки:', basketModel.getBasketProducts());

console.log(
  '11. Количество товаров после очистки:',
  basketModel.getBasketQuantity()
);

// Проверка Buyer
buyerModel.setAddress('Северный Полюс');
buyerModel.setPhone('+676767676767');
buyerModel.setEmail('bebebe@yandex.ru');
buyerModel.setPayment('card');

console.log('12. Данные покупателя:', buyerModel.getBuyerData());

console.log('13. Валидация заполненных данных:', buyerModel.validateBuyerData());

buyerModel.clearBuyerData();

console.log('14. Данные после очистки:', buyerModel.getBuyerData());

console.log('15. Валидация пустых данных:', buyerModel.validateBuyerData());


const api = new Api(API_URL);
const connectionAPI = new ConnectionAPI(api);
connectionAPI.getProducts()
  .then((response) => {
    productsModel.setProducts(response.items);
    console.log('Товары с сервера:', productsModel.getProducts());
  })
  .catch((error) => {
    console.error('Ошибка загрузки товаров:', error);
  });