import { Api } from './components/base/Api';
import { ApiClient } from './components/models/ApiClient';
import { BasketProducts } from './components/models/BasketProducts';
import { Buyer } from './components/models/Buyer';
import { ProductCatalog } from './components/models/ProductCatalog';
import './scss/styles.scss';
import { IProduct, TPayment } from './types';
import { API_URL } from './utils/constants';
import { apiProducts } from './utils/data';


// Тестирование класса ProductCatalog

// Тестирование метода setProducts
const productCatalogTest = new ProductCatalog();
productCatalogTest.setProducts(apiProducts.items);
console.log('Массив товаров из каталога: ', productCatalogTest.getProducts());

// Тестирование метода getProducts
const allProducts = productCatalogTest.getProducts();
console.log('Товары: ', allProducts);

// Тестирование метода getProductById
const productById = productCatalogTest.getProductById(apiProducts.items[0].id);
console.log('Товар с id[0]: ', productById);

// Тестирование методов setSelectedProduct, getSelectedProduct, clearSelectedProduct
if (productById) {
    productCatalogTest.setSelectedProduct(productById);
    const selectedProduct = productCatalogTest.getSelectedProduct();
    console.log('Выбранный товар: ', selectedProduct);
    productCatalogTest.clearSelectedProduct();
    console.log('После очистки выбранного товара: ', productCatalogTest.getSelectedProduct);
}


// Тестирование класса BasketProducts

// Тестирование методов getItems, getItemsCount
const basketProductsTest = new BasketProducts();
console.log('Исходные товары в корзине: ', basketProductsTest.getItems());
console.log('Исходное количество товаров в корзине: ', basketProductsTest.getItemsCount());

// Тестирование методов getProductById, addItem, getItemsCount
const product0 = productCatalogTest.getProductById(apiProducts.items[0].id);
const product2 = productCatalogTest.getProductById(apiProducts.items[2].id);
if (product0) {
    basketProductsTest.addItem(product0);
    console.log('Товар добавлен в корзину. Теперь в корзине товаров: ', basketProductsTest.getItemsCount());
}
if (product2) {
    basketProductsTest.addItem(product2);
    console.log('Товар добавлен в корзину. Теперь в корзине товаров: ', basketProductsTest.getItemsCount());
}
if (product0) {
    basketProductsTest.addItem(product0);
    console.log('Товар добавлен в корзину повторно. Теперь в корзине товаров: ', basketProductsTest.getItemsCount());
}

// Тестирование методов getItems, getTotalPrice
console.log('Товары в корзине: ', basketProductsTest.getItems());
console.log('Общая стоимость: ', basketProductsTest.getTotalPrice());

// Тестирование метода hasItem
console.log('Проверка наличия товара 0 в корзине: ', basketProductsTest.hasItem(apiProducts.items[0].id));
console.log('Проверка наличия товара 1 в корзине: ', basketProductsTest.hasItem(apiProducts.items[1].id));
console.log('Проверка наличия товара 2 в корзине: ', basketProductsTest.hasItem(apiProducts.items[2].id));

// Тестирование метода removeItem
basketProductsTest.removeItem(apiProducts.items[2].id);
console.log('После удаления товара 2 в корзине: ', basketProductsTest.getItemsCount());
console.log('Теперь общая стоимость корзины: ', basketProductsTest.getTotalPrice());

// Тестирование метода clearBasket
basketProductsTest.clearBasket();
console.log('После очистки товаров в корзине: ', basketProductsTest.getItemsCount());
console.log('После очистки общая стоимость: ', basketProductsTest.getTotalPrice());


// Тестирование класса Buyer
// Тестирование метода getData
const buyerTest = new Buyer();
console.log('Начальное состояние данных покупателя: ', buyerTest.getData());

// Тестирование метода setData
buyerTest.setData({
    payment: 'online' as TPayment,
    email: 'test@test.ru'
});
console.log('Состояние данных покупателя после сохранения эл.почты и способа оплаты: ', buyerTest.getData());

buyerTest.setData({
    email: ''
});
console.log('Состояние данных после обновления (обнуления) email: ', buyerTest.getData());

// Тестирование метода валидации отдельных полей validateField
const emailValidation = buyerTest.validateField('email');
console.log('Валидность Email: ', emailValidation.isValid, 'Ошибка: ', emailValidation.error);
const phoneValidation = buyerTest.validateField('phone');
console.log('Валидность Phone: ', phoneValidation.isValid, 'Ошибка: ', phoneValidation.error);

// Тестирование метода общей валидации формы validate
const validationAll = buyerTest.validate();
console.log('Валидны ли текущие данные? ', validationAll.isValid);
console.log('Есть ошибки: ', validationAll.errors);

// Тестирование валидации пустых и неполных форм
const emptyBuyerTest = new Buyer();
const emptyValidation = emptyBuyerTest.validate();
console.log('Валидация пустого покупателя: ', emptyValidation);

// Тестирование метода очистки данных
buyerTest.clearData();
console.log('после очистки всех данных: ', buyerTest.getData());



// Вывод массива товаров с сервера
const api = new Api(API_URL);
const apiClient = new ApiClient(api);
const catalog = new ProductCatalog();

console.log('1. Запрашиваем список товаров с сервера...');
let products: IProduct[] = [];
apiClient.getProductList()
    .then((data: IProduct[]) => {
        products = data;
        console.log('2. Сохраняем товары в модель каталога...');
        catalog.setProducts(products);
        console.log('3. Проверяем сохраненные данные:');
        const savedProducts = catalog.getProducts();
        console.log('Количество товаров в каталоге:', savedProducts.length);
        console.log('Товары в каталоге:', savedProducts);
        // Тестирование метода getProductById
        console.log('4. Тестируем методы каталога с реальными данными:');
        if (savedProducts.length > 0) {
            const firstProduct = savedProducts[0];
            console.log('Первый товар:', firstProduct);
        // Тестируем получение товара по ID
            const productByIdApi = catalog.getProductById(firstProduct.id);
            console.log('Товар по ID:', productByIdApi);
        // Тестируем работу с выбранным товаром
            catalog.setSelectedProduct(firstProduct);
            console.log('Выбранный товар:', catalog.getSelectedProduct());
        }
    })
    .catch((error) => {
        console.error('Ошибка работы с сервером: ', error);
    });

