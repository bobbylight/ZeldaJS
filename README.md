# ZeldaJS - A Legend of Zelda clone in TypeScript
[![Build Status](https://travis-ci.org/bobbylight/ZeldaJS.svg?branch=master)](https://travis-ci.org/bobbylight/ZeldaJS)

A WIP clone of the Legend of Zelda.  This will include a very basic editor as well.
Feel free to [try it out in its current state](http://bobbylight.github.io/ZeldaJS/).

Licensed under [an MIT license](LICENSE.txt).

## Hacking
First, check out the project and install all dependencies locally via `npm`:

```bash
git clone https://github.com/bobbylight/ZeldaJS.git
cd ZeldaJS
npm install
```

This game is built with `webpack`.  Development is done with `npm` scripts:

```bash
npm run clean   # Deletes build/ folder
npm run watch   # Start webpack, watch for changes
npm run build   # Build into build/
npm run start   # Nothing (for now)
npm run test    # Run unit test
```

The source code lives in `src/`, and is built into `build/web/`.
`index.html` is the game itself, while `editor.html` is a simple map editor.

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
