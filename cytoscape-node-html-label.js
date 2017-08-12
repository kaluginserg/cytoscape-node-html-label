(function () {
  "use strict";
  var $$find = function (arr, predicate) {
    if (typeof predicate !== 'function') {
      throw new TypeError('predicate must be a function');
    }
    var length = arr.length >>> 0;
    var thisArg = arguments[1];
    var value;
    for (var i = 0; i < length; i++) {
      value = arr[i];
      if (predicate.call(thisArg, value, i, arr)) {
        return value;
      }
    }
    return undefined;
  };
  var $$assign = function (target) {
    'use strict';
    var arg = [];
    for (var _i = 1; _i < arguments.length; _i++) {
      arg[_i - 1] = arguments[_i];
    }
    if (target === undefined || target === null) {
      throw new TypeError('Cannot convert first argument to object');
    }
    var to = Object(target);
    for (var i = 1; i < arguments.length; i++) {
      var nextSource = arguments[i];
      if (nextSource === undefined || nextSource === null) {
        continue;
      }
      var keysArray = Object.keys(Object(nextSource));
      for (var nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex++) {
        var nextKey = keysArray[nextIndex];
        var desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
        if (desc !== undefined && desc.enumerable) {
          to[nextKey] = nextSource[nextKey];
        }
      }
    }
    return to;
  };
  var LabelElement = (function () {
    function LabelElement(_a) {
      var node = _a.node, id = _a.id, baseClassName = _a.baseClassName, _b = _a.tpl, tpl = _b === void 0 ? function () {
          return "";
        } : _b, _c = _a.cssClass, cssClass = _c === void 0 ? null : _c, _d = _a.position,
        position = _d === void 0 ? null : _d, _e = _a.data, data = _e === void 0 ? null : _e, _f = _a.halign,
        halign = _f === void 0 ? "center" : _f, _g = _a.valign, valign = _g === void 0 ? "center" : _g,
        _h = _a.halignBox, halignBox = _h === void 0 ? "center" : _h, _j = _a.valignBox,
        valignBox = _j === void 0 ? "center" : _j;
      var _align = {
        "top": -.5,
        "left": -.5,
        "center": 0,
        "right": .5,
        "bottom": .5
      };
      var _alignBox = {
        "top": -100,
        "left": -100,
        "center": -50,
        "right": 0,
        "bottom": 0
      };
      this._align = [_align[halign], _align[valign], _alignBox[halignBox], _alignBox[valignBox]];
      this._node = node;
      this.id = id;
      this._baseElementClassName = baseClassName;
      this.cssClass = cssClass;
      this.tpl = tpl;
      this.init();
      if (data) {
        this.updateData(data);
      }
      if (position) {
        this.updatePosition(position);
      }
    }

    LabelElement.prototype.updateData = function (data) {
      try {
        this._node.innerHTML = this.tpl(data);
      }
      catch (err) {
        console.error(err);
      }
    };
    LabelElement.prototype.getNode = function () {
      return this._node;
    };
    LabelElement.prototype.updatePosition = function (pos) {
      this._renderPosition(pos);
    };
    LabelElement.prototype.init = function () {
      this._node.setAttribute("id", this.id);
      this._node.setAttribute("class", this._baseElementClassName);
      if (this.cssClass && this.cssClass.length) {
        this._node.classList.add(this.cssClass);
      }
    };
    LabelElement.prototype._renderPosition = function (position) {
      var prev = this._position;
      var x = position.x + this._align[0] * position.w;
      var y = position.y + this._align[1] * position.h;
      if (!prev || prev[0] !== x || prev[1] !== y) {
        this._position = [x, y];
        var valRel = "translate(" + this._align[2] + "%," + this._align[3] + "%) ";
        var valAbs = "translate(" + x.toFixed(2) + "px," + y.toFixed(2) + "px) ";
        var val = valRel + valAbs;
        var stl = this._node.style;
        stl.webkitTransform = val;
        stl.msTransform = val;
        stl.transform = val;
      }
    };
    return LabelElement;
  }());
  var LabelContainer = (function () {
    function LabelContainer(node) {
      this._node = node;
      this._cssWrap = 'cy-node-html-' + (+new Date());
      this._cssElem = this._cssWrap + '__e';
      this.addCssToDocument();
      this._node.className = this._cssWrap;
      this._elements = [];
    }

    LabelContainer.prototype.addElem = function (id, param, payload) {
      if (payload === void 0) {
        payload = {};
      }
      var nodeElem = document.createElement('div');
      this._node.appendChild(nodeElem);
      var newElem = new LabelElement($$assign({}, param, {
        node: nodeElem,
        id: id,
        baseClassName: this._cssElem,
        data: payload.data,
        position: payload.position
      }));
      this._elements.push(newElem);
    };
    LabelContainer.prototype.removeElemById = function (id) {
      for (var j = this._elements.length - 1; j >= 0; j--) {
        if (this._elements[j].id === id) {
          console.log(j);
          this._node.removeChild(this._elements.splice(j, 1)[0].getNode());
          break;
        }
      }
    };
    LabelContainer.prototype.updateElemPosition = function (data) {
      var ele = this.getElemById(data.id);
      if (ele) {
        ele.updatePosition(data.position);
      }
    };
    LabelContainer.prototype.getElemById = function (id) {
      return $$find(this._elements, function (x) {
        return x.id === id;
      });
    };
    LabelContainer.prototype.updatePanZoom = function (_a) {
      var pan = _a.pan, zoom = _a.zoom;
      var val = "translate(" + pan.x + "px," + pan.y + "px) scale(" + zoom + ")";
      var stl = this._node.style;
      var origin = 'top left';
      stl.webkitTransform = val;
      stl.msTransform = val;
      stl.transform = val;
      stl.webkitTransformOrigin = origin;
      stl.msTransformOrigin = origin;
      stl.transformOrigin = origin;
    };
    LabelContainer.prototype.addCssToDocument = function () {
      var stylesWrap = 'position:absolute;z-index:10;width:500px;pointer-events:none;margin:0;padding:0;border:0;outline:0';
      var stylesElem = 'position:absolute';
      document.querySelector('head').innerHTML +=
        "<style>." + this._cssWrap + "{" + stylesWrap + "} ." + this._cssElem + "{" + stylesElem + "}</style>";
    };
    return LabelContainer;
  }());

  function cyNodeHtmlLabel(_cy, params) {
    console.log('cyNodeHtmlLabel');
    var _params = (!params || typeof params !== "object") ? [] : params;
    var _lc = createLabelContainer();
    _cy.one('render', function (e) {
      createNodesCyHandler(e);
      wrapCyHandler(e);
    });
    _cy.on('add', addCyHandler);
    _cy.on('layoutstop', layoutstopHandler);
    _cy.on('remove', removeCyHandler);
    _cy.on('data', updateDataCyHandler);
    _cy.on('pan zoom', wrapCyHandler);
    _cy.on('drag', moveCyHandler);
    return _cy;

    function createLabelContainer() {
      var _cyContainer = _cy.container();
      var _titlesContainer = document.createElement('div');
      var _cyCanvas = _cyContainer.querySelector('canvas');
      var cur = _cyContainer.querySelector('[class^="cy-node-html"]');
      if (cur) {
        _cyCanvas.parentNode.removeChild(cur);
      }
      _cyCanvas.parentNode.appendChild(_titlesContainer);
      return new LabelContainer(_titlesContainer);
    }

    function createNodesCyHandler(_a) {
      var cy = _a.cy;
      _params.forEach(function (x) {
        cy.elements(x.query).forEach(function (d) {
          if (d.isNode()) {
            _lc.addElem(d.id(), x, {
              position: getNodePosition(d),
              data: d.data()
            });
          }
        });
      });
    }

    function addCyHandler(ev) {
      var target = ev.target;
      var param = $$find(_params, function (x) {
        return target.is(x.query);
      });
      if (param) {
        _lc.addElem(target.id(), param, {
          position: getNodePosition(target),
          data: target.data()
        });
      }
    }

    function layoutstopHandler(_a) {
      var cy = _a.cy;
      _params.forEach(function (x) {
        cy.elements(x.query).forEach(function (d) {
          if (d.isNode()) {
            _lc.updateElemPosition({
              id: d.id(),
              position: getNodePosition(d)
            });
          }
        });
      });
    }

    function removeCyHandler(ev) {
      var target = ev.target;
      var param = $$find(_params, function (x) {
        return target.is(x.query);
      });
      if (param) {
        _lc.removeElemById(target.id());
      }
    }

    function moveCyHandler(ev) {
      var target = ev.target;
      var param = $$find(_params, function (x) {
        return target.is(x.query);
      });
      if (param) {
        _lc.updateElemPosition({
          id: target.id(),
          position: getNodePosition(target)
        });
      }
    }

    function updateDataCyHandler(ev) {
      console.log('do update data', ev);
    }

    function wrapCyHandler(_a) {
      var cy = _a.cy;
      _lc.updatePanZoom({
        pan: cy.pan(),
        zoom: cy.zoom()
      });
    }

    function getNodePosition(node) {
      return {
        w: node.width(),
        h: node.height(),
        x: node.position('x'),
        y: node.position('y')
      };
    }
  }

  var register = function (cy) {
    if (!cy) {
      return;
    }
    cy('core', 'nodeHtmlLabel', function (optArr) {
      return cyNodeHtmlLabel(this, optArr);
    });
  };
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = function (cy) {
      register(cy);
    };
  }
  else {
    if (typeof define !== 'undefined' && define.amd) {
      define('cytoscape-nodeHtmlLabel', function () {
        return register;
      });
    }
  }
  if (typeof cytoscape !== 'undefined') {
    register(cytoscape);
  }
}());
//# sourceMappingURL=cytoscape-node-html-label.js.map