ZeldaJS - A Legend of Zelda clone in TypeScript
===============================================
A WIP clone of the Legend of Zelda.  This will include a very basic editor as well.
Feel free to [try it out in its current state](http://bobbylight.github.io/ZeldaJS/).

Licensed under [an MIT license](LICENSE.txt).

## Hacking
This game depends on `gulp` for its builds and `bower` for its runtime
dependencies.  It also uses `tsd` for TypeScript definition files for libraries
it uses.  To install these if you don't already have them:

```shell
npm install -g gulp
npm install -g bower
npm install -g tsd
```

Next, check out the project, install `gulp` locally, run `bower` to pull
down all dependencies, then run `tsd` to get the type definitions:

```shell
git clone https://github.com/bobbylight/ZeldaJS.git
cd ZeldaJS
npm install
bower install
tsd install
```

The source code lives in `src/app`.  You can build both the development and
production (minified) versions of the game by running `gulp`.  The development
version will be built in `src/js` and the production version in `dist/`.

`index.html` demos the most recent build of the game, while `editor.html` demos the most recent bulid of the map
editor.

## Roadmap

### Implemented so far:

* Map loading
* Basic resource loading, Link sprite movement
* Moving between screens, smooth screen transitions (though only a couple of screens are implemented on the map)
* Use of sword (Z key)

### Coming next (in no particular order):

* Music
* Octorocks
* Going into caves animation
