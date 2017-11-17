/* eslint-disable */
// TODO: favicon not working
import './assets/theme.css';
import './images/favicon.ico';
import styles from './index.scss';

import {
  Redirect,
  Route,
  Switch,
} from 'react-router-dom';
import About from 'components/About';
import { Layout as Screen } from 'antd';
import Home from 'components/Home';
import Navigation from './Navigation';
import Oops from 'components/Oops';
import PropTypes from 'prop-types';
import React from 'react';

const { Header, Footer, Sider, Content } = Screen;

export class Layout extends React.Component {
  static propTypes = {
    blah: PropTypes.string,
    children: PropTypes.node,
  }

  render() {
    return (
      <div className={styles.layout}>
        <Screen>
          <article>
            <Header fixed={true} size='small'>
              <small>
                Noah Edward Technologies
              </small>
              <Navigation />
            </Header>
            <Content>
              Thank you for supporting our opensource react starter kit!
              <Switch>
                <Route exact path='/' component={Home}/>
                <Route path='/about' component={About}/>
                <Route exact path='/oops' component={Oops} />
                <Redirect to={{
                  pathname: '/oops',
                  state: { from: this.props.location}
                }}/>
              </Switch>
            </Content>
            <Footer>
              Find bugs? Please create an issue
            </Footer>
          </article>
        </Screen>
      </div>
    );
  }
}

export default Layout;
