import { mscAlert } from 'medium-style-confirm';

import { readCookie } from './cookie';
import { merge } from './util';

let sessionCookie = 'session_id';

/**
 * Set the cookie name to check for session data.
 * @param {string} name - The name of the cookie in which session data is stored. Default is session_id.
 */
export const setSessionCookieName = (name) => sessionCookie = name;

export const userData = () => {
  let data = readCookie('userinfo');
  let session = readCookie(sessionCookie);
  if (!data || !session) {
    return null;
  }
  try {
    data = data.replace(/"/g, '');
    const tdata = window.atob(data);
    const userinfo = JSON.parse(tdata);
    return userinfo;
  } catch (e) {
    console.error(e);
    return null;
  }
}

let userCache = null;
let groupCache = null;


/**
 * Get the user data from the userinfo cookie. If not set, it returns null
 * @returns {Object} null is no data found from cookie.
 */
export const getUser = () => {
  if (userCache !== null) {
    return userCache;
  }
  userCache = userData();
  return userCache;
}


/**
 * Check whether the current user is admin or not.
 * @returns {Boolean} true if admin else false
 */
export const isAdmin = () => {
  if (groupCache !== null) {
  } else {
    groupCache = sidToUidGroups();
  }
  const { groups } = groupCache;
  if(groups.indexOf('admin') >= 0) {
    return true;
  }
  return false;
}

const defaultOptions = {
  title: 'Please Login',
  subtitle: 'It seems you are not logged in. Please login to access this page.',
  okText: 'Login',
};

export const checkSession = (errorCallback, showModal=true, options=defaultOptions) => {
  const user = getUser();
  options = merge(options, defaultOptions);
  options.onOk = errorCallback;
  options.onCancel = errorCallback;
  if (!user) {
    if (showModal) {
      mscAlert(options);
    } else {
      errorCallback();
    }
  }
}

export const sidToUidGroups = () => {
  if (groupCache !== null) {
    return groupCache;
  }
  let session = readCookie(sessionCookie);
  if (!session) {
    throw 'Session Cookie does not exist.';
  }
  session = session.replace(/"/g, '');
  const uidGroups = window.atob(session.substring(43)).split(':');
  groupCache = {
    uid: Number.parseInt(uidGroups[0], 10),
    groups: uidGroups.slice(1)
  };
  return groupCache;
};
