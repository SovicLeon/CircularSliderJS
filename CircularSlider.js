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
        this.render();
    }

    // render the element
    render() {
        this.slider = document.createElement('div');
        this.slider.style.width = "200px";
        this.slider.style.height = "200px";
        this.slider.style.borderRadius = "50%";
        this.slider.style.backgroundColor = "red";
        this.container.appendChild(this.slider);
    }
}

// register custom element
customElements.define('circular-slider', CircularSlider);
