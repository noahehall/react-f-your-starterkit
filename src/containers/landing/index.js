import React from 'react';
import Markdown from 'react-markdown';
import md from 'readme';

import styles from './index.css';

class Landing extends React.Component {
  render () {
    return (
      <div className='main'>
        <style scoped type='text/css'>{styles}</style>
        <Markdown source={md} />
      </div>
    );
  }
}

export default Landing;
