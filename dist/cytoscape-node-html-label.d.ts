type IHAlign = "left" | "center" | "right";
type IVAlign = "top" | "center" | "bottom";

export declare interface CytoscapeNodeHtmlParams {
  query ?: string;
  halign ?: IHAlign;
  valign ?: IVAlign;
  halignBox ?: IHAlign;
  valignBox ?: IVAlign;
  cssClass ?: string;
  tpl ?: (d: any) => string;
}

export declare namespace cytoscape {
  export type CytoscapeNodeHtmlLabel = CytoscapeNodeHtmlParams;

  export function nodeHtmlLabel(o: CytoscapeNodeHtmlLabel[]): any;
}
