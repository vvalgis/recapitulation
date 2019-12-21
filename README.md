# Subproduct - a holistic framework

## Project structure

### Visual Axis

* Screens - The whole screen to route between (could be a modal popup)
* Layout - A composite of components to present some part of an interface visually
* Components - A composite of Elements to provide some UX
* Elements - A simple brick of an interface (ex: button, input, icon)

### Logic Axis

* Common - Logic which could be used in every app not only this particular one
* Specific - Logic meaningful only in this specific app

### File Structure

```
src/
  zero.html
  app.js
  screens/
    some-simple-screen.js
    some-screen/
      index.js
      styles.sss
      components/
    ...
  layouts/
  components/
  operations/
  elements/
  libs/
    common-css/
    common-hooks/
    router/
    config/
    signals.js
    store.js
```
