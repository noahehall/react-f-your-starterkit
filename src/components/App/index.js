/* eslint-disable */
import { Layout } from 'antd';
import ContentRouter from './Router/ContentRouter';
import Navigation from './Navigation';
import PropTypes from 'prop-types';
import React from 'react';
import styles from './index.scss';

const { Header, Footer, Sider, Content } = Layout;

export class App extends React.Component {
  render() {
    return (
      <div className={styles.layout}>
        <Layout>
          <article>
            <Header fixed='true' size='small'>
              <small>
                Noah Edward Technologies
              </small>
              <Navigation />
            </Header>
            <Content>
              Thank you for supporting our netech web app builder
              <ContentRouter />
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
