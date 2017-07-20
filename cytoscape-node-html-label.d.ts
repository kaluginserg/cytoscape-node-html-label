export declare namespace cytoscape {
    export interface CytoscapeNodeHtmlLabels {
        query ?: string;
        width ?: number;
        positionY ?: string;
        positionX ?: string;
        wrapCssClasses ?: string;
        fontSizeBase ?: number;
        tpl ?: (d: any) => string;
    }

    export function nodeHtmlLabels(o: CytoscapeNodeHtmlLabels[]): any;
}
