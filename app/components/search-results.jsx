import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useMemo } from 'react';

import { Pokemon } from './pokemon';
import { setQuery } from '../actions/search';
import { localizeName } from '../utils/pokemon';

export function SearchResults({ captures }) {
  const dispatch = useDispatch();

  const query = useSelector(({ query }) => query.toLowerCase());
  const user = useSelector(({ currentUser, users }) => users[currentUser]);

  const handleClearClick = () => dispatch(setQuery(''));

  const filteredCaptures = useMemo(() => {
    return captures.filter((capture) => localizeName(capture.pokemon.nameList, user.language).toLowerCase().indexOf(query) === 0);
  }, [captures, query]);

  if (filteredCaptures.length === 0) {
    return (
      <div className="search-results search-results-empty">
        <p>No results. <a className="link" onClick={handleClearClick}>Clear your search?</a></p>
      </div>
    );
  }

  return (
    <div className="search-results">
      {filteredCaptures.map((capture) => <Pokemon capture={capture} key={capture.pokemon.id} />)}
    </div>
  );
}

SearchResults.propTypes = {
  captures: PropTypes.arrayOf(PropTypes.object).isRequired
};
