import { IProduct } from "../../types";
import { Component } from "../base/Component";

export class Gallery extends Component<IProduct> {
    protected items: HTMLElement;

    constructor(
        container: HTMLElement
    ) {
        super(container);
        this.items = this.container;
    };

    set catalog(cards: HTMLElement[]) {
        this.items.replaceChildren(...cards);
    }
}