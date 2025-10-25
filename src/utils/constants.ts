/* Константа для получения полного пути для сервера. Для выполнения запроса 
необходимо к API_URL добавить только ендпоинт. */
export const API_URL = `${import.meta.env.VITE_API_ORIGIN}/api/weblarek`; 

/* Константа для формирования полного пути к изображениям карточек. 
Для получения полной ссылки на картинку необходимо к CDN_URL добавить только название файла изображения,
которое хранится в объекте товара. */
export const CDN_URL = `${import.meta.env.VITE_API_ORIGIN}/content/weblarek`;

/* Константа соответствий категорий товара модификаторам, используемым для отображения фона категории. */
export const categoryMap = {
	'софт-скил': 'card__category_soft',
	'хард-скил': 'card__category_hard',
	'кнопка': 'card__category_button',
	'дополнительное': 'card__category_additional',
	'другое': 'card__category_other',
};

export const settings = {
  currency: 'синапсов', // название валюты в родительном падеже
	formErrors: {
		phone: 'Необходимо указать телефон',
		phoneInvalid: 'Введите телефон в формате +7 (999) 999-99-99',
		email: 'Необходимо указать email',
		emailInvalid: 'Введите корректный email',
		address: 'Необходимо указать адрес',
		payment: 'Необходимо выбрать способ оплаты',
	},
	card: {
		noPrice: 'Бесценно',
	},
	buyButtonValues: {
		add: 'Купить',
		delete: 'Удалить из корзины',
		disabled: 'Недоступно',
	},
	basket: {
		empty: 'Корзина пуста',
	},
	categories: {
		'софт-скил': 'card__category_soft',
		другое: 'card__category_other',
		дополнительное: 'card__category_additional',
		кнопка: 'card__category_button',
		'хард-скил': 'card__category_hard',
	},
};

