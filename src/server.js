/* eslint-disable */
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import templateFn from './components/server';
// import App from 'components/App';

const App = () => <div>hello noah</div>;
export default (req, res, next) => {
  console.log(
    'made it in'
  )
  const html = ReactDOMServer.renderToString(
    <App />
  );
  const template = templateFn(html);
  res.send(template);
};
