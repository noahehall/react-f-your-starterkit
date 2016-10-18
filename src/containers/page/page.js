import React from 'react';
import { Link } from 'react-router';
import Helmet from 'react-helmet';

import styles from './page.css';

class Page extends React.Component {
  static propTypes = {
    children: React.PropTypes.node
  }

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className='page'>
        <Helmet
          htmlAttributes={{lang: 'en'}}
          meta={[
            {content: "React F Your Starterkit by @noahedwardhall", name: "description"},
            {content: 'Home', property: 'og:title'},
          ]}
          title='React F Your Starterkit'
        />
        <style scoped type='text/css'>{styles}</style>
        <ul className='navbar'>
          <li className='navitem'>
            <Link activeClassName='active' className='navlink' onlyActiveOnIndex={true} to={`/`} >Home</Link>
          </li>
          <li className='navitem'>
            <Link activeClassName='active' className='navlink' to={`/start`} >Start</Link>
          </li>
        </ul>
        {this.props.children}
      </div>
    );
  }
}

export default Page;
