import createHistory from 'history/createBrowserHistory';
import {
  pageTransitionEvent,
  pageTransitionTime,
  pageTransitionExists,
} from './index.js';

exports.onClientEntry = (_, { transitionTime }) => {
  window[pageTransitionTime] = transitionTime;

  const getUserConfirmation = (pathname, callback) => {
    const event = new global.window.CustomEvent(pageTransitionEvent, {
      detail: { pathname },
    });
    global.window.dispatchEvent(event);
    window[pageTransitionExists]
      ? setTimeout(() => callback(true), transitionTime)
      : callback(true);
  };

  const history = createHistory({ getUserConfirmation });
  history.block(location => location.pathname);
  exports.replaceHistory = () => history;
};
