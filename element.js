var UTIL = (function(namesp) {

    var sub = namesp.string = namesp.string || {};

    const COLOR = {
        RED: 'red',
        CYAN: '#00FFFF',
        GRAY: 'rgb(169,169,169)',
        ORANGE: 'rgb(255, 127, 80)'
    }

    const ELEMENT_POSITION = {
        BEFORE_BEGIN: 'beforebegin',
        AFTER_BEGIN: 'afterbegin',
        BEFORE_END: 'beforeend',
        AFTER_END: 'afterend'
    }

    const KibanaElement = function(element) {
        this.type = element.type;
        this.text = element.text;
        this.css = element.css;
        this.className = element.className;
        this.id = element.id;
    }

    KibanaElement.prototype.createElement = function() {
        const htmlElement = document.createElement(this.type);
        htmlElement.textContent = this.text;
        htmlElement.style.cssText = this.css;
        htmlElement.className = this.className;
        htmlElement.id = this.id;
        this.htmlElement = htmlElement;
        return this;
    }

    KibanaElement.prototype.toggleState = function(state) {
        if (state === 'enabled') {
            this.htmlElement.style.backgroundColor = COLOR.ORANGE;
            this.htmlElement.disabled = false;
        } else {
            this.htmlElement.style.backgroundColor = COLOR.GRAY;
            this.htmlElement.disabled = true;
        }
    }

    KibanaElement.prototype.insertElementAdjacentTo = function(existingElement, position) {
        existingElement.insertAdjacentElement(position, this.htmlElement);
        return this;
    }

    KibanaElement.prototype.attachListener = function(event = 'click', callback) {
        this.htmlElement.addEventListener(event, callback);
        return this;
    }

    sub.KibanaElement = KibanaElement;
    sub.ELEMENT_POSITION = ELEMENT_POSITION;
    sub.COLOR = COLOR;

    return namesp;

}(UTIL || {}));