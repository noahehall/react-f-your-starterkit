/* eslint-disable */
import { Link } from 'react-router-dom';
import React from 'react';

export default function Navigation() {
  return (
    <ul>
      <li><Link to="/">Home</Link></li>
      <li><Link to="/canvas">Canvas</Link></li>
      <li><Link to="/about">About</Link></li>
    </ul>
  );
}
