import { ICardActions } from "../../types";
import { ensureElement } from "../../utils/utils";
import { Card } from "./Card";

export type TCardBasket = {
	id?: string;
	title: string;
	price: number | null;
	index?: number;
}

export class CardBasket extends Card<Partial<TCardBasket>> {
    protected indexElement: HTMLElement;
    protected deleteButtonElement: HTMLButtonElement;

    constructor(
        container: HTMLElement, 
        actions?: ICardActions
    ) {
        super(container);
        
        this.indexElement = ensureElement<HTMLElement>('.basket__item-index', this.container);
        this.deleteButtonElement = ensureElement<HTMLButtonElement>('.basket__item-delete', this.container);
        


        if (actions?.onClick) {
			this.deleteButtonElement.addEventListener('click', actions.onClick);
		}
    }

    set index(value: number) {
        this.indexElement.textContent = String(value);
    }
}