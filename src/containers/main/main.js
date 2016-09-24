import React, { Component } from 'react';
import Markdown from 'react-markdown';
import md from '../../../readme.md';

import './main.css';

class Main extends Component {
  render() {
    return <div className='main'><Markdown source={md} /></div>;
  }
}

export default Main;
