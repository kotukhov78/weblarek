import { IBuyer } from "../../types";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";
import { Form } from "./Form";

// email и телефон
// export type TContactsForm = Pick<TOrder, 'email' | 'phone'>;

export class ContactsForm extends Form<Partial<IBuyer>> {
    protected emailInput: HTMLInputElement;
    protected phoneInput: HTMLInputElement;

    constructor(
        container: HTMLFormElement, 
        protected events: IEvents
    ) {
        super(container, events);
        
        this.emailInput = ensureElement<HTMLInputElement>('input[name="email"]', this.container);
        this.phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', this.container);
    }

    set email(value: string) {
        this.emailInput.textContent = String(value);
    }

    set phone(value: string) {
        this.phoneInput.textContent = String(value);
    }
}