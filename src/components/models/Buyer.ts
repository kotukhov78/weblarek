import { IBuyer, IValidationErrors } from "../../types";
import { IEvents } from "../base/Events";

export class Buyer {
    private data: Partial<IBuyer> = {
        payment: '',
        email: '',
        phone: '',
        address: '',
    };

    constructor (
        protected events: IEvents
    ) {}

    // Сохранение данных покупателя (общий метод)
    // setData(data: Partial<IBuyer>): void {
    //     this.data = { ...this.data, ...data };
    //     this.events.emit('buyer:change');
    // }

    setData<K extends keyof IBuyer>(field: K, value: IBuyer[K]): void {
        this.data = { ...this.data, [field]: value };
        this.events.emit('buyer:change', {field});
    }

    // Получение всех данных покупателя
    getData(): Partial<IBuyer> {
        return { ...this.data };
    }

    // Очистка данных покупателя
    clearData(): void {
        this.data = {
            payment: '',
            email: '',
            phone: '',
            address: '',
        };
    }

    // Валидация данных, введенных покупателем
    validate(): { isValid: boolean; errors: IValidationErrors } {
        const errors: IValidationErrors = {};

        // Проверка способа оплаты
        if (!this.data.payment) {
            errors.payment = 'Способ оплаты не указан';
        }

        // Проверка email
        if (!this.data.email || this.data.email.trim() === '') {
            errors.email = 'Email не указан';
        }
        
        // Проверка телефона
        if (!this.data.phone || this.data.phone.trim() === '') {
            errors.phone = 'Телефон не указан';
        }

        // Проверка адреса
        if (!this.data.address || this.data.address.trim() === '') {
            errors.address = 'Адрес не указан';
        }

        return {
            isValid: Object.keys(errors).length === 0,
            errors
        }
    }

    // Валидация отдельного поля
    validateField(field: keyof IBuyer): { isValid: boolean; error?: string } {
        const validation = this.validate();
        return {
            isValid: !validation.errors[field],
            error: validation.errors[field]
        }
    }
}
