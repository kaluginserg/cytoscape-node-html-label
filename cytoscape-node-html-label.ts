// todo 1. Сделать адекватное реагирование на разные события (изменение данных \ рендер). С минимумом манипуляций с DOM!
// todo 2. Сделать позиционирование лэйблов (vertical-align: 'to-bottom | to-top') // default - to-bottom
// todo 2.1. сделать translate позиционирование для всего кадра - что бы очень быстро отрисовывать для частых операций pan и zoom
// todo 2.2. нужно  позиционирование относительно границ ноды. Сделать как сейчас в cytoscape. 'top left' или 'center center'
// todo 2.3. сделать translateX translateY (top center left right bottom) 0%, -50%, -100%.
// todo 2.4. все позиционирование сделать на transform2d css !!
// complete 3. динамически добавлять стили для заголовков в dom (class="Name"), что бы не засорять инлайн стилями. insertRule.
// complete 4. добавить комплексный тест на инициализацию в дом и отрисовку одной ноды, и ее перерисовку.
// todo 5. Доработать демо - сделать понятные подписи, для всех вариантов выравнивания.
// todo 6. Доработать Readme - добавить блок по браузерной поддержке, и блок - инструкцию для тех кто присоединится к доработке +
// блок по ограничениям техническим количество нод.
// todo 7. Добавить метод remove() - которые будет сбрасывать все настройки плагина.
// todo 8. Сделать размер шрифта - независимым от font-size, что бы все срабатывало автоматом через transform2d
// todo 9. Доработать readme - добавить раздел "Возможности".


// cy.zoom() - текущий зум
// $el.style.width = cy.width() * cy.zoom()
// $el.style.height = cy.height() *cy.zoom()

// cy.pan() - позиция начала координат!
// $el.style.top = cp.y
// $el.style.left = cp.x

interface CytoscapeNodeHtmlParams {
  query ?: string;
  width ?: number;
  positionY ?: string;
  positionX ?: string;
  wrapCssClasses ?: string;
  fontSizeBase ?: number;
  tpl ?: (d: any) => string;
}

declare const require: any;
declare const module: any;
declare const define: any;
declare const cytoscape: any;


(function () {
  const CSS_CLASS_WRAP = 'cy-node-html-' + (+new Date());
  const CSS_CLASS_ELEMENT = CSS_CLASS_WRAP + '__e';

  class ProtoParam {
    query: string;
    width: number;
    positionY: string;
    positionX: string;
    wrapCssClasses: string;
    fontSizeBase: number;
    tpl: (data: any) => string;
    tFontSize: number;
    tWrapHeight: number;
    tZoom: number;
    tZoomedWidth: number;

    constructor(opt: CytoscapeNodeHtmlParams) {
      if (!opt || typeof opt !== "object") {
        opt = {};
      }
      this.query = opt.query || 'node';
      this.width = opt.width || 100; // integer number
      this.positionY = opt.positionY || 'top'; // 'top'|'bottom'
      this.positionX = opt.positionX || 'center'; // 'center'|'left'|'right'
      this.wrapCssClasses = opt.wrapCssClasses || '';
      this.fontSizeBase = opt.fontSizeBase || 10;
      this.tpl = opt.tpl || function (data: any) {
        return data + '';
      };

      this.tFontSize = null;
      this.tWrapHeight = null;
      this.tZoom = null;
      this.tZoomedWidth = null;

    }

    templateNode(cyElem: any) {
      let bounds = cyElem.renderedBoundingBox({includeEdges: false, includeLabels: false});
      let positions = [];
      let diffY = ((bounds.y2 - bounds.y1) - cyElem.numericStyle('height') * this.tZoom) / 2 || 0;
      let diffX = ((bounds.x2 - bounds.x1) - cyElem.numericStyle('width') * this.tZoom) / 2 || 0;

      switch (this.positionY) {
        case 'top':
        case 'center':
          positions.push('bottom: ' + (this.tWrapHeight - bounds.y1 - diffY) + 'px');
          break;
        case 'bottom':
          positions.push('top: ' + (bounds.y2 - diffY) + 'px');
          break;
        default:
          console.error('wrong positionY property!');
          positions.push('top: 0');
      }
      switch (this.positionX) {
        case 'center':
          positions.push('left: ' + ((bounds.x1 + bounds.x2 - this.tZoomedWidth) / 2) + 'px');
          break;
        case 'left':
          positions.push('left: ' + (bounds.x1 + diffX) + 'px');
          break;
        case 'right':
          positions.push('left: ' + (bounds.x2 - this.tZoomedWidth - diffX) + 'px');
          break;
        default :
          console.error('wrong positionX property!');
          positions.push('left: 0');
      }

      let innerTpl = '';
      try {
        innerTpl = this.tpl(cyElem.data());
      } catch (err) {
        console.error(err);
      }

      return '';
      // return '<div class="' + this.wrapCssClasses + ' ' + CSS_CLASS_ELEMENT + '" style="' + positions.join('; ')
      //     + ';width:' + this.tZoomedWidth + 'px;font-size:' + this.tFontSize + 'px;">'
      //     + innerTpl
      //     + '</div>';
    }

    updateZoom(val: number) {
      this.tZoom = val;
      this.tFontSize = val * this.fontSizeBase;
      this.tZoomedWidth = this.width * val;
    }

    setWrapHeight(val: number) {
      this.tWrapHeight = val;
    }

    getHtmlForElems(cy: any) {
      let html = '';
      let that = this;
      cy.elements(this.query).forEach(function (d: any) {
        if (d.isNode()) {
          html += that.templateNode(d);
        }
      });
      return html;
    }
  }

  function addCssToDocument() {
    let stylesWrap = 'overflow:hidden;z-index:10;pointer-events:none;position:relative;margin:0;padding:0;border:0';
    let stylesElem = 'position:absolute';
    document.querySelector('head').innerHTML +=
        `<style>.${CSS_CLASS_WRAP}{${stylesWrap}} .${CSS_CLASS_ELEMENT}{${stylesElem}}</style>`;
  }

  function nodeHtmlLabel(_cy: any, optArr: CytoscapeNodeHtmlParams[]) {

    let _cyContainer = _cy.container();
    let _titlesContainer = document.createElement('div');
    _titlesContainer.className = CSS_CLASS_WRAP;

    let _cyCanvas = _cyContainer.querySelector('canvas');
    _cyCanvas.parentNode.appendChild(_titlesContainer);

    addCssToDocument();

    if (!optArr || typeof optArr !== "object") {
      optArr = [];
    }

    let params = <ProtoParam[]>[];
    optArr.forEach(function (opt) {
      params.push(new ProtoParam(opt));
    });

    let handler = function () {
      let cHeight = _cyCanvas.offsetHeight;
      let cZoom = _cy.zoom();
      // _titlesContainer.style.height = cHeight + 'px';

      let html = '';
      params.forEach(function (p) {
        p.updateZoom(cZoom);
        p.setWrapHeight(cHeight);
        html += p.getHtmlForElems(_cy);
      });

      _titlesContainer.innerHTML = html;
    };

    _cy.on('render', handler);

    return _cy;
  }


  // registers the extension on a cytoscape lib ref
  let register = function (cy: any) {

    if (!cy) {
      return;
    } // can't register if cytoscape unspecified

    cy('core', 'nodeHtmlLabel', function (optArr: any) {
      return nodeHtmlLabel(this, optArr);
    });
  };

  if (typeof module !== 'undefined' && module.exports) { // expose as a commonjs module
    module.exports = function (cy: any) {
      register(cy);
    };
  } else {
    if (typeof define !== 'undefined' && define.amd) { // expose as an amd/requirejs module
      define('cytoscape-nodeHtmlLabel', function () {
        return register;
      });
    }
  }

  if (typeof cytoscape !== 'undefined') { // expose to global cytoscape (i.e. window.cytoscape)
    register(cytoscape);
  }

}());
