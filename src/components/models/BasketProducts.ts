import { IProduct } from "../../types";
import { IEvents } from "../base/Events";

export class BasketProducts {
    protected items: IProduct[] = [];
    protected total: number;

    constructor (
        protected events: IEvents
    ) {
        this.total = 0;
    }    
    
    // Получение массива товаров, находящихся в корзине
    getItems(): IProduct[] {
        return this.items;
    }

    // Добавление товара в корзину
    addItem(product: IProduct): void {
        this.items.push(product);
        this.events.emit('basket:changed');
    }

    // Удаление товара из корзины
    removeItem(productId: string): void {
        this.items = this.items.filter(item => item.id !== productId);
        this.events.emit('basket:changed');
    }

    // Очистка корзины
    clearBasket(): void {
        this.items = [];
        this.events.emit('basket:changed');
    }

    // Получение общей стоимости товаров в корзине
    getTotalPrice(): number {
        return this.items.reduce((total, item) => {
            return total + (item.price || 0);
        }, 0);
    }

    // Получение количества товаров в корзине
    getItemsCount(): number {
        return this.items.length;
    }

    // Проверка наличия товаров в корзине по id
    hasItem(productId: string): boolean {
        return this.items.some(item => item.id === productId);
    }
}