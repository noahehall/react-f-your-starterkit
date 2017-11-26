/* eslint-disable */
import { Layout } from 'antd';
import Navigation from './Navigation';
import PropTypes from 'prop-types';
import React from 'react';
import Route from './Router/Route';
import RouterConfig from './Router/RouteConfig';
import styles from './index.scss';

import {
  Redirect, // should be in components/Routes
  Switch,
} from 'react-router-dom';


// import Footer from 'components/Footer';

const { Header, Footer, Sider, Content } = Layout;

export class App extends React.Component {
  render() {
    return (
      <div className={styles.layout}>
        <Layout>
          <article>
            <Header fixed size='small'>
              <small>
                Noah Edward Technologies
              </small>
              <Navigation />
            </Header>
            <Content>
              Thank you for supporting our opensource react starter kit!
              <Switch>
                {
                  RouterConfig.map((route) =>
                    <Route {...route} key={route.path} />
                  )
                }
              </Switch>
            </Content>
            <Footer>
              Find budgs? Please create an issue
            </Footer>
          </article>
        </Layout>
      </div>
    );
  }
}

export default App;
