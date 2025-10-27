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
import { Form } from './components/view/Form';
import { Gallery } from './components/view/Gallery';
import { Header } from './components/view/Header';
import { Modal } from './components/view/Modal';
import { OrderForm, TOrderForm } from './components/view/OrderForm';
import { Success } from './components/view/Success';
import './scss/styles.scss';
import { IBuyer, IProduct, TOrder, TPayment } from './types';
import { API_URL, settings } from './utils/constants';
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
const success = new Success(cloneTemplate(orderSuccessTemplate), {
	onClick: () => {
		modal.close();
	},
});

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
	if (!item.price || item.price === 0) {
		card.setButtonText(settings.buyButtonValues.disabled);
		card.setButtonDisabled(true);
	} else {
		if (basketProducts.hasItem(item.id)) {
			card.setButtonText(settings.buyButtonValues.delete);
			card.setButtonDisabled(false);
		} else {
			card.setButtonText(settings.buyButtonValues.add);
			card.setButtonDisabled(false);
		}
	};
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
	modal.render({ content: orderForm.render({
			payment: "",
			address: "",
			valid: "",
			errors: [],
		}),
	});
});

// реакция на изменение данных форм
events.on('form:change', (data: { field: keyof IBuyer; value: string }) => {
	buyer.setData(data.field, data.value);
});

// реакция на сохранение данных
events.on('buyer:change', ( data: { field: string} ) => {
	const { payment, address, email, phone } = buyer.validate().errors;

	console.log(buyer.validate());
	
	if (data.field === 'payment' || data.field === 'address' || !data) {
		const isValid = !payment && !address;
		const errors = Object.values({ payment, address })
		.filter((i) => !!i)
		.join('; ');
		modal.render({ content: orderForm.render({
			payment: buyer.getData().payment,
			address: buyer.getData().address,
			valid: isValid,
			errors: errors,
			}),
		});
	} else if (data.field === 'email' || data.field === 'phone' || !data) {
		const isValid = !email && !address;
		const errors = Object.values({ email, phone })
		.filter((i) => !!i)
		.join('; ');
		modal.render({ content: orderForm.render({
			email: buyer.getData().email,
			phone: buyer.getData().phone,
			valid: isValid,
			errors: errors,
			}),
		});
	}
});

// реакция на кнопку "Далее" в модальном окне первого шага оформления заказа
events.on('order:submit', () => {
	modal.render({
		content: contactsForm.render({
			phone: "",
			email: "",
			valid: false,
			errors: [],
		}),
	});
});

// реакция на кнопку "Оплатить" в модальном окне второго шага оформления заказа
events.on('contactsForm:submit', () => {
    const productsPost = {
        payment: buyer.getData().payment,
        email: buyer.getData().email,
        phone: buyer.getData().phone,
        address: buyer.getData().address,
		items: basketProducts.getItems().map((item) => item.id),
		total: basketProducts.getTotalPrice(),
    }
    console.log(productsPost.total);
    console.log(productsPost.payment);
    console.log(productsPost.email);
    console.log(productsPost.phone);
    console.log(productsPost.address);
    console.log(productsPost.items);

	apiClient
		.submitOrder(productsPost)
		.then((data) => {

			buyer.clearData();
            basketProducts.clearBasket();
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



	// // реакция на выбор способа оплаты и ввод данных в формы
// events.on('order:payment', (data: { payment: Partial<IBuyer> }) => {
// 	buyer.setData(data.payment);
// 	formData.payment = data.payment;
// 	console.log(`оплата выбрана ${data.payment}`);
// });

// events.on('order:address', (data: { address: Partial<IBuyer> }) => {
// 	buyer.setData(data.address);
// 	console.log(`адрес заполнен ${data.address}`);
// });

// events.on('contacts:email', (data: { email: Partial<IBuyer> }) => {
// 	buyer.setData(data.email);
// 	console.log(`мыло заполнено ${data.email}`);
// });

// events.on('contacts:phone', (data: { phone: Partial<IBuyer> }) => {
// 	buyer.setData(data.phone);
// 	console.log(`телефон заполнен ${data.phone}`);
// });

// // реакция на изменение значений в модели данных покупателя
// events.on('buyer:change', (data: { field: string}) => {
// 	const payment = buyer.getData().payment;
// 	const errors = buyer.validate();

// 	if (data.field === 'payment' || data.field === 'address') {
// 		const isValid = orderForm.
// 	}
// });