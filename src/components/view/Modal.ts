import { ICardActions } from "../../types";
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";

export type TModal = {
    content: HTMLElement;
}

export class Modal extends Component<TModal> {
    protected closeButton: HTMLButtonElement;
    protected contentModal: HTMLElement;
    protected scrollPosition: number = 0;

    constructor(
        container: HTMLElement, 
        actions?: ICardActions
    ) {
        super(container);
        
        this.closeButton = ensureElement<HTMLButtonElement>('.modal__close', this.container);
        this.contentModal = ensureElement<HTMLElement>('.modal__content', this.container);
        
        if (actions?.onClick) {
            this.container.addEventListener('click', actions.onClick);
        }

        this.closeButton.addEventListener('click', () => {
            this.close();
        });
        
        this.container.addEventListener('click', (event) => {
            if (event.target === this.container) {
                this.close();
            }
        });
    }

    open() {
        // Сохраняем текущую позицию скролла
        this.scrollPosition = window.pageYOffset;
        
        // Блокируем прокрутку
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.top = `-${this.scrollPosition}px`;
        document.body.style.width = '100%';

        // активация модального окна
		this.container.classList.toggle('modal_active', true);
	}

	close() {
        // Восстанавливаем прокрутку
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        
        // Восстанавливаем позицию скролла
        window.scrollTo(0, this.scrollPosition);

        // деактивация модального окна
		this.container.classList.toggle('modal_active', false);
	}

    set content(value: HTMLElement) {
        this.contentModal.replaceChildren(value);
    }

    render(data: TModal): HTMLElement {
		super.render(data);
		this.open();
		return this.container;
	}

    setMaxHeight(maxHeight: string = '80vh') {
        this.contentModal.style.maxHeight = maxHeight;
    }

    enableScroll() {
        this.contentModal.style.overflowY = 'auto';
    }
}