import React from 'react'
import Link from 'gatsby-link'
import { style } from './index'

const None = () => (
  <div style={style}>
    <h1>No Transition</h1>
    <Link to="/">To Default Fade Transition</Link>
    <Link to="/slide">To Slide Left Transition</Link>
    <Link to="/multiple">To Multiple Transitions</Link>
  </div>
)

export default None
