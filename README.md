# ZeldaJS - A Legend of Zelda clone in TypeScript
![Build](https://github.com/bobbylight/ZeldaJS/actions/workflows/build.yml/badge.svg)
![CodeQL](https://github.com/bobbylight/ZeldaJS/actions/workflows/codeql-analysis.yml/badge.svg)
[![Dependency Status](https://img.shields.io/david/bobbylight/ZeldaJS.svg)](https://david-dm.org/bobbylight/ZeldaJS)
[![Dev Dependency Status](https://img.shields.io/david/dev/bobbylight/ZeldaJS.svg)](https://david-dm.org/bobbylight/ZeldaJS?type=dev)

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
npm run serve
```

The game will be served from [http://localhost:8080](), and hot deploy any changes.

This game is built with `vue-cli`.  Development is done with `npm` scripts:

```bash
npm run clean          # Cleans build directories
npm run serve          # Runs app for development.  Hot deploys
npm run build          # Builds the application in dist/
npm run test:unit      # Runs unit tests and generates coverage
npm run lint           # Lints files
npm run doc            # Generates documentation
npm run build-electron # Doesn't currently work (broke with move to vue-cli)
npm run pack           # Doesn't currently work (broke with move to vue-cli)
npm run dist           # Doesn't currently work (broke with move to vue-cli)
```

The source code lives in `src/`, and is built into `dist/`.
`index.html` is the game itself, while `editor.html` is a simple map editor.

## Desktop Build
*Note:* These steps currently don't work.  Need to be fixed after the conversion
to vue-cli broke them.

A desktop build can be created:

```bash
npm run build-electron # Builds desktop resources into build/electron
npm run pack           # Creates unpacked game in dist/
npm run dist           # Creates unpacked game and installer in dist/
```

This is still a little rough around the edges, but works, at least on windows.

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
  - Enter and exit cave and level events

### Coming next (in no particular order):

* More accurate Link getting hit colors
* More accurate enemy spawning
* Expanded map
* Gibdos
