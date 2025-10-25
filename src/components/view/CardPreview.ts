import { ICardActions, IProduct } from "../../types";
import { categoryMap, CDN_URL, settings } from "../../utils/constants";
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

    set id(value: string) {
		this.container.dataset.id = value;
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

    set buttonText(value: string) {
        this.buttonElement.textContent = String(value);
    }

    set buttonDisabled(value: boolean) {
        this.buttonElement.disabled = value;
    }

    changeButton(price: number, inBasket: boolean): void {
		if (!price) {
			this.setText(this.buttonElement, settings.buyButtonValues.disabled);
			this.toggleButton(true);
		} else {
			if (inBasket) {
				this.setText(this.buttonElement, settings.buyButtonValues.delete);
			} else {
				this.setText(this.buttonElement, settings.buyButtonValues.add);
			}
		}
	}

	toggleButton(state: boolean) {
		this.setDisabled(this.buttonElement, state);
	}
}
