# gatsby-plugin-page-transitions

## ** **NOT COMPATIABLE WITH GATSBY 2** **

The API and the features this plugin provides is no longer possible with Gatsby 2. For simple page fade transitions the Gatsby team has provided an [adequate example](https://github.com/gatsbyjs/gatsby/tree/master/examples/using-page-transitions).

With Gatsby 2, the plugin will **FAIL TO BUILD** because the `replaceHistory` API [has been removed](https://www.gatsbyjs.org/docs/migrating-from-v1-to-v2/#browser-api-replacehistory-was-removed). While the replacement [`onRouteUpdate`](https://www.gatsbyjs.org/docs/browser-apis/#onRouteUpdate) callback allows you to detect URL changes, it only does so when the URL has **ALREADY** been updated.

This plugin needs to know **BEFORE** the URL changes, and relies on replacing the history and letting [`history.block()`](https://github.com/ReactTraining/history#blocking-transitions) give the page time to complete the exit transition for custom/multiple transitions before unmounting.

Gatsby 2's removal of `replaceHistory` means that exit transitions will always be bugged, because the page isn't blocked and your component will disappear immediately as it unmounts.

The official example works by using [`gatsby-plugin-layout`](https://github.com/gatsbyjs/gatsby/blob/master/examples/using-page-transitions/gatsby-config.js) to load a [layout component](https://github.com/gatsbyjs/gatsby/blob/master/examples/using-page-transitions/src/layouts/index.js) with the [`TransitionGroup`](https://github.com/gatsbyjs/gatsby/blob/master/examples/using-page-transitions/src/components/transition.js) inside that never unmounts, letting the `TransitionGroup` handle exit transition timing. This should be adequate for most users, but renders this plugin redundant in the value it provides.

<hr>

## ** **ONLY APPLICABLE FOR GATSBY 1** **

Add page transitions to your Gatsby site.

![gatsby-plugin-page-transitions demo](https://cdn.rawgit.com/mongkuen/gatsby-plugin-page-transitions/da195e50/transition.gif)

Allows you to declaratively add page transitions, as well as specify unique transition strategies for any page on an individual basis.

Examples of usage can be found in the Github repository [here](https://github.com/mongkuen/gatsby-plugin-page-transitions/tree/master/examples).

Examples cover:
- Default Transition
- Custom Transition
- No Transition
- Multiple Transitions

## Install

1. Install the `gatsby-plugin-page-transitions` plugin:

    `npm install --save gatsby-plugin-page-transitions`

    or

    `yarn add gatsby-plugin-page-transitions`

## Usage

1. Add into `gatsby-config.js`.

```javascript
// gatsby-config.js

module.exports = {
  plugins: [
    'gatsby-plugin-page-transitions'
  ]
}
```

2. Import `PageTransition`, and wrap the root of each **page** where transitions are desired with the `PageTransition` component

```javascript
import React from 'react';
import PageTransition from 'gatsby-plugin-page-transitions';

const Index = () => (
  <PageTransition>
    <div>
      <span>Some</span>
      <span>Content</span>
      <span>Here</span>
    </div>
  </PageTransition>
)
```

Pages that are not wrapped with the `PageTransition` element navigate immediately, allowing you to decaratively specify which pages has transitions.

## Configuration Options
If no options are specified, the plugin defaults to:

1. Transition time of 250ms. This is the amount of time the browser blocks navigation, waiting for the animation to finish.
2. Opacity `ease-in-out` transition from the `react-transition-group` examples, [here](https://reactcommunity.org/react-transition-group/transition).

There is a convenience option to let you modify the transition time on the default opacity transitions, like so:
```javascript
// gatsby-config.js
module.exports = {
  plugins: [
    {
      resolve: 'gatsby-plugin-page-transitions',
      options: {
        transitionTime: 500
      }
    }
  ]
}
```

## Advanced
If you want to specify your own transition styles when the component enters or leaves, you can do so by passing props into the `PageTransition` component.

The component takes in 3 props:
1. `duration`: How long the browser should wait for the animation until navigating. This number should match the CSS `transition` time you chose to
2. `defaultStyle`: JS style object of what the component looks like default
3. `transitionStyles`: Object with keys of the transition states (`entering`, `entered`, `exiting`, `exited`) that have JS style objects of the styles of each transition state.

These follow the transitional styling convention from `react-transition-group` [here](https://reactcommunity.org/react-transition-group/transition).
The plugin is a wrapper around `react-transition-group`, so please see their [documentation](https://reactcommunity.org/react-transition-group/transition) for implementation details.

For an example, if you wanted a transition to:
- Slide in and out from the left
- Lasting 500ms
- Transitions with a cubic-bezier function

Just pass your desired transition down as props into the `PageTransition` element.

```javascript
import React from 'react';
import PageTransition from 'gatsby-plugin-page-transitions';

const Index = () => (
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
    <div>
      <span>Some</span>
      <span>Content</span>
      <span>Here</span>
    </div>
  </PageTransition>
)
```

Notice that `500ms` string is specified as the transition length in the JS CSS object. The component needs to be passed `500` in the `transitionTime` prop, so the browser can wait for the animation to finish before navigation to the next path.

You can use this method to specify unique transition strategies for each page individually, or wrap `PageTransition` yourself for a custom reusable transition.

## Page Transition Event
At a high level the plugin operates this way:
1. User clicks a link to another page.
2. Page change is caught, and navigation is paused for however long the `transitionTime` is specified.
3. Page transition event `'gatsby-plugin-page-transition::exit'` is fired.
4. Rendered components listening to the page transition event plays the transition.
5. Pause is released, and browser navigates.

If you require even more control, such as making different elements on the page transition in different ways, you'll need to listen for the page's transition event. Full implementation found in the examples [here](https://github.com/mongkuen/gatsby-plugin-page-transitions/tree/master/examples).

If you are using `react-transition-group`'s `Transition` component as specified [here](http://reactcommunity.org/react-transition-group/transition), then your page might generically look something like this:

```javascript
import React from 'react'
import PageTransition from 'gatsby-plugin-page-transitions'
import Transition from 'react-transition-group/Transition'

const pageTransitionEvent = 'gatsby-plugin-page-transition::exit';
const defaultStyle = {
  // Default transition styling
}
const transitionStyles = {
  // Transition styling
}

class CustomComponent extends React.Component {
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
        <Transition in={this.state.in} timeout={500}>
          {(state) => (
            <div style={{
              ...defaultStyle,
              ...transitionStyles[state]
            }}>
              Elements
            </div>
          )}
        </Transition>
      </PageTransition>
    )
  }
}
```

This component is doing several things:

Per `react-transition-group`, there is local state `this.state.in` tracking if transitioning elements should be "in" or not

1. `this.state.in` begins as `false`, with elements not "in".

2. On mount, `this.state.in` is flipped to `true`, and elements are transitioned in.

3. On mount, component begins listening to `gatsby-plugin-page-transition::exit`

4. When user navigates away, global window `gatsby-plugin-page-transition::exit` event fires

5. `<PageTransition transitionTime={500}>` component will handle event by pausing navigation, with an allotted `transitionTime` of 500ms

6. Local component `listenHandler` sets `this.state.in` to `false`, and elements are transitioned out. Transitions should take 500ms or less, if they are to complete before page navigation.

7. Transitions complete, page navigates, component cleans up listeners.
