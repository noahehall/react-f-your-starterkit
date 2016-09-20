import React from 'react';
import Markdown from 'react-markdown';
import md from '../../../readme.md';

import './main.css';

const Main = () => <div className='main'><Markdown source={md} /></div>;

export default Main;
