import {Component} from "../base/Component";
import {ensureElement} from "../../utils/utils";

export interface ISuccess {
    total: number;
}

interface ISuccessActions {
    onClick: () => void;
}

export class Success extends Component<ISuccess> {
    protected _close: HTMLElement;
    protected _descriptionTotl: HTMLElement;


    constructor(container: HTMLElement, actions: ISuccessActions) {
        super(container);

        this._close = ensureElement<HTMLElement>('.order-success__close', this.container);
        this._descriptionTotl = ensureElement<HTMLElement>('.order-success__description', this.container);

        if (actions?.onClick) {
            this._close.addEventListener('click', actions.onClick);
        }
    }

    set descriptionTotl(value:string){
        this._descriptionTotl.textContent='Списано ${value} синапсов';
    }
}