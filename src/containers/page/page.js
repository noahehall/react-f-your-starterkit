import React from 'react';
var Link = require('react-router').Link

import styles from './page.css';

export default class PageContainer extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="page">
        <Link to={`/about`}>About</Link>
        <Link to={`/`}>Home</Link>
        <div>hello noah</div>
      </div>
    );
  }
}

//{this.props.children}
