# gatsby-plugin-page-transitions

Add page transitions to your Gatsby site.

![gatsby-plugin-page-transition demo](https://github.com/mongkuen/gatsby-plugin-page-transitions/blob/master/transition.gif)

Allows you to declaratively add page transitions, as well as specify unique transition strategies for any page on an individual basis.

## Install

1. Install the `gatsby-plugin-page-transition` plugin:

    `npm install --save gatsby-plugin-page-transition`

    or

    `yarn add gatsby-plugin-page-transition`

## Usage

1. Add into `gatsby-config.js`.

```javascript
// gatsby-config.js

module.exports = {
  plugins: [
    'gatsby-plugin-page-transition'
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
      resolve: 'gatsby-plugin-page-transition',
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
    }}
    transitionStyles={{
      entering: { left: '0%' },
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
