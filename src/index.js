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
    this.state = { in: false };
  }

  componentDidMount() {
    this.setIn(true);
    global.window.addEventListener(pageTransitionEvent, this.listenerHandler);
    window[pageTransitionExists] = true;
    window[componentTransitionTime] = this.props.transitionTime;
  }

  componentWillUnmount() {
    global.window.removeEventListener(
      pageTransitionEvent,
      this.listenerHandler,
    );
    window[pageTransitionExists] = false;
    window[componentTransitionTime] = undefined;
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
    const transitionTime = window[pageTransitionTime];

    const defaultStyle = this.props.defaultStyle || {
      transition: `opacity ${transitionTime}ms ease-in-out`,
      opacity: 0,
    };

    const transitionStyles = this.props.transitionStyles || {
      entering: { opacity: 1 },
      exiting: { opacity: 0 },
    };

    return (
      <Transition in={this.state.in} timeout={transitionTime}>
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
};

export default PageTransition;
