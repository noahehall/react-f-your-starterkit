const dom = {
  /**
   * inserts a child textNode into the previous element, based on the current elements validationMessage and title properties
   * @method setPreviousElementError
   * @param  {HTMLElement} el an element with a validationMessage and title property
   * @returns {HTMLElement} Error message with string
   */
  setPreviousElementError (el) {
    return el.previousSibling.firstElementChild.innerHTML = `${el.validationMessage}<br />${el.title}`;
  },

  /**
   * inserts a child textNode into an element, based on another elements validationMessage
   * @method clearPreviousElementError
   * @param  {[type]}                  el [description]
   * @return {[type]}                  [description]
   */
  clearPreviousElementError (el) {
    return el.previousSibling.firstElementChild.innerHTML = el.validationMessage;
  },

  /**
   * Inserts a text node into a child element
   * @method setFirstChildElementError
   * @param  {HTMLElement} el the parent element
   * @param  {Boolean} [msg=false] the message to set
   */
  setFirstChildElementError (el, msg = false) {
    return el.querySelector('.error').innerHTML = msg || 'Please correct all errors before continuing';
  },

  /**
   * Inserts a text node into a child element
   * @method clearFirstChildElementError
   * @param  {HTMLElement} el the parent element
   * @param  {Boolean} [msg=false] the message to enter
   * @return {[type]} [description]
   */
  clearFirstChildElementError (el, msg = false) {
    return el.querySelector('.error').innerHTML = msg || '';
  },

  /**
   * Check if an element is valid on blur
   * @method checkValidOnBlur
   * @param  {HTMLElement}         e                The element to
   * @param  {Boolean}        [setError=false] Whether to set an error message or ignore
   * @return {[type]}         [description]
   */
  checkValidOnBlur (e, setError = false) {
    const el = e.currentTarget;

    if (el.willValidate && !el.validity.valid) {
      el.className = 'has-error';
      if (setError) setPreviousElementError(el);

      // TODO: check if we can return true for training
      return false;
    }

    el.className = '';
    if (setError) clearPreviousElementError(el);

    return true;
  },

  /**
   * set innner html and data attribute
   * @method setNextInnerHtml
   * @param  {[type]}         el   [description]
   * @param  {[type]}         data [description]
   * @param  {[type]}         str  [description]
   */
  setNextInnerHtml (el, abbr, str) {
    if (!el) return false;

    const thisEl = el.nextElementSibling;
    if (!abbr) {
      thisEl.innerHTML = '';
      thisEl.dataset.abbr = '';
      thisEl.className = 'more-info sike';

      return false;
    }

    thisEl.dataset.abbr = abbr;
    thisEl.innerHTML = str || 'more';
    thisEl.className = 'more-info';

    return thisEl;
  },
}

export default dom;
