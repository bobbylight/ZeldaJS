# General guidelines for writing tests:
## Writing tests for classes not under `src/editor/`:
When asked to write unit tests for a *.ts file that is *not* in the `src/editor/` subfolder, follow these instructions:

* Write unit tests for the specific file requested, found somewhere under `src/`.
* Follow the patterns for unit tests found in other `*.spec.ts files` in the same package.
* If the tests have to interact with a `ZeldaGame`, don't mock the entire `ZeldaGame` instance completely; 
  rather, instantiate it and mock individual fields on it.
* If you have to mock a `ZeldaGame`'s assets, e.g. `game.assets`. don't replace it entirely, but rather
  call `game.assets.set('assetName', value)`, which is an actual method, and set the value you need.
  * For example, for `game.assets.get('valueYouNeed')`, call `game.assets.set('valueYouNeed', mockSpriteSheet)`, where
    `mockSpriteSheet` is a `SpriteSheet`, if the underlying code expects the result of `get()` to be a `SpriteSheet`.
  * Similarly, if the underlying code expects an `Image`, create a `mockImage` object literal. Give it a `draw()`
    method that is a `vi.fn()`.
  * Do not create the `value` by defining a class and instantiating it. Instead, just use an object literal.
    Append `as unknown as <appropriate-classname>` to the object literal to appease tsc. If you don't know the
    appropriate classname, use `as unknown as any`.
* If a test involves a CanvasRenderingContext2D, but also has a `ZeldaGame` instance, don't create a new `canvas` and
  get its rendering context manually; instead, write `const ctx = game.getRenderingContext();` and use that.
* If a test involves a CanvasRenderingContext2D, but *doesn't* have a `ZeldaGame` instance. don't mock the
  CanvasRenderingContext with `{} as CanvasRenderingContext2D`. Instead, since we have the `canvas` package as a
  devDependency, create a real HTMLCanvasElement and get its context, then `vi.spyOn()` the relevant methods on its
  context. Again, only do this if there is no `ZeldaGame` instance in scope, as then you can use `game.getContext()`.
  * Do not cast the call to `getContext()` as `CanvasRenderingContext2D`.
  * Since `canvas.getContext()` can return null, add an `expect(ctx).toBeDefined();` statement, then wrap all
    further lines in that test with `if (ctx) { ... }`.
  * When you do this, be sure to always add a `document.body.innerHTML = '';` line in a
    top-level `afterEach()` block to ensure that the DOM is cleaned up after each test.

## Writing tests for classes under `src/editor/`:
When asked to write unit tests for a *.ts or *.vue file that is in the `src/editor/` subfolder, follow these
instructions:

* Write unit tests for the specific file requested, found somewhere under `src/editor/`.
* Follow the patterns for unit tests found in other `*.spec.ts` and `*.spec.vue` files in the same directory.
* Use `testing-library` rather than `@vue/test-utils`
* Specify how vuetify is configured and the component is rendered in a `beforeEach()` block. In particular follow the
  tests in `enemy-selector.test.ts` for patterns
* For tests of `*.vue` files, always add a `document.body.innerHTML = '';` line in a
  top-level `afterEach()` block to ensure that the DOM is cleaned up after each test.

## For tests in any subfolder:
Follow these instructions for any test at all, in any folder. These are in addition to any instructions
specific to a relevant specific folder listed above:

* Don't write `expect()` statements that verify the value of private or protected fields.
* Don't write tests for private or protected methods.
* Don't use `eslint-ignore` in generated code.
* Don't use `@ts-expect-error` in generated code. If you need to do so, tell me you need more information to proceed.
* Don't use `@ts-ignore` in generated code. If you need to do so, tell me you need more information to proceed.
* Don't add one-line comments describing what a single line of code does. Only add comments if
  it is for a block of code. For example, `// Make method X a spy` is not needed before a line that
  calls `vi.spyOn(...)`.
* When writing multiple tests for the same method, use `describe()` blocks to group them.
* When import statements import multiple items from the same package, list them in alphabetical order.
* When including multiple `describe` blocks for multiple methods, ensure they are listed in
  alphabetical order. One exception to this is test blocks for a constructor should always be the first test block.
* When a `describe` block is the top level for all tests for a method, its name should be the method name followed by
  parentheses, e.g. `describe('myMethod()', () => { ... });`.
* If a class has public fields, reference them with dot-notation. Don't reference them via bracket-notation.
* If you want to verify a public field has an expected value, do not compare it to a private field in any variable
  via bracket notation (e.g. no `expect(publicField).toBe(instance['privateField'])`). Instead, compare it to
  the expected literal value, or to a public field on another instance. If you can't do that, tell me you need more
  information to proceed.
* Always use `toHaveBeenCalledExactlyOnceWith(<args>)` over `toHaveBeenCalledWith()` if you know the call count is 1
  and know the arguments.
* Always use `toHaveBeenCalledOnce()` or `toHaveBeenCalledtimes(n)` over `toHaveBeenCalled()`.
* Do not set any private variables via casting to `any` such as `(foo as any).val = 3;`. Instead, prefer using
  `vi.spyOn()` to mock method return values. Do not write tests if you cannot do the setup without manually setting
  values of private fields, unless you can access them via setters or other methods on the class.
* Never use an `as any` type assertion. For example, never write `expect(foo as any).toEqual(someValue);`.
* If a test involves calling a method that takes an argument of type `Actor` (that specific class, not a subclass), use
  `new Octorok(game)` for the argument's value in the test. If `game` is not currently  defined, create a new
  `ZeldaGame` with that name as well.
* If any test requires you to pass `{} as any` as an argument to a method, don't generate anything and instead, tell me
  you need more information to proceed.
* Prefer `toEqual()` over `toBe()`, unless you am specifically testing for object identity.
* If a test references a `ZeldaGame`'s `link` field, initialize that as a `new Link(game)` in a
  `beforeEach()` block.
