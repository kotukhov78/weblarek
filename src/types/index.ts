export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

export type TPayment = 'online' | 'cash' | '';
export type FormErrors = Partial<Record<keyof TOrder, string>>;

// Интерфейс товара
export interface IProduct {
    id: string;
    title: string;
    image: string;
    price: number | null;
    description: string;
    category: string;
}

// Интерфейс покупателя
export interface IBuyer {
    payment: TPayment;
    email: string;
    phone: string;
    address: string;
}

// Интерфейс для ошибок валидации
export interface IValidationErrors {
    payment?: string;
    email?: string;
    phone?: string;
    address?: string;
}

// Тип для get запроса на получение списка карточек
export type TProductsResponse = {
    total: number;
    items: IProduct[];
}

// Тип для post запросов
export type TOrder = {
    payment: TPayment;
    email: string;
    phone: string;
    address: string;
    total: number;
    items: string[]; // массив id товаров
    id?: string;
}

export interface ICardActions {
    onClick?: (event: MouseEvent) => void;
}

