import { IBuyer, IValidationErrors, TPayment } from "../../types";

export class Buyer {
    private data: Partial<IBuyer> = {};

    // Сохранение данных покупателя (общий метод)
    setData(data: Partial<IBuyer>): void {
        this.data = { ...this.data, ...data };
    }

    // Сохранение только способа оплаты
    setPayment(payment: TPayment): void {
        this.data.payment = payment;
    }

    // Сохранение только email
    setEmail(email: string): void {
        this.data.email = email;
    }

    // Сохранение только телефона
    setPhone(phone: string): void {
        this.data.phone = phone;
    }

    // Сохранение только адреса
    setAddress(address: string): void {
        this.data.address = address;
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