import React from 'react';
import { Link } from 'react-router';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import * as actionCreators from 'store/actions/index.js';
import { bindActionCreators } from 'redux';
import styles from './page.css';

// import checkInternet from 'server/checkconnection.js';

class Page extends React.Component {
  static propTypes = {
    children: React.PropTypes.node,
    msg: React.PropTypes.string,
  }

  /**
   * only loads scripts if node has internet access
   * @method getScripts
   * @return {[type]}   [description]
   */
  getScripts = () => {
    const nav = typeof navigator !== 'undefined' ? navigator : null;

    return appConsts.nodeOnline || nav && nav.onLine ?
      [
        { src: 'https://cdn.logrocket.com/LogRocket.min.js', type: 'text/javascript' },
        // to log session urls in production console.log(LogRocket.recordingURL);
        // add the github integration https://github.com/integration/logrocket
        {
          innerHTML: `if (typeof LogRocket !== 'undefined') { LogRocket.init('noahedwardhall/trainschedule', { shouldShowReportingButton: ${!appConsts.isProd && true} }); }`,
          type: 'text/javascript',
        }
      ] :
      [{}];
  }

  render () {
    return (
      <div className='page'>
        <Helmet
          htmlAttributes={{ lang: 'en' }}
          link={[
            {
              'href': 'http://fonts.googleapis.com/css?family=Muli|Eczar|Varela Round',
              'rel': 'stylesheet',
              type:'text/css',
            },
          ]}
          meta={[
            { content: 'React F Your Starterkit by @noahedwardhall', name: 'description' },
            { content: 'Home', property: 'og:title' },
          ]}
          script={this.getScripts()}
          title='For Your Progressive React Starterkit'
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
