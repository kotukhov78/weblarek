import { IProduct } from "../../types";

export class ProductCatalog {
    private products: IProduct[] = [];
    private selectedProduct: IProduct | null = null;

    // Сохранение массива товаров
    setProducts(products: IProduct[]): void {
        this.products = products;
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
    }

    // Получение товара для подробного отображения
    getSelectedProduct(): IProduct | null {
        return this.selectedProduct;
    }

    // Очистка выбранного товара
    clearSelectedProduct(): void {
        this.selectedProduct = null;
    }
}