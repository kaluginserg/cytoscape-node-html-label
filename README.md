cytoscape-node-html-label
================================================================================


## Description

labels for cytoscape nodes


## Dependencies

 * Cytoscape.js ^3.0.0


## Usage instructions

Download the library:
 * via npm: `npm install cytoscape-node-html-label`,
 * via bower: `bower install cytoscape-node-html-label`, or
 * via direct download in the repository (probably from a tag).

#### Plain HTML/JS has the extension registered for you automatically:
```html
<script src="http://cytoscape.github.io/cytoscape.js/api/cytoscape.js-latest/cytoscape.min.js"></script>
<script src="cytoscape-node-html-label.js"></script>
```

#### RequireJs approach:
`require()` the library as appropriate for your project:

CommonJS:
```js
var cytoscape = require('cytoscape');
var nodeHtmlLabel = require('cytoscape-node-html-label');
nodeHtmlLabel( cytoscape ); // register extension
```

AMD:
```js
require(['cytoscape', 'cytoscape-node-html-label'], function( cytoscape, nodeHtmlLabel ){
  nodeHtmlLabel( cytoscape ); // register extension
});
```


## API

nodeHtmlLabel parameter is an array of options:

```js
cy.nodeHtmlLabel(
[
    {
        query: 'node', // cy query
        width: 100, // title width
        positionY: 'top', // title vertical position. Can be 'top' or 'bottom'
        positionX: 'center',  // title vertical position. Can be 'top' or 'bottom'
        wrapCssClasses: 'some-classes', // any classes will be as attribute of <div> container for every title
        fontSizeBase: 10,  // font-size for zoom == 1. If you want customize font-size in template - use 'em' units in css.
        tpl: function(data){return data +''} // your html template here
    }
]
    );
```

#### Thank you for use this small extension.