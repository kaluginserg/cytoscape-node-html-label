cytoscape-node-html-label
================================================================================


## Description

add html labels for cytoscape nodes.
Demo: https://kaluginserg.github.io/cytoscape-node-html-label/

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
        query: 'node', // cytoscape query selector
        halign: 'center', // title vertical position. Can be 'left',''center, 'right'
        valign: 'center', // title vertical position. Can be 'top',''center, 'bottom'
        halignBox: 'center', // title vertical position. Can be 'left',''center, 'right'
        valignBox: 'center', // title relative box vertical position. Can be 'top',''center, 'bottom'
        cssClass: '', // any classes will be as attribute of <div> container for every title
        tpl: function(data){return data +''} // your html template here
    }
]
    );
```

#### Thank you for use this small extension.