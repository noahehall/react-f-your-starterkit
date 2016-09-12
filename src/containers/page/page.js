import React from 'react';
import { Link } from 'react-router';
import './page.css';

const Page = (props) =>
  <div className="page">
    <Link to={`/`}>Home</Link>
    {props.children}
  </div>;

Page.propTypes = { children: React.PropTypes.node };
export default Page;
