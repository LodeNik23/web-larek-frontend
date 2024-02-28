import {Component} from "../base/Component";
import {createElement, ensureElement} from "../../utils/utils";
import {EventEmitter} from "../base/events";
import {IBasketView} from "../../types";

export class Basket extends Component<IBasketView> {
    protected _list: HTMLElement;
    protected _price: HTMLElement;
    protected _button: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: EventEmitter) {
        super(container);

        this._list = ensureElement<HTMLElement>('.basket__list', this.container);
        this._price = this.container.querySelector('.basket__price');
        this._button = this.container.querySelector('.basket__button');

        if (this._button) {
            this._button.addEventListener('click', () => {
                events.emit('order:open');
            });
        }

        this.items = [];
        this._button.disabled = true;
    }

    set items(items: HTMLElement[]) {
        if (items.length) {
            this._list.replaceChildren(...items);
        } else {
            this._list.replaceChildren(createElement<HTMLParagraphElement>('p', {
                textContent: 'Корзина пуста'
            }));
        }
    }

 /*   set disabled(items: string[]) {
        if (items.length) {
            this.setDisabled(this._button, false);
        } else {
            this.setDisabled(this._button, true);
        }
    }
*/
    set total(price: number) {
        this.setText(this._price, `${price.toString()} синапсов`);;
    }
    buttonBlocked(isDisabled:boolean){
        this._button.disabled = isDisabled;
    }
}