import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";

export abstract class Card<T> extends Component<T> {
    protected titleElement: HTMLElement;
    protected priceElement: HTMLElement;

    constructor(container: HTMLElement) {
        super(container);
        this.titleElement = ensureElement<HTMLElement>('.card__title', this.container);
        this.priceElement = ensureElement<HTMLElement>('.card__price', this.container);
        
    }

    set title(value: string) {
        this.titleElement.textContent = String(value);
    }

    set price(value: number) {
		let priceText = '';
		if (!value) {
			priceText = `Бесценно`;
		} else {
			priceText = `${value} синапсов`;
		}
		this.priceElement.textContent = priceText;
	}
}