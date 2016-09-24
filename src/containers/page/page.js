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
        <ul className='navbar'>
          <li className='navitem'>
            <Link activeClassName='active' className='navlink' onlyActiveOnIndex={true} to={`/`} >Home</Link>
          </li>
          <li className='navitem'>
            <Link activeClassName='active' className='navlink' to={`/about`} >Not Found</Link>
          </li>
        </ul>
        {this.props.children}
      </div>
    );
  }
}

Page.propTypes = { children: React.PropTypes.node };

export default Page;
