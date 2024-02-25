import {Model} from "./base/Model";
import {FormErrors, IAppState, IProductItem, IDelivery, IContacts, IOrder} from "../types";

export type CatalogChangeEvent = {
    catalog: IProductItem[]
};


export class AppState extends Model<IAppState> {
    basket: IProductItem[]=[];
    catalog: IProductItem[];
    loading: boolean;
    order: IOrder = {
        payment: '',    
        address: '',
        email: '',
        phone: '',
        total: 0,  
        items: []
    };
    preview: string | null;
    formErrors: FormErrors = {};

    setPreview(item: IProductItem) {
        this.preview = item.id;
        this.emitChanges('preview:changed', item);
    }
    
    setItems(items: IProductItem[]) {
        this.catalog = items;
        this.emitChanges('items:changed', { catalog: this.catalog });
    }

    addItem(item: IProductItem){
        if(!this.basket.includes(item)){
            this.basket.push(item);
            this.updateBasket();
        }
    }

    removeItem(item: IProductItem) {
        this.basket = this.basket.filter((itm) => itm.id != item.id);
		this.updateBasket();               
    }

    updateBasket(){
        this.emitChanges('basket:changed', this.basket);
        this.emitChanges('counter:changed', this.basket);
    }

    cleanBasket() {
        this.basket = [];
        this.updateBasket();
    }

    cleanOrder() {
        this.order ={
            payment: '',    
            address: '',
            email: '',
            phone: '',
            total: 0,  
            items: []
        }
    }
 
    setDelivery(field: keyof IDelivery, value: string) {
        this.order[field] = value;

        if (this.validationDelivery()) {
            this.events.emit('delivery:ok', this.order);
        }
    }


    setContacts(field: keyof IContacts, value: string) {
        this.order[field] = value;
        if (this.validationContacts()) {
            this.events.emit('contacts:ok', this.order);            
        }
    }

    getTotal(): number {
		this.order.total = this.basket.reduce((a, b) => {
			return a + b.price;
		}, 0);
		return this.basket.reduce((a, b) => {
			return a + b.price;
		}, 0);
	}

    validationContacts(){
        const errors: typeof this.formErrors = {};
        if (!this.order.email) {
            errors.email = 'Необходимо указать email';
        }
        if (!this.order.phone) {
            errors.phone = 'Необходимо указать телефон';
        }
        this.formErrors = errors;
        this.events.emit('formErrors:change', this.formErrors);
        return Object.keys(errors).length === 0;
    }

    validationDelivery(){
        const errors: typeof this.formErrors = {};
        if (!this.order.address) {
            errors.address = 'Необходимо указать адрес';
        }

        this.formErrors = errors;
        this.events.emit('formErrors:change', this.formErrors);
        return Object.keys(errors).length === 0;
    }    
}

export const PayChange:{[key:string]:string}={
    card: 'online',
    cash: 'cash',
}