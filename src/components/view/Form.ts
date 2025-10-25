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
    }

    set errors(value: string) {
		this.setText(this.errorsForm, value);
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