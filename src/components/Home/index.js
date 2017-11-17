import React from 'react';
import { connect } from 'react-redux'
import blah from 'store/logic/blah/action.js';

export class Home extends React.Component {
  handleBlah = () => this.props.doBlah(Math.random())

  render() {
    console.log('props are', this.props)
    console.log('blah is', this.props.blah)
    return (
      <div>
        Homes
        <button onClick={this.handleBlah}>Clicsk to do three</button>
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
