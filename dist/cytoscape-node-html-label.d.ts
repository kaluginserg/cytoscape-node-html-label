declare type IHAlign = "left" | "center" | "right";
declare type IVAlign = "top" | "center" | "bottom";
declare module  'cytoscape-node-html-label';
declare var define: any;
declare var cytoscape: any;
interface CytoscapeNodeHtmlParams {
    query?: string;
    halign?: IHAlign;
    valign?: IVAlign;
    halignBox?: IHAlign;
    valignBox?: IVAlign;
    cssClass?: string;
    tpl?: (d: any) => string;
}
interface CytoscapeContainerParams {
    enablePointerEvents?: boolean;
}
