export const setPreviousElementError = (el) =>
  el.previousSibling.firstElementChild.innerHTML = `${el.validationMessage}<br />${el.title}`;

export const clearPreviousElementError = (el) =>
  el.previousSibling.firstElementChild.innerHTML = el.validationMessage;

export const setFirstChildElementError = (el, msg = false) => {
  const thisEl = el.querySelector('.error');
  thisEl.innerHTML = msg || 'Please correct all errors before continuing';
};

export const clearFirstChildElementError = (el, msg = false) => {
  const thisEl = el.querySelector('.error');
  thisEl.innerHTML = msg || '';
};

export const checkValidOnBlur = (e, setError = false) => {
  const el = e.currentTarget;
  if (el.willValidate && !el.validity.valid) {
    el.className = 'has-error';
    if (setError) setPreviousElementError(el);

    return false;
  }

  el.className = '';
  if (setError) clearPreviousElementError(el);

  return true;
};
