class Button extends HTMLButtonElement {
    constructor(id: string, text: string, classes: string[], action: () => void) {
        super();
        this.id = id;
        this.textContent = text;
        this.classList.add(...classes);
        this.addEventListener('click', action);
    }
}

customElements.define('custom-button', Button, { extends: 'button' });

export default Button;