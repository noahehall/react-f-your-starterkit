import React from 'react';
var Link = require('react-router').Link

import styles from './page.css';

export default class Page extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="page">
        <Link to={`/about`}>About</Link>
        <Link to={`/`}>Home</Link>
        {this.props.children}
      </div>
    );
  }
}
