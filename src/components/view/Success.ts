import { ICardActions } from "../../types";
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";

interface ISuccess {
    total: number;
}

export class Success extends Component<ISuccess> {
    protected closeButton: HTMLButtonElement;
    protected description: HTMLElement;

    constructor(
        container: HTMLElement, 
        actions?: ICardActions
    ) {
        super(container);
        
        this.closeButton = ensureElement<HTMLButtonElement>('.order-success__close', this.container);
        this.description = ensureElement<HTMLElement>('.order-success__description', this.container);
        
        if (actions?.onClick) {
			this.closeButton.addEventListener('click', actions.onClick);
		}
    }

    set total(value: number) {
        this.description.textContent = String(`Списано ${value} синапсов`);
    }
}