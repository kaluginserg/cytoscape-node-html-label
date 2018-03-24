
document.addEventListener('DOMContentLoaded', function () {
    var cy = cytoscape({
        container: document.getElementById('cy'),

        layout: {
            name: 'random',
            animate: false
        },
        elements: sampleDataset
    });

    cy.nodeHtmlLabel([
        {
            query: '*',
            tpl: function (data) {
                return '<p class="cy-title__p1">' + data.name + '</p>' + '<p  class="cy-title__p2">' + data.code + '</p>';
            }
        }
    ]);

});