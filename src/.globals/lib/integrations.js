import sortTable from './thirdparty/sorttable.js';
import _ from 'lodash';
import filterTable from './thirdparty/filtertable.js';

const integrations = {
  _,
  sortTable,
  filterTable,
  rollbar (type = 'reportMessage', env = 'client') {
    if (typeof XMLHttpRequest !== undefined) {

      if (!this.rb) {
        this.rb = require('rollbar');
        this.rb.init(appConsts.rollbarKeyClient);
      }

      if (this.rb[type]) return this.rb[type];
    }

    return (f) => {null};
  },
}

export default integrations;
