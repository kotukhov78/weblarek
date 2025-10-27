import { IBuyer } from "../../types";
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

interface IFormState {
	valid: boolean;
	errors: string[];
}

export abstract class Form<T> extends Component<IFormState> {
    protected submitButton: HTMLButtonElement;
    protected errorsForm: HTMLElement;

    constructor(
        container: HTMLFormElement, 
        protected events: IEvents
    ) {
        super(container);
        
        this.submitButton = ensureElement<HTMLButtonElement>('button[type="submit"]', this.container);
        this.errorsForm = ensureElement<HTMLElement>('.form__errors', this.container);

        this.container.addEventListener('input', (e: Event) => {
			const target = e.target as HTMLInputElement;
			const field = target.name as keyof IBuyer;
			const value = target.value;
			this.onInputChange(field, value);
		});

		this.container.addEventListener('submit', (e: Event) => {
			e.preventDefault();
			this.events.emit(`${this.container.getAttribute('name')}:submit`);
			console.log(`${this.container.getAttribute('name')}:submit`);
		});
    }

    protected onInputChange(field: keyof IBuyer, value: string) {
		this.events.emit('form:change', {
			field,
			value,
		});
	}

    set errors(value: string) {
		this.errorsForm.textContent = value;
	}

    set valid(value: boolean) {
        this.submitButton.disabled = !value;
    }

    render(state: Partial<T> & IFormState) {
		const { valid, errors, ...inputs } = state;
		super.render({ valid, errors });
		Object.assign(this, inputs);
		return this.container;
	}
}