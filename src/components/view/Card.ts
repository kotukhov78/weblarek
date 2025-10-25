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
        if (this.titleElement) {
            this.titleElement.textContent = String(value);
        }
    }

    set price(value: number | null) {
        if (this.priceElement) {
            this.priceElement.textContent = `${value} синапсов`;
        }
    }
}