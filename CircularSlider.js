// Define the custom element class
class CircularSlider extends HTMLElement {
    constructor() {
        super();

        // shadow DOM
        this.attachShadow({ mode: 'open' });

        // container for the element
        this.container = document.createElement('div');
        this.container.className = 'container';
        this.shadowRoot.appendChild(this.container);
    }

    // called when the element is added to the DOM
    connectedCallback() {
        this.loadStyles();
        this.render();
    }

    // load external styles
    loadStyles() {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'CircularSlider.css';
        this.shadowRoot.appendChild(link);
    }

    // render the element
    render() {
        this.slider = document.createElement('div');
        this.slider.className = 'circular-slider';
        this.container.appendChild(this.slider);

        this.knob = document.createElement('div');
        this.knob.className = 'knob';
        this.slider.appendChild(this.knob);
    }
}

// register custom element
customElements.define('circular-slider', CircularSlider);
