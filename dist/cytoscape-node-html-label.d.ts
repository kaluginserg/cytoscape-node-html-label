import * as CyTypes from "cytoscape";
export declare type IHAlign = "left" | "center" | "right";
export declare type IVAlign = "top" | "center" | "bottom";
export interface CytoscapeNodeHtmlParams {
    query?: string;
    halign?: IHAlign;
    valign?: IVAlign;
    halignBox?: IHAlign;
    valignBox?: IVAlign;
    cssClass?: string;
    tpl?: (d: any) => string;
}
export interface CytoscapeContainerParams {
    enablePointerEvents?: boolean;
}
declare const register: (cy: CyTypes.Core) => void;
export declare namespace cytoscape {
    interface Core {
        cyNodeHtmlLabel: (_cy: CyTypes.Core, params: CytoscapeNodeHtmlParams[], options?: CytoscapeContainerParams) => void;
    }
}
export default register;
