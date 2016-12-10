import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import * as actionCreators from 'store/actions/index.js';
import Helmet from 'react-helmet';
import React from 'react';
import styles from './index.css';

class App extends React.Component {
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

    // only include scripts if able to connect to internet
    // update this to include scripts to serve both online and offline
    return appConsts.nodeOnline || (nav && nav.onLine) ?
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
      <article className='app'>
        <Helmet
          htmlAttributes={{ lang: 'en' }}
          link={[
            {
              'href': `${appConsts.isProd ? 'https' : 'http'}://fonts.googleapis.com/css?family=Muli|Varela%20Round`,
              'rel': 'stylesheet',
              type:'text/css',
            },
          ]}
          meta={[
            { content: 'F Your Starterkit by @noahedwardhall', name: 'description' },
            { content: 'Home', property: 'og:title' },
          ]}
          script={this.getScripts()}
          title='For Your Progressive Starterkit Needs'
        />
        <style scoped type='text/css'>{styles}</style>
        <nav>
          <ul className='navbar'>
            <li className='navitem'>
              <Link activeClassName='active' className='navlink' onlyActiveOnIndex={true} to={`/`} >Home</Link>
            </li>
            <li className='navitem'>
              <Link activeClassName='active' className='navlink' to={`start`} >Start</Link>
            </li>
            <li className='navitem ra'>
              <section>{this.props.msg}</section>
            </li>
          </ul>
        </nav>
        {this.props.children}
      </article>
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

export default connect(mapStateToProps, mapDispatchToProps)(App);
