import { IBuyer, TOrder } from "../../types";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";
import { Form } from "./Form";

// email и телефон
export type TContactsForm = Pick<TOrder, 'email' | 'phone'>;

export class ContactsForm extends Form<Partial<TContactsForm>> {
    protected emailInput: HTMLInputElement;
    protected phoneInput: HTMLInputElement;

    constructor(
        container: HTMLFormElement, 
        protected events: IEvents
    ) {
        super(container, events);
        
        this.emailInput = ensureElement<HTMLInputElement>('input[name="email"]', this.container);
        this.phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', this.container);

        this.container.addEventListener('input', (e: Event) => {
			const target = e.target as HTMLInputElement;
			const field = target.name as keyof TContactsForm;
			const value = target.value;
			this.onInputChange(field, value);
		});

		this.container.addEventListener('submit', (e: Event) => {
			e.preventDefault();
			this.events.emit('contacts:submit');
		});
    }

    protected onInputChange(field: keyof IBuyer, value: string) {
		this.events.emit('contactsFormInput:change', {
			field,
			value,
		});
	}

    set email(value: string) {
        this.emailInput.textContent = String(value);
    }

    set phone(value: string) {
        this.phoneInput.textContent = String(value);
    }
}