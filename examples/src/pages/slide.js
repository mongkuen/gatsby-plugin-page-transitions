import React from 'react'
import Link from 'gatsby-link'
import PageTransition from 'gatsby-plugin-page-transitions'
import { style } from './index'

const Slide = () => (
  <PageTransition
    defaultStyle={{
      transition: 'left 500ms cubic-bezier(0.47, 0, 0.75, 0.72)',
      left: '100%',
      position: 'absolute',
      width: '100%',
    }}
    transitionStyles={{
      entering: { left: '0%' },
      entered: { left: '0%' },
      exiting: { left: '100%' },
    }}
    transitionTime={500}
  >
    <div style={style}>
      <h1>Slide Left Transition</h1>
      <Link to="/">To Default Fade Transition</Link>
      <Link to="/none">To No Transition</Link>
      <Link to="/multiple">To Multiple Transitions</Link>
    </div>
  </PageTransition>
)

export default Slide
