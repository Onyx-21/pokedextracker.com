import find from 'lodash/find';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faCaretLeft, faCaretRight, faCaretUp, faLongArrowAltRight } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useMemo } from 'react';

import { EvolutionFamily } from './evolution-family';
import { InfoLocations } from './info-locations';
import { ReactGA } from '../utils/analytics';
import { htmlName, iconClass, localizeName } from '../utils/pokemon';
import { padding } from '../utils/formatting';
import { retrievePokemon } from '../actions/pokemon';
import { setShowInfo, setShowExtraLinks } from '../actions/tracker';

const SEREBII_LINKS = {
  x_y: 'pokedex-xy',
  omega_ruby_alpha_sapphire: 'pokedex-xy',
  sun_moon: 'pokedex-sm',
  ultra_sun_ultra_moon: 'pokedex-sm',
  lets_go_pikachu_eevee: 'pokedex-sm',
  sword_shield: 'pokedex-swsh',
  sword_shield_expansion_pass: 'pokedex-swsh'
};

export function Info() {
  const dispatch = useDispatch();

  const currentPokemon = useSelector(({ currentPokemon }) => currentPokemon);
  const dex = useSelector(({ currentDex, currentUser, users }) => users[currentUser].dexesBySlug[currentDex]);
  const pokemon = useSelector(({ currentPokemon, pokemon }) => pokemon[currentPokemon]);
  const showInfo = useSelector(({ showInfo }) => showInfo);
  const showExtraLinks = useSelector(({ showExtraLinks }) => showExtraLinks);
  const user = useSelector(({ currentUser, users }) => users[currentUser]);

  useEffect(() => {
    if (!pokemon) {
      dispatch(retrievePokemon(currentPokemon, {
        game_family: dex.game.game_family.id,
        regional: dex.regional
      }));
    }
  }, [currentPokemon, dex, pokemon]);

  const serebiiPath = useMemo(() => {
    if (!pokemon) {
      return null;
    }

    const swshLocation = find(pokemon.locations, (loc) => loc.game.game_family.id === 'sword_shield');

    // If the Pokemon's location is 'Currently unavailable' for SwSh, that means
    // they aren't available in this game because of dexit, so we go back to the
    // the SuMo Serebii links. This will probably need to be updating with
    // future generations.
    if (swshLocation && swshLocation.value.length > 0 && swshLocation.value[0] === 'Currently unavailable') {
      return 'pokedex-sm';
    }

    return SEREBII_LINKS[dex.game.game_family.id];
  }, [dex, pokemon]);

  const handleInfoClick = () => {
    ReactGA.event({ action: showInfo ? 'collapse' : 'uncollapse', category: 'Info' });
    dispatch(setShowInfo(!showInfo));
  };

  const handleExtraLinksClick = () => {
    ReactGA.event({ action: showExtraLinks ? 'collapse' : 'uncollapse', category: 'Info' });
    dispatch(setShowExtraLinks(!showExtraLinks));
  };

  if (!pokemon) {
    return (
      <div className={`info ${showInfo ? '' : 'collapsed'}`}>
        <div className="info-collapse" onClick={handleInfoClick}>
          <FontAwesomeIcon icon={showInfo ? faCaretRight : faCaretLeft} />
        </div>

        <div className="info-main" />
      </div>
    );
  }

  return (
    <div className={`info ${showInfo ? '' : 'collapsed'}`}>
      <div className="info-collapse" onClick={handleInfoClick}>
        <FontAwesomeIcon icon={showInfo ? faCaretRight : faCaretLeft} />
      </div>

      <div className="info-main">
        <div className="info-header">
          <i className={iconClass(pokemon, dex)} />
          <h1>{localizeName(htmlName(pokemon.nameList), user.language)}</h1>
          <h2>#{padding(pokemon.national_id, 3)}</h2>
        </div>

        <InfoLocations locations={pokemon.locations} />

        <EvolutionFamily family={pokemon.evolution_family} />


        <div className="info-footer-container">
          <div className="info-footer">
            <a
              href={`http://bulbapedia.bulbagarden.net/wiki/${encodeURI(localizeName(pokemon.nameList, 'en'))}_(Pok%C3%A9mon)`}
              onClick={() => ReactGA.event({ action: 'open Bulbapedia link', category: 'Info', label: localizeName(pokemon.nameList, 'en') })}
              rel="noopener noreferrer"
              target="_blank"
            >
              Bulbapedia <FontAwesomeIcon icon={faLongArrowAltRight} />
            </a>
            <a
              href={`http://www.serebii.net/${serebiiPath}/${padding(pokemon.national_id, 3)}.shtml`}
              onClick={() => ReactGA.event({ action: 'open Serebii link', category: 'Info', label: localizeName(pokemon.nameList, 'en') })}
              rel="noopener noreferrer"
              target="_blank"
            >
              Serebii <FontAwesomeIcon icon={faLongArrowAltRight} />
            </a>
          </div>
          <div className="info-collapse" onClick={handleExtraLinksClick}>
            <FontAwesomeIcon icon={showExtraLinks ? faCaretDown : faCaretUp} />
          </div>
          <div className={`extra-links ${showExtraLinks ? '' : 'collapsed'}`}>
            <div className="info-footer">
              <a
                href={`https://www.pokewiki.de/${encodeURI(localizeName(pokemon.nameList, 'de'))}`}
                onClick={() => ReactGA.event({ action: 'open Pokewiki link', category: 'Info', label: localizeName(pokemon.nameList, 'en') })}
                rel="noopener noreferrer"
                target="_blank"
                className="full-size"
              >
                Pokewiki.de <FontAwesomeIcon icon={faLongArrowAltRight} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
