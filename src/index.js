import React from 'react';
import PropTypes from 'prop-types';
import Transition from 'react-transition-group/Transition';

export const pageTransitionEvent = 'gatsby-plugin-page-transition::exit';
export const pageTransitionTime = 'gatsby-plugin-page-transition::time';
export const pageTransitionExists = 'gatsby-plugin-page-transition::exists';
export const componentTransitionTime = 'gatsby-plugin-page-transition::comTime';

class PageTransition extends React.Component {
  constructor(props) {
    super(props);
    this.setIn = this.setIn.bind(this);
    this.listenerHandler = this.listenerHandler.bind(this);
    this.state = {
      in: false,
      transitionTime: 0,
    };
  }

  componentDidMount() {
    this.setIn(true);
    global.window.addEventListener(pageTransitionEvent, this.listenerHandler);
    global.window[pageTransitionExists] = true;
    global.window[componentTransitionTime] = this.props.transitionTime;
    this.setState({
      transitionTime:
        this.props.transitionTime || global.window[pageTransitionTime],
    });
  }

  componentWillUnmount() {
    global.window.removeEventListener(
      pageTransitionEvent,
      this.listenerHandler,
    );
    global.window[pageTransitionExists] = false;
    global.window[componentTransitionTime] = undefined;
  }

  setIn(inProp) {
    this.setState({ in: inProp });
  }

  listenerHandler(event) {
    const currentPath = global.window.location.pathname;
    const nextPath = event.detail.pathname;
    if (currentPath !== nextPath) this.setIn(false);
  }

  render() {
    const defaultStyle = this.props.defaultStyle || {
      transition: `opacity ${this.state.transitionTime}ms ease-in-out`,
      opacity: 0,
    };

    const transitionStyles = this.props.transitionStyles || {
      entering: { opacity: 1 },
      entered: { opacity: 1 },
      exiting: { opacity: 0 },
    };

    return (
      <Transition in={this.state.in} timeout={this.state.transitionTime}>
        {state => (
          <div
            style={{
              ...defaultStyle,
              ...transitionStyles[state],
            }}
          >
            {this.props.children}
          </div>
        )}
      </Transition>
    );
  }
}

PageTransition.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.shape({})),
    PropTypes.shape({}),
  ]).isRequired,
  transitionTime: PropTypes.number,
  defaultStyle: PropTypes.shape({}),
  transitionStyles: PropTypes.shape({}),
};

export default PageTransition;

/**
 * Some browsers do not have access to window.CustomEvent
 */
export const  CustomEventPolyfill = () => {
    if ( typeof window.CustomEvent === 'function' ) return false;

    function CustomEvent ( event, params ) {
      params = params || { bubbles: false, cancelable: false, detail: undefined };
      var evt = document.createEvent( 'CustomEvent' );
      evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
      return evt;
    }

    CustomEvent.prototype = window.Event.prototype;

    window.CustomEvent = CustomEvent;
    global.window.CustomEvent = CustomEvent;
};