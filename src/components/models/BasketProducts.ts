import { IProduct } from "../../types";

export class BasketProducts {
    private items: IProduct[] = [];

    // Получение массива товаров, находящихся в корзине
    getItems(): IProduct[] {
        return this.items;
    }

    // Добавление товара в корзину
    addItem(product: IProduct): void {
        this.items.push(product);
    }

    // Удаление товара из корзины
    removeItem(productId: string): void {
        this.items = this.items.filter(item => item.id !== productId);
    }

    // Очистка корзины
    clearBasket(): void {
        this.items = [];
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

    // Получение индекса товара в корзине (вспомогательный метод)
    // private getItemIndex(productId: string): number {
    //     return this.items.findIndex(item => item.id === productId);
    // }
}