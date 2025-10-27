import { ICardActions, IProduct } from "../../types";
import { categoryMap, CDN_URL } from "../../utils/constants";
import { ensureElement } from "../../utils/utils";
import { Card } from "./Card";

type CategoryKey = keyof typeof categoryMap;

export class CardPreview extends Card<IProduct> {
    protected imageElement: HTMLImageElement;
    protected categoryElement: HTMLElement;
    protected descriptionElement: HTMLElement;
    protected buttonElement: HTMLButtonElement; 
    protected CDN_URL = `${CDN_URL}`;

    constructor(container: 
        HTMLElement,
        actions?: ICardActions
    ) {
        super(container);
        
        this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);
        this.categoryElement = ensureElement<HTMLElement>('.card__category', this.container);
        this.descriptionElement = ensureElement<HTMLElement>('.card__text', this.container);
        this.buttonElement = ensureElement<HTMLButtonElement>('.card__button', this.container);
        
        if (actions?.onClick) {
			this.buttonElement.addEventListener('click', actions.onClick);
		}
    }

    set category(value: string) {
        this.categoryElement.textContent = value;
        for (const key in categoryMap) {
            this.categoryElement.classList.toggle(categoryMap[key as CategoryKey], key === value);
        }
    }
    
    set image(value: string) {
        this.setImage(this.imageElement, this.CDN_URL + `${value.slice(0, -3) + 'png'}`, this.title);
    }

    set description(value: string) {
        this.descriptionElement.textContent = String(value);
    }

    setButtonText(text: string): void {
        this.buttonElement.textContent = text;
    }

    setButtonDisabled(state: boolean): void {
        this.buttonElement.disabled = state;
    }
}
