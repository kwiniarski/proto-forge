# proto-forge

> Small library for instrumenting `Object.defineProperties` and creating reusable prototypes.

What does it mean? **proto-forge** aim is to provide markup convention for objects, which will create instrumentation for `Object.defineProperty`. This includes:

* creating getters/setters form set/get methods;
* setting `enumerated` property depending on presence of `_` sign;



## Installation

`npm install proto-forge`

## Usage

### Basic example

```js
proto.forge({
	_id: 1
	basePath: null,
	assign() {
	},
	getPath() {
	},
	getParent() {
	},
	setParent(value) {
	}
});
```

will create object:

```js
{
	basePath: null,
	assign: [Function],
	path: [Getter],
	parent: [Getter/Setter],
}
```

As you can see, all methods beginning with set or get where used to create getter/setter properties. For example `getParent` and `setParent` where used to create `parent` property. Source methods became not enumerable, however they are still accessible. Another example is `_id` property. Because it starts with underscore it became not enumerable. This way you can control how destination object is created.

## License

Copyright (c) 2015 Krzysztof Winiarski

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.