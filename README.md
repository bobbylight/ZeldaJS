# ZeldaJS - A Legend of Zelda clone in TypeScript
[![Build Status](https://travis-ci.org/bobbylight/ZeldaJS.svg?branch=master)](https://travis-ci.org/bobbylight/ZeldaJS)
[![Dependency Status](https://img.shields.io/david/bobbylight/ZeldaJS.svg)](https://david-dm.org/bobbylight/ZeldaJS)
[![Dev Dependency Status](https://img.shields.io/david/dev/bobbylight/ZeldaJS.svg)](https://david-dm.org/bobbylight/ZeldaJS?type=dev)
[![Coverage Status](https://coveralls.io/repos/github/bobbylight/ZeldaJS/badge.svg?branch=master)](https://coveralls.io/github/bobbylight/ZeldaJS?branch=master)

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

To get started right away, run:

```bash
npm run dev
```

The game will be served from [http://localhost:8080](), and hot deploy any changes.

This game is built with `webpack`.  Development is done with `npm` scripts:

```bash
npm run clean   # Deletes build/ and doc/ folders
npm run dev     # Start webpack, watch for changes, test at localhost:8080
npm run watch   # Start webpack, watch for changes (prefer "dev")
npm run build   # Build into build/
npm run start   # Nothing (for now)
npm run test    # Run unit tests
npm run cover   # Run unit tests, generate coverage report in coverage/
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
  - Entering and exiting caves
  - Use of sword (Z key)
  - Drop bombs, though they do nothing (X key)
  - Basic enemies that can die
  - Link takes damage from enemies and projectiles, and can die
  - Enemies drop rupees and hearts
* Editor
  - Screen design, single tile per cell (no burnable bushes, bombable walls, etc.)
  - Select enemies per screen
  - Enter and exit caves events

### Coming next (in no particular order):

* More accurate Link getting hit colors
* More accurate enemy spawning
* Expanded map
* Lynels
* Gibdos
