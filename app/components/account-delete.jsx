import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch, faLongArrowAltLeft, faLongArrowAltRight } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router';

import { Alert } from './alert';
import { Footer } from './footer';
import { Nav } from './nav';
import { ReactGA } from '../utils/analytics';
import { Reload } from './reload';
import { checkVersion } from '../actions/utils';
import { deleteUser } from '../actions/user';

export function AccountDelete() {
  const dispatch = useDispatch();

  const history = useHistory();

  const session = useSelector(({ session }) => session);
  // If the session user hasn't been loaded yet, temporarily substitute it with
  // the normal session. If there are things that are expected to be in the
  // session user that isn't in the normal session (e.g. dexes), this could
  // cause some problems and might need to be reworked, but right now, it works.
  const user = useSelector(({ session, sessionUser }) => sessionUser || session);

  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    document.title = 'Account | Pokédex Tracker';
  }, []);

  useEffect(() => {
    if (!session) {
      history.push('/login');
    }
  }, [session]);

  useEffect(() => {
    dispatch(checkVersion());
  }, []);

  if (!session) {
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      username: session.username,
    };

    setError(null);
    setIsLoading(true);

    try {
      await dispatch(deleteUser(payload));
      ReactGA.event({ action: 'delete', category: 'User' });

      localStorage.clear();
      ReactGA.event({ action: 'sign out', category: 'Session' });
      window.location.href = "/"
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="account-container">
      <Nav />
      <Reload />
      <div className="form">
        <h1>Delete Account</h1>
        <form className="form-column" onSubmit={handleSubmit}>
          <Alert message={error} type="error" />
          <div>
            <p>
              Are you sure you want to delete your account?
            </p>
            <p>
              All Information, including your Pokédexes, will be lost! You can come back at any time, tho.
            </p>
          </div>
          <button className="btn btn-red" type="submit">
            {/* The double check for isLoading is necessary because there is a slight delay when applying visibility: hidden onto the icon. */}
            <span className={isLoading ? 'hidden' : ''}>Delete my account {!isLoading && <FontAwesomeIcon icon={faLongArrowAltRight} />}</span>
            {isLoading ? <span className="spinner"><FontAwesomeIcon icon={faCircleNotch} spin /></span> : null}
          </button>
          <p>
            <a className="link" href="/account">
              No, I don't want to delete my account
            </a>
          </p>
        </form>
      </div>
      <Footer />
    </div>
  );
}
