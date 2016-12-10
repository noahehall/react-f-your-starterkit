const integrations = {
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
