export interface IProductItem {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
}

export interface IAppState {
    catalog: IProductItem[];
    basket: IProductItem[];
    preview: string | null;
    delivery: IDelivery| null;
    contact: IContacts | null;
    order: IOrder | null;
    loading: boolean;
}

export interface IDelivery {    
    payment: string;    
    address: string;
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
    total: number;
}

export interface ICard extends IProductItem{
    titleBtn?:string;
    index?:string;
}

export interface ICardActions {
    onClick: (event: MouseEvent) => void;
}

export interface IFormState {
    valid: boolean;
    errors: string[];
}

export interface IBasketView {
    items: HTMLElement[];
    total: number;
//    selected: string[];
}