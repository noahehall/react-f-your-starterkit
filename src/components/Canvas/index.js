/**
  1. View popular searches and either search with a query from that list or enter your own. Examples of searches: alavert or acetaminophen or quetiapine.

  2. Select a particular drug concept to serve as the reference drug

  3. View branded and generic drugs that contain the same ingredients as the reference
*/

/* eslint-disable */

import 'node_modules/react-table/react-table.css';
import { connect } from 'react-redux';
import PopularQueries from './PopularQueries';
import queriesActions from 'store/api/queries/action';
import React from 'react';
import RelatedDrugs from './RelatedDrugs';
import rxNormActions from 'store/api/rxNorm/action';
import store from 'store-npm';

export class Canvas extends React.Component {
  componentDidMount () {
    const queries = store.get('queries');
    if (queries) this.props.trackQuery(queries, true);
  }

  trackQueryWithData = (data, searchValue) => {
    if (!data[0].get('status').error && data[0].get(searchValue).drugGroup.conceptGroup)
      this.props.trackQuery(searchValue);
  }

  searchDrug = (drugName, rxcui) => {
    let searchValue = drugName
      ? (this.search.value.trim() || rxcui)
      : rxcui;

    if (searchValue.length && 'status' !== searchValue) {
      searchValue = searchValue.toLowerCase();


      if (!this.props.rxNorm.has(searchValue)) {
        console.log('requesting', searchValue);
        this.props.getRxNorm(drugName && searchValue, rxcui)
          .then((response) => {
            if (drugName)
              this.trackQueryWithData(Object.values(response.data), searchValue);
          });
      } else if (drugName && this.props.queries[searchValue])
        this.props.trackQuery(searchValue);
    }
  }

  renderRelatedDrugs = (
    drugs = this.props.rxNorm,
    drugNames = Object.keys(this.props.queries)
  ) => (
    <RelatedDrugs
      drugNames={drugNames}
      drugs={drugs}
      getRxNorm={this.searchDrug}
    />
  )

  getQueriesWithData = () => Object.entries(this.props.queries)

  renderPopularQueries = (
    searches = this.getQueriesWithData()
  ) => ( searches.length
    ? <PopularQueries getRxNorm={this.searchDrug} searches={searches} />
    : null
  )

  render () {
    return (
      <div>
        <input
          ref={(input) => {
            this.search = input;
          }}
          type='text'
        />
        <button
          onClick={() => this.searchDrug(true)}
        >Search Drug Name</button>
        {this.renderPopularQueries()}
        <h3>Your searchesdddddd</h3>
        {this.renderRelatedDrugs()}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  rxNorm: new Map(state.rxNorm),
  queries: state.queries,
});

const mapDispatchToProps = (dispatch) => ({
  getRxNorm (drugName, rxcui) {
    return dispatch(rxNormActions(drugName, rxcui));
  },
  trackQuery (drugName, init = false) {
    dispatch(queriesActions(drugName, init));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Canvas);
