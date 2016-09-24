import React, { Component } from 'react';
import './notfound.css';

class notfound extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <div className='notfound'>Sorry we could not find that route</div>;
  }
}

export default notfound;
