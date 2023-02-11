let restartCount = 0;
let pressedLetters = [];
let isScrollingByCode = false;
const className = '.search_input';

/**
 * Searches for an input element, if input doesn't exist then function called again after 1sec.
 * Max count of function calls - 3.
 * @returns { Promise<HTMLInputElement | undefined> } Recursive promise function that returns HTMLInputElement of our Input or undefined.
 */
const defineElements = () => {
    return new Promise((resolve, reject) => {
        if (typeof window === 'undefined') {
            return resolve(false);
        }

        const inputElement = document.querySelector(className);
        if (inputElement) {
            return resolve(inputElement);
        }

        if (++restartCount >= 3) {
            return resolve(false);
        }

        setTimeout(() => {
            resolve(defineElements());
        }, 1000);
    });
};


/**
 * Function that updates text of given inputElement with given text.
 * @param {HTMLInputElement} inputElement
 * @param {string} text
 */
const triggerInputFocus = (inputElement, text) => {
    inputElement.value += text;
    inputElement.focus();
}

/**
 * Function that triggers page scroll to the inputElement or focus the inputElement if page has already been scrolled.
 * @param {HTMLInputElement} inputElement
 * @param {string} key
 */
const triggerScroll = (inputElement, key) => {
    if (window.scrollY === 0) {
        return triggerInputFocus(inputElement, key);
    }

    pressedLetters.push(key);

    if (isScrollingByCode) {
        return;
    }

    isScrollingByCode = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });
}


/** Entry point of our logic. */
const start = async () => {
    const inputElement = await defineElements();
    if (!inputElement) {
        return console.log('%cCannot find necessary input HTMLElement.', 'color: red; margin: 6px 15px; font-size: 18px;');
    }

    document.addEventListener('keypress', (event) => {
        if (document.activeElement === inputElement && (window.scrollY === 0 || event.key === 'Enter')) {
            return;
        }

        event.preventDefault();
        triggerScroll(inputElement, event.key);
    });

    // Focus the input after end of smooth scroll.
    document.addEventListener('scroll', () => {
        if (!isScrollingByCode || window.scrollY) { return; }

        triggerInputFocus(inputElement, pressedLetters.join(''));
        isScrollingByCode = false;
        pressedLetters = [];
    });
}

start();
