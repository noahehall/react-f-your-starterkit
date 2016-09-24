import React, { Component } from 'react';
import { Link } from 'react-router';
import './page.css';

class Page extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="page">
        <Link to={`/`}>Home</Link>
        {this.props.children}
      </div>
    );
  }
}

Page.propTypes = { children: React.PropTypes.node };

export default Page;
