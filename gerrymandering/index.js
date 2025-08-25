import { LitElement, html, css }
    from 'https://unpkg.com/lit-element/lit-element.js?module';

class ElectionDistrict extends LitElement {

    static get properties() {
        return {
            bias: { type: Number },
            outcome: { type: Number },
            showBias: { 
                type: Boolean
            }
        }
    }

    static get styles() {
        return css`
        .district-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
        }
        .district {
            display: inline-block;
            width: var(--district-size, 60px);
            min-height: var(--district-size, 60px);
            aspect-ratio: 1/1;
            color: white;
            font-size: 15px;
            font-weight: bold;
            text-align: center;
            line-height: var(--district-size, 60px);
            border-radius: calc(var(--district-size, 60px) / 6);
            border: none;
            transition: all 0.3s ease var(--delay, 0s);   
            background-image: repeating-linear-gradient(45deg, currentColor 0, currentColor var(--bias-width), transparent 0, transparent 50%);
            background-size: calc(var(--district-size, 60px) / 6) calc(var(--district-size, 60px) / 6); 
                    
        }
        .rep {
            background-color: var(--rep-color, #ff0000);
        }
        .dem {
            background-color: var(--dem-color, #0000ff);
        }
        .tossup {
            background-color: var(--tossup-color, #808080);
        }
        `
    }

    constructor() {
        super()
        this.bias = 0
        this.outcome = 0
        this.showBias = false
    }

    get swingMagnitude() {
        return Math.abs(this.bias).toFixed(0)
    }

    get swingCode() {
        if (this.swingMagnitude > 0) {
            if (this.bias > 0) {
                return 'R'
            } else {
                return 'D'
            }
        } else {
            return 'T'
        }
    }
    get outcomeCode() {
        return this.outcome + this.bias > 0 ? 'R' : 'D'
    }
    get swingClass() {
        const classes = {
            'R': 'rep',
            'D': 'dem',
            'T': 'tossup'
        }
        return classes[this.swingCode]
    }

    get biasWidth() {
        const normalizedBias = Math.abs(this.bias)
        
        if (normalizedBias > 20) {
            return 0 // 0% transparent = 100% filled for high bias
        } else if (normalizedBias <= 1) {
            return 25 // 25% transparent = 75% filled for low bias
        } else {
            // Linear scale from 25% transparent at bias=1 to 0% transparent at bias=20
            const slope = (25 - 0) / (20 - 1)
            return 25 - slope * (normalizedBias - 1)
        }
    }

    get outcomeClass() {
        const classes = {
            'R': 'rep',
            'D': 'dem',
            'T': 'tossup'
        }
        return classes[this.outcomeCode]
    }

    render() {
        return html`
        <div class="district-container">
            <div class="district ${this.outcomeClass}" style="${this.showBias ? `--bias-width: ${this.biasWidth}%` : ''}">
                ${false && this.showBias ? this.swingCode: ''}${false &&this.showBias && this.swingMagnitude > 0 ? `+${this.swingMagnitude}` : ''}
            </div>
        </div>
        `
    }
}

customElements.define('election-district', ElectionDistrict);


class ElectionList extends LitElement {

    static get styles() {
        return css`
        .district-container {
            display: flex;
            flex-direction: var(--election-list-flex-direction, row);
            align-items: var(--election-list-align-items, center);
            justify-content: var(--election-list-justify-content, center);
            flex-wrap: var(--election-list-flex-wrap, nowrap);
            gap: var(--election-list-gap, 0);
        }
        `
    }
    static get properties() {
        return {
            biases: { type: Array },
            outcomes: { type: Array },
            showBias: { type: Boolean }
        }
    }
    constructor() {
        super()
        this.biases = []
        this.outcomes = []
        this.showBias = false
    }
    render() {
        return html`
            <div class="district-container" part="container">
                ${this.biases?.map((val, idx) => html`<election-district key=${idx} bias=${this.biases?.[idx] || 0} outcome=${this.outcomes?.[idx] || 0} ?showBias=${this.showBias}></election-district>`)}
            </div>
        `;
    }
}

customElements.define('election-list', ElectionList);