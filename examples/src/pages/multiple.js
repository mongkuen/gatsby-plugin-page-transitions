import React from 'react'
import Link from 'gatsby-link'
import PageTransition from 'gatsby-plugin-page-transitions'
import Transition from 'react-transition-group/Transition'
import { style } from './index'

const defaultStyleLeft = {
  transition: 'left 500ms cubic-bezier(0.47, 0, 0.75, 0.72)',
  left: '100%',
  position: 'absolute',
  width: '100%'
}

const transitionStylesLeft = {
  entering: { left: '25%' },
  entered: { left: '25%' },
  exiting: { left: '100%' }
}

const defaultStyleUp = {
  transition: 'top 500ms cubic-bezier(0.47, 0, 0.75, 0.72)',
  top: '100%',
  position: 'absolute',
  width: '100%',
  left: '68%'
}

const transitionStylesUp = {
  entering: { top: '50%' },
  entered: { top: '50%' },
  exiting: { top: '100%' }
}

const pageTransitionEvent = 'gatsby-plugin-page-transition::exit';

class Multiple extends React.Component {
  constructor (props) {
    super(props)
    this.listenHandler = this.listenHandler.bind(this)
    this.state = {
      in: false
    }
  }

  componentDidMount () {
    global.window.addEventListener(pageTransitionEvent, this.listenHandler)
    this.setState({
      in: true
    })
  }

  listenHandler () {
    this.setState({
      in: false
    })
  }

  componentWillUnmount () {
    global.window.removeEventListener(pageTransitionEvent, this.listenHandler)
  }

  render () {
    return (
      <PageTransition transitionTime={500}>
        <div style={style}>
          <h1>Multiple</h1>
          <Transition in={this.state.in} timeout={500}>
            {(state) => (
              <div style={{
                ...defaultStyleLeft,
                ...transitionStylesLeft[state]
              }}>
                Slide Left Element
              </div>
            )}
          </Transition>
          <Transition in={this.state.in} timeout={500}>
            {(state) => (
              <div style={{
                ...defaultStyleUp,
                ...transitionStylesUp[state]
              }}>
                Slide Up Element
              </div>
            )}
          </Transition>
          <Link to="/">To Default Fade Transition</Link>
          <Link to="/slide">To Slide Left Transition</Link>
          <Link to="/none">To No Transition</Link>
        </div>
      </PageTransition>
    )
  }
}

export default Multiple
