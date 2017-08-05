export declare namespace cytoscape {
    export interface CytoscapeNodeHtmlLabel {
        query ?: string;
        width ?: number;
        positionY ?: string;
        positionX ?: string;
        wrapCssClasses ?: string;
        fontSizeBase ?: number;
        tpl ?: (d: any) => string;
    }

    export function nodeHtmlLabel(o: CytoscapeNodeHtmlLabel[]): any;
}
