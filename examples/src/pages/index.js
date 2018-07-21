import React from 'react'
import Link from 'gatsby-link'
import PageTransition from 'gatsby-plugin-page-transitions'

export const style = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh'
}

const Default = () => (
  <PageTransition>
    <div style={style}>
      <h1>Default Fade Transition</h1>
      <Link to="/slide">To Slide Left Transition</Link>
      <Link to="/none">To No Transition</Link>
      <Link to="/multiple">To Multiple Transitions</Link>
    </div>
  </PageTransition>
)

export default Default
