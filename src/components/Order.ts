import {Form} from "./common/Form";
import {IContacts, IDelivery, ICardActions} from "../types";
import {IEvents} from "./base/events";
import {ensureElement} from "../utils/utils";

export class Contacts extends Form<IContacts> {
    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);
    }

    set phone(value: string) {
        (this.container.elements.namedItem('phone') as HTMLInputElement).value = value;
    }

    set email(value: string) {
        (this.container.elements.namedItem('email') as HTMLInputElement).value = value;
    }
}

export class Delivery extends Form<IDelivery> {

    protected _cardBtn: HTMLButtonElement;
    protected _cashBtn: HTMLButtonElement;

    constructor(container: HTMLFormElement, events: IEvents, actions?: ICardActions) {
        super(container, events);
    

        this._cardBtn = ensureElement<HTMLButtonElement>('button[name="card"]', this.container);    
        this._cashBtn = ensureElement<HTMLButtonElement>('button[name="cash"]', this.container);
        
        if(this._cardBtn && this._cashBtn){
            this._cardBtn.classList.add('button_alt-active');
        }

        if(actions?.onClick){
            this._cardBtn.addEventListener('click',actions.onClick);
            this._cashBtn.addEventListener('click',actions.onClick);
        }
        else{
            console.error('Не найдена кнопка')
        }
    }
    toggleButton(target:HTMLElement){
        this._cardBtn.classList.toggle('button_alt-active');
        this._cashBtn.classList.toggle('button_alt-active');
    }

    set address(value: string) {
		(this.container.elements.namedItem('address') as HTMLInputElement).value = value;
	}
}