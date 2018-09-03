import createHistory from 'history/createBrowserHistory';
import {
  pageTransitionEvent,
  pageTransitionTime,
  pageTransitionExists,
  componentTransitionTime,
  CustomEventPolyfill
} from './index.js';

exports.onClientEntry = (_, { transitionTime }) => {
  CustomEventPolyfill();
  global.window[pageTransitionTime] = transitionTime || 250;
};

const getUserConfirmation = (pathname, callback) => {
  const event = new global.window.CustomEvent(pageTransitionEvent, {
    detail: { pathname },
  });
  global.window.dispatchEvent(event);
  const time =
    global.window[componentTransitionTime] || global.window[pageTransitionTime];
  global.window[pageTransitionExists]
    ? setTimeout(() => callback(true), time)
    : callback(true);
};

const history = createHistory({ getUserConfirmation });
history.block(location => location.pathname);
exports.replaceHistory = () => history;
