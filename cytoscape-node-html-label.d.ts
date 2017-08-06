export declare interface CytoscapeNodeHtmlParams {
  query ?: string;
  width ?: number;
  positionY ?: string;
  positionX ?: string;
  wrapCssClasses ?: string;
  fontSizeBase ?: number;
  tpl ?: (d: any) => string;
}

export declare namespace cytoscape {
  export type CytoscapeNodeHtmlLabel = CytoscapeNodeHtmlParams;

  export function nodeHtmlLabel(o: CytoscapeNodeHtmlLabel[]): any;
}
