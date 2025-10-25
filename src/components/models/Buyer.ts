import { FormErrors, IBuyer, TOrder } from "../../types";
import { settings } from "../../utils/constants";
import { IEvents } from "../base/Events";
import { TContactsForm } from "../view/ContactsForm";
import { TOrderForm } from "../view/OrderForm";

export class Buyer {
    private data: Partial<TOrder> = {};
    public order: Partial<TOrder> = {
        payment: '',
        email: '',
        phone: '',
        address: '',
    };
    formErrors: FormErrors = {};

    constructor (
            protected events: IEvents
        ) {}

    // Сохранение данных покупателя (общий метод)
    setData(data: Partial<IBuyer>): void {
        this.data = { ...this.data, ...data };
    }

    // Сохранение данных покупателя в полях формы
    setOrderField(field: keyof TOrderForm, value: string): void {
		this.order[field] = value;
		this.validateOrder();
	}

    setContactsField(field: keyof TContactsForm, value: string): void {
		this.order[field] = value;
		this.validateContacts();
	}

    // Получение всех данных покупателя
    getData(): Partial<IBuyer> {
        return { ...this.data };
    }

    // Очистка данных покупателя
    clearData(): void {
        this.data = {};
    }

    // Валидация данных, введенных покупателем
    validateOrder(): void {
		const errors: typeof this.formErrors = {};
        // Проверка способа оплаты
		if (!this.order.payment) {
			errors.payment = settings.formErrors.payment;
		}
        // Проверка адреса
		if (!this.order.address || this.order.address.trim() === '') {
			errors.address = settings.formErrors.address;
		}
		this.formErrors = errors;
		this.events.emit('orderFormErrors:change', this.formErrors);
	}

    validateContacts(): void {
		const errors: typeof this.formErrors = {};
        // Проверка email
        if (!this.order.email || this.order.email.trim() === '') {
            errors.email = settings.formErrors.email;
        }
        // Проверка телефона
        if (!this.order.phone || this.order.phone.trim() === '') {
            errors.phone = settings.formErrors.phone;
        }
		this.formErrors = errors;
		this.events.emit('contactsFormErrors:change', this.formErrors);
	}
}

    // Валидация отдельного поля
    // validateField(field: keyof IBuyer): { isValid: boolean; error?: string } {
    //     const validation = this.validate();
    //     return {
    //         isValid: !validation.errors[field],
    //         error: validation.errors[field]
    //     }
    // }