(function () {
    "use strict";
    var $$find = function (arr, predicate) {
        if (typeof predicate !== "function") {
            throw new TypeError("predicate must be a function");
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
    var LabelElement = (function () {
        function LabelElement(_a, params) {
            var node = _a.node, _b = _a.position, position = _b === void 0 ? null : _b, _c = _a.data, data = _c === void 0 ? null : _c;
            this.updateParams(params);
            this._node = node;
            this.initStyles(params.cssClass);
            if (data) {
                this.updateData(data);
            }
            if (position) {
                this.updatePosition(position);
            }
        }
        LabelElement.prototype.updateParams = function (_a) {
            var _b = _a.tpl, tpl = _b === void 0 ? function () { return ""; } : _b, _c = _a.cssClass, cssClass = _c === void 0 ? null : _c, _d = _a.halign, halign = _d === void 0 ? "center" : _d, _e = _a.valign, valign = _e === void 0 ? "center" : _e, _f = _a.halignBox, halignBox = _f === void 0 ? "center" : _f, _g = _a.valignBox, valignBox = _g === void 0 ? "center" : _g;
            var _align = {
                "top": -.5,
                "left": -.5,
                "center": 0,
                "right": .5,
                "bottom": .5
            };
            this._align = [
                _align[halign],
                _align[valign],
                100 * (_align[halignBox] - 0.5),
                100 * (_align[valignBox] - 0.5)
            ];
            this.tpl = tpl;
        };
        LabelElement.prototype.updateData = function (data) {
            while (this._node.firstChild) {
                this._node.removeChild(this._node.firstChild);
            }
            var children = new DOMParser()
                .parseFromString(this.tpl(data), "text/html")
                .body.children;
            for (var i = 0; i < children.length; ++i) {
                var el = children[i];
                this._node.appendChild(el);
            }
        };
        LabelElement.prototype.getNode = function () {
            return this._node;
        };
        LabelElement.prototype.updatePosition = function (pos) {
            this._renderPosition(pos);
        };
        LabelElement.prototype.initStyles = function (cssClass) {
            var stl = this._node.style;
            stl.position = "absolute";
            if (cssClass && cssClass.length) {
                this._node.classList.add(cssClass);
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
            this._elements = {};
        }
        LabelContainer.prototype.addOrUpdateElem = function (id, param, payload) {
            if (payload === void 0) { payload = {}; }
            var cur = this._elements[id];
            if (cur) {
                cur.updateParams(param);
                cur.updateData(payload.data);
                cur.updatePosition(payload.position);
            }
            else {
                var nodeElem = document.createElement("div");
                this._node.appendChild(nodeElem);
                this._elements[id] = new LabelElement({
                    node: nodeElem,
                    data: payload.data,
                    position: payload.position
                }, param);
            }
        };
        LabelContainer.prototype.removeElemById = function (id) {
            if (this._elements[id]) {
                this._node.removeChild(this._elements[id].getNode());
                delete this._elements[id];
            }
        };
        LabelContainer.prototype.updateElemPosition = function (id, position) {
            var ele = this._elements[id];
            if (ele) {
                ele.updatePosition(position);
            }
        };
        LabelContainer.prototype.updatePanZoom = function (_a) {
            var pan = _a.pan, zoom = _a.zoom;
            var val = "translate(" + pan.x + "px," + pan.y + "px) scale(" + zoom + ")";
            var stl = this._node.style;
            var origin = "top left";
            stl.webkitTransform = val;
            stl.msTransform = val;
            stl.transform = val;
            stl.webkitTransformOrigin = origin;
            stl.msTransformOrigin = origin;
            stl.transformOrigin = origin;
        };
        return LabelContainer;
    }());
    function cyNodeHtmlLabel(_cy, params, options) {
        var _params = (!params || typeof params !== "object") ? [] : params;
        var _lc = createLabelContainer();
        _cy.one("render", function (e) {
            createNodesCyHandler(e);
            wrapCyHandler(e);
        });
        _cy.on("add", addCyHandler);
        _cy.on("layoutstop", layoutstopHandler);
        _cy.on("remove", removeCyHandler);
        _cy.on("data", updateDataOrStyleCyHandler);
        _cy.on("style", updateDataOrStyleCyHandler);
        _cy.on("pan zoom", wrapCyHandler);
        _cy.on("position bounds", moveCyHandler);
        return _cy;
        function createLabelContainer() {
            var _cyContainer = _cy.container();
            var _titlesContainer = document.createElement("div");
            var _cyCanvas = _cyContainer.querySelector("canvas");
            var cur = _cyContainer.querySelector("[class^='cy-node-html']");
            if (cur) {
                _cyCanvas.parentNode.removeChild(cur);
            }
            var stl = _titlesContainer.style;
            stl.position = 'absolute';
            stl['z-index'] = 10;
            stl.width = '500px';
            stl.margin = '0px';
            stl.padding = '0px';
            stl.border = '0px';
            stl.outline = '0px';
            stl.outline = '0px';
            if (options && options.enablePointerEvents !== true) {
                stl['pointer-events'] = 'none';
            }
            _cyCanvas.parentNode.appendChild(_titlesContainer);
            return new LabelContainer(_titlesContainer);
        }
        function createNodesCyHandler(_a) {
            var cy = _a.cy;
            _params.forEach(function (x) {
                cy.elements(x.query).forEach(function (d) {
                    if (d.isNode()) {
                        _lc.addOrUpdateElem(d.id(), x, {
                            position: getNodePosition(d),
                            data: d.data()
                        });
                    }
                });
            });
        }
        function addCyHandler(ev) {
            var target = ev.target;
            var param = $$find(_params.slice().reverse(), function (x) { return target.is(x.query); });
            if (param) {
                _lc.addOrUpdateElem(target.id(), param, {
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
                        _lc.updateElemPosition(d.id(), getNodePosition(d));
                    }
                });
            });
        }
        function removeCyHandler(ev) {
            _lc.removeElemById(ev.target.id());
        }
        function moveCyHandler(ev) {
            _lc.updateElemPosition(ev.target.id(), getNodePosition(ev.target));
        }
        function updateDataOrStyleCyHandler(ev) {
            setTimeout(function () {
                var target = ev.target;
                var param = $$find(_params.slice().reverse(), function (x) { return target.is(x.query); });
                if (param) {
                    _lc.addOrUpdateElem(target.id(), param, {
                        position: getNodePosition(target),
                        data: target.data()
                    });
                }
                else {
                    _lc.removeElemById(target.id());
                }
            }, 0);
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
                x: node.position("x"),
                y: node.position("y")
            };
        }
    }
    var register = function (cy) {
        if (!cy) {
            return;
        }
        cy("core", "nodeHtmlLabel", function (optArr, options) {
            return cyNodeHtmlLabel(this, optArr, options);
        });
    };
    if (typeof module !== "undefined" && module.exports) {
        module.exports = function (cy) {
            register(cy);
        };
    }
    else {
        if (typeof define !== "undefined" && define.amd) {
            define("cytoscape-nodeHtmlLabel", function () {
                return register;
            });
        }
    }
    if (typeof cytoscape !== "undefined") {
        register(cytoscape);
    }
}());
//# sourceMappingURL=cytoscape-node-html-label.js.map