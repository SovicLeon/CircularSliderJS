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

        // default options
        this._options = {
            color: 'red',
            minValue: 0,
            maxValue: 100,
            step: 10,
            radius: 100
        };

        // internal state
        this._value = this.minValue;
    }

    // called when the element is added to the DOM
    connectedCallback() {
        this.loadStyles();
    }

    // getter and setter for color
    get color() {
        return this._options.color;
    }

    set color(value) {
        this._options.color = value;
        this.render();
    }

    // getter and setter for minValue
    get minValue() {
        return this._options.minValue;
    }

    set minValue(value) {
        this._options.minValue = value;
        this.render();
    }

    // getter and setter for maxValue
    get maxValue() {
        return this._options.maxValue;
    }

    set maxValue(value) {
        this._options.maxValue = value;
        this.render();
    }

    // getter and setter for step
    get step() {
        return this._options.step;
    }

    set step(value) {
        this._options.step = value;
        this.render();
    }

    // getter and setter for radius
    get radius() {
        return this._options.radius;
    }

    set radius(value) {
        this._options.radius = value;
        this.render();
    }

    // getter and setter for value
    get value() {
        return this._value;
    }

    set value(newValue) {
        this._value = newValue;
        // event for getting updated value otside the element
        this.dispatchEvent(new CustomEvent('valueChange', { detail: newValue }));
    }

    // method to update options with an object
    setOptions(options) {
        this._options = { ...this._options, ...options };
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
        this.slider.style.width = `${this.radius}px`;
        this.slider.style.height = `${this.radius}px`;
        this.container.appendChild(this.slider);

        this.sliderinside = document.createElement('div');
        this.sliderinside.className = 'circular-slider-inside';
        this.slider.appendChild(this.sliderinside);

        this.slidercolor = document.createElement('div');
        this.slidercolor.className = 'circular-slider-color';
        this.slider.appendChild(this.slidercolor);

        this.knob = document.createElement('div');
        this.knob.className = 'knob';
        this.slider.appendChild(this.knob);

        let inside = false;
        let dragging = false;
        let click = false;

        this.sliderinside.addEventListener('mousedown', () => {
            inside = true;
        });

        this.knob.addEventListener('mousedown', () => {
            dragging = true;
        });

        document.addEventListener('mouseup', () => {
            inside = false;
            dragging = false;
            click = false;
        });

        this.slider.addEventListener('mousedown', (event) => {
            event.preventDefault();

            if (inside) return;

            click = true;

            this.setKnobPosition(event);
        });

        document.addEventListener('mousemove', (event) => {
            event.preventDefault();

            if (!dragging && !click) return;

            this.setKnobPosition(event);
        });

        this.sliderinside.addEventListener('touchstart', () => {
            inside = true;
        });

        this.knob.addEventListener('touchstart', () => {
            dragging = true;
        });

        document.addEventListener('touchend', () => {
            inside = false;
            dragging = false;
            click = false;
        });

        this.slider.addEventListener('touchstart', (event) => {
            event.preventDefault();

            if (inside) return;

            click = true;

            this.setKnobPosition(event);
        });

        document.addEventListener('touchmove', (event) => {
            if (!dragging && !click) return;

            this.setKnobPosition(event);
        });
    }

    setKnobPosition(event) {
        const rect = this.slider.getBoundingClientRect();

        const radius = rect.width / 2 - this.knob.getBoundingClientRect().width / 2 + 2;

        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        let mouseX;
        let mouseY;

        if (event.type == "touchmove" || event.type == "touchstart") {
            mouseX = event.touches[0].clientX;
            mouseY = event.touches[0].clientY;
        } else {
            mouseX = event.clientX;
            mouseY = event.clientY;
        }

        // get coordinates
        const dx = mouseX - centerX;
        const dy = mouseY - centerY;

        // calculate angle
        let angle = Math.atan2(dy, dx);
        angle = angle * (180 / Math.PI);

        // get angle from top center as beginning, clockwise
        let angleColor = angle + 90;
        if (angleColor < 0) {
            angleColor = angleColor + 360;
        }

        // set color gauge with angle
        this.slidercolor.style.background = `conic-gradient(${this.color} 0 ${angleColor}deg, transparent ${angleColor}deg)`;

        // set value
        this.value = (Math.round(Math.round((angleColor / 360) * (this.maxValue - this.minValue)) / this.step) * this.step) + this.minValue;

        // if value outside maxValue sets value to maxValue
        if (this.value > this.maxValue) this.value = this.maxValue;

        // convert negative angle to positive
        if (angle < 0) {
            angle = 360 + angle;
        }

        const newX = centerX + radius * Math.cos(angle * Math.PI / 180);
        const newY = centerY + radius * Math.sin(angle * Math.PI / 180);

        // set new knob position
        this.knob.style.left = `${newX - rect.left - this.knob.getBoundingClientRect().width / 2}px`;
        this.knob.style.top = `${newY - rect.top - this.knob.getBoundingClientRect().height / 2}px`;

        this.knob.style.transform = "none";
    }
}

// register custom element
customElements.define('circular-slider', CircularSlider);
