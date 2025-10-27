import { settings } from "../../utils/constants";
import { createElement, ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

interface IBasket {
    items: HTMLElement[];
    total: number;
}

export class Basket extends Component<IBasket> {
    protected basketList: HTMLElement;
    protected basketTotal: HTMLElement;
    protected basketButton: HTMLButtonElement;

    constructor(
        container: HTMLElement, 
        protected events: IEvents
    ) {
        super(container);
        
        this.basketList = ensureElement<HTMLElement>('.basket__list', this.container);
        this.basketTotal = ensureElement<HTMLElement>('.basket__price', this.container);
        this.basketButton = ensureElement<HTMLButtonElement>('.basket__button', this.container);

        this.basketButton.addEventListener('click', () => {
			this.events.emit('orderForm:open');
		});
    }

    set items(items: HTMLElement[]) {
		if (items.length) {
			this.basketList.replaceChildren(...items);
			this.toggleButton(false);
		} else {
			this.basketList.replaceChildren(
				createElement<HTMLParagraphElement>('p', {
					textContent: settings.basket.empty,
				})
			);
			this.toggleButton(true);
		};
	}

    protected toggleButton(state: boolean) {
		this.basketButton.disabled = state;
	}

    set total(value: number) {
        this.basketTotal.textContent = String(`${value} ${settings.currency}`);
    }
}