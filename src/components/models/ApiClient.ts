import { IApi, IProduct, TOrder, TProductsResponse } from "../../types";

export class ApiClient {
    private baseApi: IApi;

    constructor(baseApi: IApi) {
        this.baseApi = baseApi;
    }

    async getProductList(): Promise<IProduct[]> {
        try {
            console.log('Запрос списка товаров c сервера...');
            const response = await this.baseApi.get<TProductsResponse>('/product/');
            console.log('Список товаров успешно получен: ', response.items.length, 'товаров');
            return response.items;
        } catch (error) {
            console.error('Ошибка при получении списка товаров: ', error);
            throw error;
        }
    }

    async submitOrder(orderData: TOrder): Promise<TOrder> {
        try {
            console.log('Отправка заказа на сервер...', orderData);
            const result = await this.baseApi.post<TOrder>('/order/', orderData);
            console.log('Заказ успешно оформлен. ID:', result.id, 'Сумма:', result.total);
            return result;
        } catch (error) {
            console.error('Ошибка при оформлении заказа:', error);
            throw error;
        }
    }
}