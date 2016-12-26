import utility from './utility.js';

const errors = {
  logError ({
    msg = '',
    data = null,
    err = null,
    loc = '',
  }) {
    if (msg) utility.console('error')(msg);
    if (err) utility.console('error')(err);
    if (loc) utility.console('error')(loc);
    if (data) utility.console('dir', true)({ dataAssociatedWithError: data });
  }
}


export default errors;
