# Subproduct - a holistic framework

## Project structure

### Visual Axis

* Screens - The whole screen to route between (could be a modal popup)
* Layout - Composite of component to present some part of an interface visually
* Components - Composite of Element to provide some UX
* Elements - Simple brick of an interface (ex: button, input, icon)

### Logic Axis

* Common - Logic which could be used in every app not only this particular one
* Specific - Logic meaningful only in this specific app

### File Structure

```
src/
  index.js
  zero.html
  app.js
  screens/
    some-screen/
      index.js
      actions.js
      reducers.js
      operations.js
    ...
  layouts/
  components/
  elements/
  common/
    actions.js
    reducers.js
    operations.js
```
