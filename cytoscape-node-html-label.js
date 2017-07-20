;(function () {
    'use strict';

    // small refactor version throttle of Underscore.js
    function throttle(func, wait) {
        var context, args, result;
        var timeout = null;
        var previous = 0;
        var later = function () {
            previous = Date.now();
            timeout = null;
            result = func.apply(context, args);
            if (!timeout) context = args = null;
        };
        return function () {
            var now = Date.now();
            var remaining = wait - (now - previous);
            context = this;
            args = arguments;
            if (remaining <= 0 || remaining > wait) {
                if (timeout) {
                    clearTimeout(timeout);
                    timeout = null;
                }
                previous = now;
                result = func.apply(context, args);
                if (!timeout) context = args = null;
            } else if (!timeout) {
                timeout = setTimeout(later, remaining);
            }
            return result;
        };
    }

    var ProtoParam = function (opt, cy) {
        if (!opt || typeof opt !== "object") {
            opt = {}
        }
        this.query = opt.query || 'node';
        this.width = opt.width || 100; // integer number
        this.positionY = opt.positionY || 'top'; // 'top'|'bottom'
        this.positionX = opt.positionX || 'center'; // 'center'|'left'|'right'
        this.wrapCssClasses = opt.wrapCssClasses || '';
        this.fontSizeBase = opt.fontSizeBase || 10;
        this.tpl = opt.tpl || function (data) {
            return data + ''
        };
        this.elems = this.getElems(cy);

        this._fontSize = null;
        this._wrapHeight = null;
        this._zoom = null;
        this._zoomedWidth = null;
    };
    ProtoParam.prototype.templateNode = function (cyElem) {
        var bounds = cyElem.renderedBoundingBox({includeEdges: false, includeLabels: false});
        var positions = [];
        var diffY = ((bounds.y2 - bounds.y1) - cyElem.numericStyle('height') * this._zoom) / 2 || 0;
        var diffX = ((bounds.x2 - bounds.x1) - cyElem.numericStyle('width') * this._zoom) / 2 || 0;

        switch (this.positionY) {
            case 'top':
            case 'center':
                positions.push('bottom: ' + (this._wrapHeight - bounds.y1 - diffY) + 'px');
                break;
            case 'bottom':
                positions.push('top: ' + (bounds.y2 + diffY) + 'px');
                break;
            default :
                console.error('wrong positionY property!');
                positions.push('top: 0');
        }
        switch (this.positionX) {
            case 'center':
                positions.push('left: ' + ((bounds.x1 + bounds.x2 - this._zoomedWidth) / 2) + 'px');
                break;
            case 'left':
                positions.push('left: ' + (bounds.x1 + diffX) + 'px');
                break;
            case 'right':
                positions.push('left: ' + (bounds.x2 - this._zoomedWidth - diffX) + 'px');
                break;
            default :
                console.error('wrong positionX property!');
                positions.push('left: 0');
        }

        var innerTpl = '';
        try {
            innerTpl = this.tpl(cyElem.data());
        } catch (err) {
            console.error(err);
        }

        return '<div class="' + this.wrapCssClasses + '" style="' + positions.join('; ')
            + ';width:' + this._zoomedWidth + 'px;font-size:' + this._fontSize + 'px;position:absolute;display:inline-block;">'
            + innerTpl
            + '</div>';
    };
    ProtoParam.prototype.updateZoom = function (val) {
        this._zoom = val;
        this._fontSize = val * this.fontSizeBase;
        this._zoomedWidth = this.width * val;
    };
    ProtoParam.prototype.setWrapHeight = function (val) {
        this._wrapHeight = val;
    };
    ProtoParam.prototype.getElems = function (cy) {
        return cy.elements(this.query);
    };
    ProtoParam.prototype.getHtml = function () {
        var html = '';
        var that = this;
        this.elems.forEach(function (d) {
            if (d.isNode()) {
                html += that.templateNode(d);
            }
        });
        return html;
    };

    // registers the extension on a cytoscape lib ref
    var register = function (cytoscape) {

        if (!cytoscape) {
            return;
        } // can't register if cytoscape unspecified

        cytoscape('core', 'nodeHtmlLabels', function (optArr) {

            var _cy = this;
            var _cyContainer = _cy.container();
            var _titlesContainer = document.createElement('div');
            _titlesContainer.style.overflow = 'hidden';
            _titlesContainer.style.zIndex = '10';
            _titlesContainer.style.pointerEvents = 'none';
            _titlesContainer.style.position = 'relative';

            var _cyCanvas = _cyContainer.querySelector('canvas');
            _cyCanvas.parentNode.appendChild(_titlesContainer);

            if (!optArr || typeof optArr !== "object") {
                optArr = []
            }

            var params = [];
            optArr.forEach(function (opt) {
                params.push(new ProtoParam(opt, _cy));
            });

            var handler = throttle(function () {
                var cHeight = _cyCanvas.offsetHeight;
                var cZoom = _cy.zoom();
                _titlesContainer.style.height = cHeight;

                var html = '';
                params.forEach(function (p) {
                    p.updateZoom(cZoom);
                    p.setWrapHeight(cHeight);
                    html += p.getHtml();
                });

                _titlesContainer.innerHTML = html;
            }, 200);

            _cy.on('render', handler);

            return this;
        });
    };

    // noinspection JSUnresolvedVariable
    if (typeof module !== 'undefined' && module.exports) { // expose as a commonjs module
        // noinspection JSUnresolvedVariable, SpellCheckingInspection
        module.exports = function (cytoscape) {
            register(cytoscape);
        };
    } else {
        // noinspection JSUnresolvedVariable
        if (typeof define !== 'undefined' && define.amd) { // expose as an amd/requirejs module
            // noinspection JSUnresolvedFunction
            define('cytoscape-nodeHtmlLabel', function () {
                return register;
            });
        }
    }

    if (typeof cytoscape !== 'undefined') { // expose to global cytoscape (i.e. window.cytoscape)
        register(cytoscape);
    }

})();
