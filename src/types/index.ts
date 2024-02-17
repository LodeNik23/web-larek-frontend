export interface IProductItem {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: string | number
}

export interface IAppState {
    catalog: IProductItem[];
    basket: IProductItem[];
    preview: string | null;
    order: IOrder | null;
    loading: boolean;
}

export interface IDelivery {    
    payment: string;    
    adress: string;
}

export interface IContacts {    
    email: string;    
    phone: string;
}

export interface IOrder extends IDelivery, IContacts { 
    total: number;   
    items: string[];
}

export type FormErrors = Partial<Record<keyof IOrder, string>>;

export interface IOrderResult {
    id: string;
}