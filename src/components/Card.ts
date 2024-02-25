import {Component} from "./base/Component";
import {ICard, ICardActions} from "../types";
import {ensureElement} from "../utils/utils";

console.log(`.card__title`);

export class Card extends Component<ICard> {
    protected _title: HTMLElement;
    protected _image?: HTMLImageElement;
    protected _description?: HTMLElement;
    protected _button?: HTMLButtonElement;
    protected _category?: HTMLElement;
    protected _price: HTMLElement;
    protected _index?: HTMLElement;
    protected _titleBtn?: string;


    constructor(container: HTMLElement, actions?: ICardActions) {
        super(container);

        this._title = ensureElement<HTMLElement>(`.card__title`, container);
        this._image = ensureElement<HTMLImageElement>(`.card__image`, container);
        this._button = container.querySelector(`.card__button`);
        this._description = container.querySelector(`.card__text`);
        this._category = container.querySelector(`.card__category`);
        this._price = container.querySelector(`.card__price`);
        this._index = container.querySelector(`.basket__item-index`);

        if (actions?.onClick) {
            if (this._button) {
                this._button.addEventListener('click', actions.onClick);
            } else {
                container.addEventListener('click', actions.onClick);
            }
        }
    }

    set titleBtn(value: string){
        if(this._button){
            this._button.textContent=value;
        }
    }
        
    disableBtn(value:number | null){
        if(!value) {
            if(this._button){
                this._button.disabled=true;
            }
        }
    }
    

    set id(value: string) {
        this.container.dataset.id=value;
    }    

    get id(): string {
        return this.container.dataset.id || '';
    }


    set title(value: string) {
        this.setText(this._title, value);
    }
    
    get title(): string {
        return this._title.textContent || '';
    }

    set image(value: string) {
        this.setImage(this._image, value, this.title)
    }
    
    set description(value: string | string[]) {
        if (Array.isArray(value)) {
            this._description.replaceWith(...value.map(str => {
                const descTemplate = this._description.cloneNode() as HTMLElement;
                this.setText(descTemplate, str);
                return descTemplate;
            }));
        } else {
            this.setText(this._description, value);
        }
    };
   


    set category(value: string) {
		if (value === 'софт-скил') {
			this._category.classList.add('card__category_soft');
		} else if (value === 'другое') {
			this._category.classList.add('card__category_other');
		} else if (value === 'дополнительное') {
			this._category.classList.add('card__category_optional');
		} else if (value === 'кнопка') {
			this._category.classList.add('card__category_button');
		} else if (value === 'хард-скил') {
			this._category.classList.add('card__category_hard');
		}


		this.setText(this._category, value);
	}

	get category(): string {
		return this._category.textContent || '';
	}

    set price(value: number | null){
        this.setText(this._price, value?`${value.toString()} синапсов`: 'Бесценно');
        this.disableBtn(value);
    };

    get price():number{
        return Number (this._price.textContent || '');
    };

    set index(value: string) {
        this._index.textContent=value;
    };
    
    get index(): string {
        return this._index.textContent || '';
    };
}


