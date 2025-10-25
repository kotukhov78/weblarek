import { Api } from './components/base/Api';
import { EventEmitter } from './components/base/Events';
import { ApiClient } from './components/models/ApiClient';
import { BasketProducts } from './components/models/BasketProducts';
import { Buyer } from './components/models/Buyer';
import { ProductCatalog } from './components/models/ProductCatalog';
import { Basket } from './components/view/Basket';
import { CardBasket } from './components/view/CardBasket';
import { CardCatalog } from './components/view/CardCatalog';
import { CardPreview } from './components/view/CardPreview';
import { ContactsForm, TContactsForm } from './components/view/ContactsForm';
import { Gallery } from './components/view/Gallery';
import { Header } from './components/view/Header';
import { Modal } from './components/view/Modal';
import { OrderForm, TOrderForm } from './components/view/OrderForm';
import { Success } from './components/view/Success';
import './scss/styles.scss';
import { IProduct, TOrder } from './types';
import { API_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';

// Инициализация api
const api = new Api(API_URL);
const apiClient = new ApiClient(api);

// Инициализация брокера событий
const events = new EventEmitter();

// Модели данных приложения
const productCatalog = new ProductCatalog(events);
const basketProducts = new BasketProducts(events);
const buyer = new Buyer(events);

// Все шаблоны
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderFormTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsFormTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const orderSuccessTemplate = ensureElement<HTMLTemplateElement>('#success');

// Инициализация представлений
const gallery = new Gallery(ensureElement<HTMLElement>('.gallery'));
const header = new Header(ensureElement<HTMLElement>('.header'), events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'));
const orderForm = new OrderForm(cloneTemplate(orderFormTemplate), events);
const contactsForm = new ContactsForm(cloneTemplate(contactsFormTemplate), events);
const basket = new Basket(cloneTemplate(basketTemplate), events);


// слушатель события и обработчик рендера каталога
events.on('catalog:changed', () => {
    const itemCards = productCatalog.getProducts().map((item) => {
        const card = new CardCatalog(cloneTemplate(cardCatalogTemplate), {
            onClick: () => events.emit('card:select', item), 
        });
        return card.render(item);
    });
    gallery.render({ catalog: itemCards });
});

// реакция на клик на карточку каталога на странице
events.on('card:select', (item: IProduct) => {
	productCatalog.setSelectedProduct(item);
});

// реакция на изменение выбранного товара в модели
events.on('preview:changed', (item: IProduct) => {
	const card = new CardPreview(cloneTemplate(cardPreviewTemplate), {
		onClick: () => {
			events.emit('button:changed', item);
			modal.close();
		},
	});
	card.changeButton(item.price, basketProducts.hasItem(item.id));
	modal.render({
		content: card.render({
			id: item.id,
			title: item.title,
			image: item.image,
			description: item.description,
			price: item.price,
			category: item.category,
		}),
	});
});

// реакция на нажатие кнопки корзины в хедере
events.on('basket:open', () => {
	modal.render({
		content: basket.render({}),
	});
	modal.setMaxHeight('90vh');
	modal.enableScroll();
});

// обновление корзины при изменении списка товаров в корзине
events.on('basket:changed', () => {
    header.render({counter: basketProducts.getItemsCount()});
    const products = basketProducts.getItems().map((item, index) => {
		const cardBasket = new CardBasket(cloneTemplate(cardBasketTemplate), {
			onClick: () => events.emit('basket:delete', item),
		});
		return cardBasket.render({
			id: item.id,
			title: item.title,
			price: item.price,
			index: index + 1,
		});
	});
	basket.render({ items: products, total: basketProducts.getTotalPrice() });
});

// реакция на клик кнопки в модальном окне просмотра товара
events.on('button:changed', (item: IProduct) => {
	if (basketProducts.hasItem(item.id)) {
		basketProducts.removeItem(item.id);
	} else {
		basketProducts.addItem(item);
	}
});

// реакция на клик кнопки удаления товара в корзине
events.on('basket:delete', (item: IProduct) => {
	basketProducts.removeItem(item.id);
	events.emit('basket:open');
});

// реакция на клик на кнопку "Оформить" в корзине
events.on('orderForm:open', () => {
	modal.render({
		content: orderForm.render({
			payment: buyer.order.payment,
			address: buyer.order.address,
			valid: !!buyer.order.payment && !!buyer.order.address,
			errors: [],
		}),
	});
});

// реакция на клики по кнопкам "Онлайн", "При получении" и на ввод текста в поле "Адрес"
events.on('orderFormInput:change', (data: { field: keyof TOrderForm; value: string }) => {
	buyer.setOrderField(data.field, data.value);
});

// реакция на изменение состояния валидации формы выбора оплаты и ввода адреса доставки
events.on('orderFormErrors:change', (errors: Partial<TOrderForm>) => {
    orderForm.valid = Object.keys(errors).length > 0 ? false : true;
	orderForm.errors = Object.values(errors)
		.filter((i) => !!i)
		.join('; ');
});

// реакция на кнопку "Далее" в модальном окне первого шага оформления заказа
events.on('orderForm:submit', () => {
	modal.render({
		content: contactsForm.render({
			phone: buyer.order.phone,
			email: buyer.order.email,
			valid: !!buyer.order.phone && !!buyer.order.email,
			errors: [],
		}),
	});
});

// реакция на ввод текста в поля "Телефон" и "Email"
events.on('contactsFormInput:change', (data: { field: keyof TContactsForm; value: string }) => {
	buyer.setContactsField(data.field, data.value);
});

// реакция на изменение состояния валидации формы ввода номера телефона и email
events.on('contactsFormErrors:change', (errors: Partial<TContactsForm>) => {
	contactsForm.valid = Object.keys(errors).length > 0 ? false : true;
	contactsForm.errors = Object.values(errors)
		.filter((i) => !!i)
		.join('; ');
});

// реакция на кнопку "Оплатить" в модальном окне второго шага оформления заказа
events.on('contacts:submit', () => {
    const buyerPost = buyer.getData();
    const productsPost = {
        payment: buyer.order.payment,
        email: buyer.order.email,
        phone: buyer.order.phone,
        address: buyer.order.address,
		items: basketProducts.getItems().map((item) => item.id),
		total: basketProducts.getTotalPrice(),
    }
    const orderPost: TOrder = {
        ...buyerPost,
        ...productsPost
    }
    console.log(productsPost.total);
    console.log(productsPost.payment);
    console.log(productsPost.email);
    console.log(productsPost.phone);
    console.log(productsPost.address);
    console.log(productsPost.items);

	apiClient
		.submitOrder(orderPost)
		.then((data) => {

			buyer.clearData();
            basketProducts.clearBasket();
			const success = new Success(cloneTemplate(orderSuccessTemplate), {
				onClick: () => {
					modal.close();
				},
			});

			modal.render({
				content: success.render({ total: data.total }),
			});
		})
		.catch((err) => {
            console.error('Ошибка работы с сервером: ', err);
        });
});

apiClient
    .getProductList()
    .then((data) => {
        productCatalog.setProducts(data);
    })
    .catch((err) => {
        console.error('Ошибка работы с сервером: ', err);
    });
