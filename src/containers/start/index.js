import React from 'react';
import styles from './index.css';
import Idbstore from 'serviceworkers/idb/idb';

class Start extends React.Component {
  componentDidMount () {
    if (Idbstore) {
      const db = new Idbstore();
      appFuncs.console()('Idbstore is true!');
      appFuncs.console('dir')(db);
    } else appFUncs.console()('Idb store is false :(');
  }

  render () {
    return (
      <div className='main'>
        <style scoped type='text/css'>{styles}</style>
        <h2>Lets get started!</h2>
      </div>
    );
  }
}

export default Start;
