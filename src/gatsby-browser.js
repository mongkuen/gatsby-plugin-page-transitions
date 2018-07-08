import createHistory from 'history/createBrowserHistory';
import { pageTransitionEvent, pageTransitionTime } from './index.js';

exports.onClientEntry = (_, { transitionTime }) => {
  window[pageTransitionTime] = transitionTime;

  const getUserConfirmation = (pathname, callback) => {
    const event = new global.window.CustomEvent(pageTransitionEvent, {
      detail: { pathname },
    });
    global.window.dispatchEvent(event);
    setTimeout(() => callback(true), transitionTime);
  };

  const history = createHistory({ getUserConfirmation });
  history.block(location => location.pathname);
  exports.replaceHistory = () => history;
};
