class AmplitudeSlider extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        const min = this.getAttribute('min') || 0;
        const max = this.getAttribute('max') || 2;
        const step = this.getAttribute('step') || 0.1;

        this.shadowRoot.innerHTML = `
            <style>
                .slider, .input {
                    width: 100%;
                    display: inline-block;
                    margin: 10px 0;
                }
            </style>
            <input type="range" class="slider" min="${min}" max="${max}" step="${step}" value="1">
            <input type="number" class="input" min="${min}" max="${max}" step="${step}" value="1">
        `;

        this.slider = this.shadowRoot.querySelector('.slider');
        this.input = this.shadowRoot.querySelector('.input');

        // Sync slider and input
        this.slider.addEventListener('input', () => {
            this.input.value = this.slider.value;
            this.dispatchEvent(new CustomEvent('amplitudeChange', { detail: this.slider.value }));
        });
        this.input.addEventListener('input', () => {
            this.slider.value = this.input.value;
            this.dispatchEvent(new CustomEvent('amplitudeChange', { detail: this.input.value }));
        });
    }

    get value() {
        return parseFloat(this.slider.value);
    }
}

customElements.define('amplitude-slider', AmplitudeSlider);
