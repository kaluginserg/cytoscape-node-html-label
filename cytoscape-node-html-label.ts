// complete 1. Сделать адекватное реагирование на разные события (изменение данных \ рендер). С минимумом манипуляций с DOM!
// complete 2. Сделать позиционирование лэйблов (vertical-align: 'to-bottom | to-top') // default - to-bottom
// complete 2.1. сделать translate позиционирование для всего кадра - что бы очень быстро отрисовывать для частых операций pan и zoom
// complete 2.2. нужно  позиционирование относительно границ ноды. Сделать как сейчас в cytoscape. 'top left' или 'center center'
// complete 2.3. сделать translateX translateY (top center left right bottom) 0%, -50%, -100%.
// complete 2.4. все позиционирование сделать на transform2d css !!
// complete 3. динамически добавлять стили для заголовков в dom (class="Name"), что бы не засорять инлайн стилями. insertRule.
// complete 4. добавить комплексный тест на инициализацию в дом и отрисовку одной ноды, и ее перерисовку.
// complete 8. Сделать размер шрифта - независимым от font-size, что бы все срабатывало автоматом через transform2d
// complete 11 BUGFIX сделать все события адекватными, без багов позиционирования.
// complete 12 сделать html обертку с паддингами для тестирования.
// complete 13. Перенести логику удаления ноды в контейнер.
// todo 5. Доработать демо - сделать понятные подписи, для всех вариантов выравнивания.
// todo 6. Доработать Readme - добавить блок по браузерной поддержке, и блок - инструкцию для тех кто присоединится к доработке +
// блок по ограничениям техническим количество нод.
// todo 7. Добавить метод remove() - которые будет сбрасывать все настройки плагина.
// todo 9. Доработать readme - добавить раздел "Возможности".
// todo 10. сделать тесты:
// 1 кейсы для тестирования:
// 2 добавление новых элементов
// 3 удаление элементов
// 4 изменение данных в элементах
// 5 изменение атрибутов элементов (например изменение class, без изменения id);
// 6 перемещение элементов
// 7 создание двух инстансов для cy

// todo 15. сделать минификацию через gulp, сделать папочку dist, где будет минифицированная и обычная версии.
// todo 16. убрать из гита текущий js
// todo 17. сделать updateDataCyHandler!
// todo 18. ! доработать прохождение теста 5
// todo 19. ! доработать проверку на валидность входных параметров


// todo 20. ! Что если человек нода будет соответствовать вначале одному селектору,
// с одним стилем а потом другому с другим! Перестроится ли она.

declare const require: any;
declare const module: any;
declare const define: any;
declare const cytoscape: any;

(function () {
  "use strict";
  const $$find = function <T>(arr: T[], predicate: (a: T) => boolean) {
    if (typeof predicate !== 'function') {
      throw new TypeError('predicate must be a function');
    }
    let length = arr.length >>> 0;
    let thisArg = arguments[1];
    let value;

    for (let i = 0; i < length; i++) {
      value = arr[i];
      if (predicate.call(thisArg, value, i, arr)) {
        return value;
      }
    }
    return undefined;
  };

  const $$assign = function (target: object, ...arg: any[]): any {
    'use strict';
    if (target === undefined || target === null) {
      throw new TypeError('Cannot convert first argument to object');
    }

    let to = Object(target);
    for (let i = 1; i < arguments.length; i++) {
      let nextSource = arguments[i];
      if (nextSource === undefined || nextSource === null) {
        continue;
      }

      let keysArray = Object.keys(Object(nextSource));
      for (let nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex++) {
        let nextKey = keysArray[nextIndex];
        let desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
        if (desc !== undefined && desc.enumerable) {
          to[nextKey] = nextSource[nextKey];
        }
      }
    }
    return to;
  };

  type IHAlign = "left" | "center" | "right";
  type IVAlign = "top" | "center" | "bottom";

  interface ICytoscapeNodeHtmlParams {
    query ?: string;
    halign ?: IHAlign;
    valign ?: IVAlign;
    halignBox ?: IHAlign;
    valignBox ?: IVAlign;
    cssClass ?: string;
    tpl ?: (d: any) => string;
  }

  interface ICyEventObject {
    cy: any;
    type: string;
    target: any;
  }

  interface ICytoscapeNodeHtmlPosition {
    x: number;
    y: number;
    w: number;
    h: number;
  }

  interface ILabelElement extends ICytoscapeNodeHtmlParams {
    data?: any;
    position?: ICytoscapeNodeHtmlPosition;
    baseClassName: string;
    id: string;
    node: HTMLElement;
  }

  class LabelElement {
    public tpl: (d: any) => string;
    public cssClass: string;
    public id: string;

    private _position: number[];
    private _baseElementClassName: string;
    private _node: HTMLElement;
    private _align: [number, number, number, number];

    constructor({
                  node,
                  id,
                  baseClassName,
                  tpl = () => "",
                  cssClass = null,
                  position = null,
                  data = null,
                  halign = "center",
                  valign = "center",
                  halignBox = "center",
                  valignBox = "center"
                }: ILabelElement) {

      const _align = {
        "top": -.5,
        "left": -.5,
        "center": 0,
        "right": .5,
        "bottom": .5
      };

      const _alignBox = {
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

    updateData(data: any) {
      try {
        this._node.innerHTML = this.tpl(data);
      } catch (err) {
        console.error(err);
      }
    }

    getNode(): HTMLElement {
      return this._node;
    }

    updatePosition(pos: ICytoscapeNodeHtmlPosition) {
      this._renderPosition(pos);
    }

    private init() {
      this._node.setAttribute("id", this.id);
      this._node.setAttribute("class", this._baseElementClassName);
      if (this.cssClass && this.cssClass.length) {
        this._node.classList.add(this.cssClass);
      }
    }

    private _renderPosition(position: ICytoscapeNodeHtmlPosition) {
      const prev = this._position;
      const x = position.x + this._align[0] * position.w;
      const y = position.y + this._align[1] * position.h;

      if (!prev || prev[0] !== x || prev[1] !== y) {
        this._position = [x, y];

        let valRel = `translate(${this._align[2]}%,${this._align[3]}%) `;
        let valAbs = `translate(${x.toFixed(2)}px,${y.toFixed(2)}px) `;
        let val = valRel + valAbs;
        let stl = <any>this._node.style;
        stl.webkitTransform = val;
        stl.msTransform = val;
        stl.transform = val;
      }
    }
  }

  /**
   * LabelContainer
   * Html manipulate, find and upgrade nodes
   * it don't know about cy.
   */
  class LabelContainer {
    private _elements: LabelElement[];
    private _node: HTMLElement;
    private _cssWrap: string;
    private _cssElem: string;

    constructor(node: HTMLElement) {
      this._node = node;
      this._cssWrap = 'cy-node-html-' + (+new Date());
      this._cssElem = this._cssWrap + '__e';
      this.addCssToDocument();
      this._node.className = this._cssWrap;
      this._elements = [];
    }

    addElem(id: string, param: ICytoscapeNodeHtmlParams, payload: { data?: any, position?: ICytoscapeNodeHtmlPosition } = {}) {
      let nodeElem = document.createElement('div');
      this._node.appendChild(nodeElem);


      let newElem = new LabelElement($$assign({}, param, {
        node: nodeElem,
        id: id,
        baseClassName: this._cssElem,
        data: payload.data,
        position: payload.position
      }));

      this._elements.push(newElem);
    }

    removeElemById(id: string) {
      for (let j = this._elements.length - 1; j >= 0; j--) {
        if (this._elements[j].id === id) {
          console.log(j);
          this._node.removeChild(this._elements.splice(j, 1)[0].getNode());
          break;
        }
      }
    }

    updateElemPosition(data: { id: string, position?: ICytoscapeNodeHtmlPosition }) {
      let ele = this.getElemById(data.id);
      if (ele) {
        ele.updatePosition(data.position);
      }
    }

    getElemById(id: string): LabelElement {
      return $$find(this._elements, x => x.id === id);
    }

    updatePanZoom({pan, zoom}: { pan: { x: number, y: number }, zoom: number }) {
      const val = `translate(${pan.x}px,${pan.y}px) scale(${zoom})`;
      const stl = <any>this._node.style;
      const origin = 'top left';

      stl.webkitTransform = val;
      stl.msTransform = val;
      stl.transform = val;
      stl.webkitTransformOrigin = origin;
      stl.msTransformOrigin = origin;
      stl.transformOrigin = origin;
    }

    private addCssToDocument() {
      let stylesWrap = 'position:absolute;z-index:10;width:500px;pointer-events:none;margin:0;padding:0;border:0;outline:0';
      let stylesElem = 'position:absolute';
      document.querySelector('head').innerHTML +=
          `<style>.${this._cssWrap}{${stylesWrap}} .${this._cssElem}{${stylesElem}}</style>`;
    }
  }

  function cyNodeHtmlLabel(_cy: any, params: ICytoscapeNodeHtmlParams[]) {
    console.log('cyNodeHtmlLabel');
    const _params = (!params || typeof params !== "object") ? [] : params;
    const _lc = createLabelContainer();

    _cy.one('render', (e: any) => {
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

    function createLabelContainer(): LabelContainer {
      let _cyContainer = _cy.container();
      let _titlesContainer = document.createElement('div');

      let _cyCanvas = _cyContainer.querySelector('canvas');
      let cur = _cyContainer.querySelector('[class^="cy-node-html"]');
      if (cur) {
        _cyCanvas.parentNode.removeChild(cur);
      }
      _cyCanvas.parentNode.appendChild(_titlesContainer);

      return new LabelContainer(_titlesContainer);
    }

    function createNodesCyHandler({cy}: ICyEventObject) {
      _params.forEach(x => {
        cy.elements(x.query).forEach((d: any) => {
          if (d.isNode()) {
            _lc.addElem(d.id(), x, {
              position: getNodePosition(d),
              data: d.data()
            });
          }
        });
      });
    }

    function addCyHandler(ev: ICyEventObject) {
      let target = ev.target;
      let param = $$find(_params, x => target.is(x.query));
      if (param) {
        _lc.addElem(target.id(), param, {
          position: getNodePosition(target),
          data: target.data()
        });
      }
    }

    function layoutstopHandler({cy}: ICyEventObject) {
      _params.forEach(x => {
        cy.elements(x.query).forEach((d: any) => {
          if (d.isNode()) {
            _lc.updateElemPosition({
              id: d.id(),
              position: getNodePosition(d)
            });
          }
        });
      });
    }

    function removeCyHandler(ev: ICyEventObject) {
      let target = ev.target;
      let param = $$find(_params, x => target.is(x.query));
      if (param) {
        _lc.removeElemById(target.id());
      }
    }

    function moveCyHandler(ev: ICyEventObject) {
      let target = ev.target;
      let param = $$find(_params, x => target.is(x.query));
      if (param) {
        _lc.updateElemPosition({
          id: target.id(),
          position: getNodePosition(target)
        });
      }
    }

    function updateDataCyHandler(ev: ICyEventObject) {
      console.log('do update data', ev);
    }

    function wrapCyHandler({cy}: ICyEventObject) {
      _lc.updatePanZoom({
        pan: cy.pan(),
        zoom: cy.zoom()
      });
    }

    function getNodePosition(node: any): ICytoscapeNodeHtmlPosition {
      return {
        w: node.width(),
        h: node.height(),
        x: node.position('x'),
        y: node.position('y')
      };
    }
  }

  // registers the extension on a cytoscape lib ref
  let register = function (cy: any) {

    if (!cy) {
      return;
    } // can't register if cytoscape unspecified

    cy('core', 'nodeHtmlLabel', function (optArr: any) {
      return cyNodeHtmlLabel(this, optArr);
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
