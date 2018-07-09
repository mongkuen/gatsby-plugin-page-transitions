import createHistory from 'history/createBrowserHistory';
import {
  pageTransitionEvent,
  pageTransitionTime,
  pageTransitionExists,
  componentTransitionTime,
} from './index.js';

exports.onClientEntry = (_, { transitionTime }) => {
  window[pageTransitionTime] = transitionTime || 250;

  const getUserConfirmation = (pathname, callback) => {
    const event = new global.window.CustomEvent(pageTransitionEvent, {
      detail: { pathname },
    });
    global.window.dispatchEvent(event);
    const time = window[componentTransitionTime] || window[pageTransitionTime];
    window[pageTransitionExists]
      ? setTimeout(() => callback(true), time)
      : callback(true);
  };

  const history = createHistory({ getUserConfirmation });
  history.block(location => location.pathname);
  exports.replaceHistory = () => history;
};
