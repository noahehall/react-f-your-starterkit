import React from 'react';
import { Link } from 'react-router';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import * as actionCreators from 'actions';
import { bindActionCreators } from 'redux';

import styles from './page.css';

class Page extends React.Component {
  static propTypes = {
    children: React.PropTypes.node,
    msg: React.PropTypes.string,
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
          title='React For Your Starterkit'
        />
        <style scoped type='text/css'>{styles}</style>
        <ul className='navbar'>
          <li className='navitem'>
            <Link activeClassName='active' className='navlink' onlyActiveOnIndex={true} to={`/`} >Home</Link>
          </li>
          <li className='navitem'>
            <Link activeClassName='active' className='navlink' to={`start`} >Start</Link>
          </li>
          <li className='navitem ra'>
            <div>{this.props.msg}</div>
          </li>
        </ul>
        {this.props.children}
      </div>
    );
  }
}

const mapStateToProps = (state) =>
  ({
    msg: state.msg
  });

const mapDispatchToProps = (dispatch) =>
  ({
    actions: bindActionCreators(actionCreators, dispatch)
  });

export default connect(mapStateToProps, mapDispatchToProps)(Page);
