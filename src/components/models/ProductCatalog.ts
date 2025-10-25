import { IProduct } from "../../types";
import { IEvents } from "../base/Events";

export class ProductCatalog {
    protected products: IProduct[] = [];
    protected selectedProduct: IProduct | null = null;

    constructor (
        protected events: IEvents
    ) {}

    // Сохранение массива товаров
    setProducts(products: IProduct[]): void {
        this.products = products;
        this.events.emit('catalog:changed');
    }

    // Получение массива товаров
    getProducts(): IProduct[] {
        return this.products;
    }

    // Получение товара по id
    getProductById(id: string): IProduct | undefined {
        return this.products.find(product => product.id === id);
    }

    // Сохранение товара для подробного отображения
    setSelectedProduct(product: IProduct): void {
        this.selectedProduct = product;
        this.events.emit('preview:changed', product);
    }

    // Получение товара для подробного отображения
    getSelectedProduct(): IProduct | null {
        return this.selectedProduct;
    }

    // Очистка выбранного товара
    clearSelectedProduct(): void {
        this.selectedProduct = null;
        this.events.emit('preview:changed');
    }
}