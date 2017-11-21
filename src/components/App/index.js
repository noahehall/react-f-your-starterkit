/* eslint-disable */
// TODO: rename dir to App
//import './images/favicon.ico';
//import './theme.css';
import { ConnectedRouter } from 'react-router-redux';
import { Layout } from 'antd';
import { Provider } from 'react-redux';
import Navigation from './Navigation';
import PropTypes from 'prop-types';
import React from 'react';
import Routes from 'components/Routes';
import styles from './index.scss';

import {
  Redirect, // should be in components/Routes
  Route,
  Switch,
} from 'react-router-dom';


// import Footer from 'components/Footer';

const { Header, Footer, Sider, Content } = Layout;

export class App extends React.Component {
  routeWithSubRoutes = (route) => (
    <Route
      exact={route.exact || false}
      key={Math.random()}
      path={route.path}
      render={(props) => (
        <route.component
          {...props} routes={route.routes || null}
        />
      )}
    />
  )

  render() {
    console.log('prosssssps',this.props)
    return (
      <Provider store={this.props.store}>
        <ConnectedRouter history={this.props.history}>
          <div className={styles.layout}>
            hellodfadfasfd
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
                  <Switch>{Routes.map((route) => this.routeWithSubRoutes(route))}</Switch>
                </Content>
                <Footer>
                  Find bugs? Please create an issue
                </Footer>
              </article>
            </Layout>
          </div>
        </ConnectedRouter>
      </Provider>
    );
  }
}

export default App;
