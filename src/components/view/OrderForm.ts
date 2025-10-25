import { IBuyer, TOrder } from "../../types";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";
import { Form } from "./Form";

// метод оплаты и адрес пользователя

export type TOrderForm = Pick<TOrder, 'payment' | 'address'>;

export class OrderForm extends Form<Partial<TOrderForm>> {
    protected paymentButtonCard: HTMLButtonElement;
    protected paymentButtonCash: HTMLButtonElement;

    constructor(
        container: HTMLFormElement,
        protected events: IEvents
    ) {
        super(container, events);
        
        this.paymentButtonCard = ensureElement<HTMLButtonElement>('button[name="card"]', this.container);
        this.paymentButtonCash = ensureElement<HTMLButtonElement>('button[name="cash"]', this.container);
        
        this.paymentButtonCard.addEventListener('click', () => {
			this.toggleCard();
		});

		this.paymentButtonCash.addEventListener('click', () => {
			this.toggleCash();
		});

        this.container.addEventListener('input', (e: Event) => {
			const target = e.target as HTMLInputElement;
			const field = target.name as keyof TOrderForm;
			const value = target.value;
			this.onInputChange(field, value);
		});

		this.container.addEventListener('submit', (e: Event) => {
			e.preventDefault();
			this.events.emit('orderForm:submit');
		});
    }

    protected onInputChange(field: keyof IBuyer, value: string) {
		this.events.emit('orderFormInput:change', {
			field,
			value,
		});
	}

    set address(value: string) {
		(this.container.elements.namedItem('address') as HTMLInputElement).value = value;
	}

	set payment(value: 'card' | 'cash') {
		if (value) {
			this.toggleClass(
				this.container.elements.namedItem(value) as HTMLButtonElement,
				'button_alt-active',
				true
			);
		} else {
			this.toggleClass(this.paymentButtonCard, 'button_alt-active', false);
			this.toggleClass(this.paymentButtonCash, 'button_alt-active', false);
		}
	}

	toggleCard() {
		this.toggleClass(this.paymentButtonCard, 'button_alt-active', true);
		this.toggleClass(this.paymentButtonCash, 'button_alt-active', false);
		this.onInputChange('payment', this.paymentButtonCard.name);
	}

	toggleCash() {
		this.toggleClass(this.paymentButtonCash, 'button_alt-active', true);
		this.toggleClass(this.paymentButtonCard, 'button_alt-active', false);
		this.onInputChange('payment', this.paymentButtonCash.name);
	}
}