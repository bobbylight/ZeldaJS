ZeldaJS - A Legend of Zelda clone in TypeScript
===============================================
[![Build Status](https://travis-ci.org/bobbylight/ZeldaJS.svg?branch=master)](https://travis-ci.org/bobbylight/ZeldaJS)

A WIP clone of the Legend of Zelda.  This will include a very basic editor as well.
Feel free to [try it out in its current state](http://bobbylight.github.io/ZeldaJS/).

Licensed under [an MIT license](LICENSE.txt).

## Hacking
This game depends on `gulp` for its builds and `bower` for its runtime
dependencies.  It also uses `typings` for TypeScript definition files for libraries
it uses.  To install these if you don't already have them:

```shell
npm install -g gulp
npm install -g bower
npm install -g typings
```

Next, check out the project, install `gulp` locally, run `bower` to pull
down all dependencies, then run `tsd` to get the type definitions:

```shell
git clone https://github.com/bobbylight/ZeldaJS.git
cd ZeldaJS
npm install
bower install
typings install
```

The source code lives in `src/app`.  You can build both the development and
production (minified) versions of the game by running `gulp`.  The development
version will be built in `src/js` and the production version in `dist/`.

`index.html` demos the most recent build of the game, while `editor.html` demos the most recent build of the map
editor.

## Roadmap

### Implemented so far:

* Game
  - Map loading
  - Basic resource loading, Link sprite movement
  - Music
  - Moving between screens, smooth screen transitions (though only a portion of the map is implemented)
  - Use of sword (Z key)
  - Basic enemies that can die
* Editor
  - Screen design, single tile per cell (no burnable bushes, bombable walls, etc.)
  - Select enemy group per screen

### Coming next (in no particular order):

* More accurate enemy spawning and taking-damage animations
* Going into caves animation
* Link getting hit
* Expanded map
* Define enemies for each screen in the editor
