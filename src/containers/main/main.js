import React, { Component } from 'react';
import Markdown from 'react-markdown';
import md from 'readme';

import styles from './main.css';

class Main extends Component {
  render() {
    return <div className='main'><style scoped type='text/css'>{styles}</style><Markdown source={md} /></div>;
  }
}

export default Main;
