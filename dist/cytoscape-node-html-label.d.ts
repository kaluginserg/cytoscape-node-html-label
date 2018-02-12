declare const require: any;
declare const module: any;
declare const define: any;
declare const cytoscape: any;
declare type IHAlign = "left" | "center" | "right";
declare type IVAlign = "top" | "center" | "bottom";
interface CytoscapeNodeHtmlParams {
    query?: string;
    halign?: IHAlign;
    valign?: IVAlign;
    halignBox?: IHAlign;
    valignBox?: IVAlign;
    cssClass?: string;
    tpl?: (d: any) => string;
}
declare namespace cytoscape {
    type CytoscapeNodeHtmlLabel = CytoscapeNodeHtmlParams;
    function nodeHtmlLabel(o: CytoscapeNodeHtmlLabel[]): any;
}
