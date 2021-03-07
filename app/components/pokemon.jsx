import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfo } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';

import { ReactGA } from '../utils/analytics';
import { createCaptures, deleteCaptures } from '../actions/capture';
import { htmlName, iconClass, localizeName } from '../utils/pokemon';
import { padding } from '../utils/formatting';
import { setCurrentPokemon } from '../actions/pokemon';
import { setShowInfo } from '../actions/tracker';

export function Pokemon({ capture }) {
  const dispatch = useDispatch();

  const currentDex = useSelector(({ currentDex }) => currentDex);
  const dex = useSelector(({ currentDex, currentUser, users }) => users[currentUser].dexesBySlug[currentDex]);
  const session = useSelector(({ session }) => session);
  const user = useSelector(({ currentUser, users }) => users[currentUser]);

  if (!capture) {
    return (
      <div className="pokemon empty">
        <div className="set-captured" />
        <div className="set-captured-mobile" />
      </div>
    );
  }

  const handleSetCapturedClick = async () => {
    if (!session || session.id !== user.id) {
      return;
    }

    const payload = { dex: dex.id, pokemon: [capture.pokemon.id] };

    if (capture.captured) {
      await dispatch(deleteCaptures({ payload, slug: currentDex, username: user.username }));
      ReactGA.event({ category: 'Pokemon', label: localizeName(capture.pokemon.nameList, 'en'), action: 'unmark' });
    } else {
      await dispatch(createCaptures({ payload, slug: currentDex, username: user.username }));
      ReactGA.event({ category: 'Pokemon', label: localizeName(capture.pokemon.nameList, 'en'), action: 'mark' });
    }
  };

  const handleSetInfoClick = () => {
    ReactGA.event({ action: 'show info', category: 'Pokemon', label: localizeName(capture.pokemon.nameList, 'en') });

    dispatch(setCurrentPokemon(capture.pokemon.id));
    dispatch(setShowInfo(true));
  };

  const classes = {
    pokemon: true,
    viewing: !session || session.id !== user.id,
    captured: capture.captured
  };

  return (
    <div className={classNames(classes)}>
      <div className="set-captured" onClick={handleSetCapturedClick}>
        <h4>{localizeName(htmlName(capture.pokemon.nameList), user.language)}</h4>
        <div className="icon-wrapper">
          <i className={iconClass(capture.pokemon, dex)} />
        </div>
        <p>#{padding(capture.pokemon.national_id, 3)}</p>
      </div>
      <div className="set-captured-mobile" onClick={handleSetCapturedClick}>
        <div className="icon-wrapper">
          <i className={iconClass(capture.pokemon, dex)} />
        </div>
        <h4>{localizeName(htmlName(capture.pokemon.nameList), user.language)}</h4>
        <p>#{padding(capture.pokemon.national_id, 3)}</p>
      </div>
      <div className="set-info" onClick={handleSetInfoClick}>
        <FontAwesomeIcon icon={faInfo} />
      </div>
    </div>
  );
}

Pokemon.propTypes = {
  capture: PropTypes.object
};
