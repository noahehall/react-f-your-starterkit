/* eslint-disable */
import React from 'react';
import { connect } from 'react-redux'
import blah from 'store/api/blah/action.js';

export class Home extends React.Component {
  handleBlah = () => this.props.doBlah(Math.random())

  render() {
    console.log('props.blah are', this.props.blah)
    return (
      <div>
        blah
        <button onClick={this.handleBlah}>Clicsk to do five</button>
      </div>
    )
  }
}

const mapStateToProps = state => state.blah;

const mapDispatchToProps = dispatch => {
  return {
    doBlah(data) {
      return dispatch(blah(data))
    },
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Home)
