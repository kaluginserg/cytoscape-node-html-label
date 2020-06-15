import * as CyTypes from "cytoscape";
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
interface CytoscapeContainerParams {
    enablePointerEvents?: boolean;
}
export declare namespace cytoscape {
    interface Core {
        cyNodeHtmlLabel: (_cy: CyTypes.Core, params: CytoscapeNodeHtmlParams[], options?: CytoscapeContainerParams) => void;
    }
}
export {};
