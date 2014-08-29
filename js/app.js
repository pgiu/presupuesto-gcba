/* 
 * Visualizcion para el presupuesto 2014
 * del gobierno de la Ciudad de Buenos Aires
 *
 * @Autor: Laboratorio de Gobierno
 *
 */


// Vars de inicializacion
var w = 970,    // ancho del gráfico
    h = 350,    // largo del gráfico
    cant = 5;   // Cant de categorías
    maxR = 70;  //maximo radio del circulo

var nodes = d3.range(cant).map(function(i) {
    return {
        type: Math.random() * cant | 0,
        radius: 0,
        fixed: true,
        type: i,
        x: (i + 1) * (w / (cant + 1)),
        y: h / 2
    };
});

var color = d3.scale.category10();

var force = d3.layout.force()
    .gravity(0)
    .charge(0)
    .nodes(nodes)
    .size([w, h]);

force.start();

var svg = d3.select("#grafico").append("svg:svg")
    .attr("width", w)
    .attr("height", h);

svg.append("svg:rect")
    .attr("width", w)
    .attr("height", h)
    .style("fill", "white");

svg.selectAll("circle")
    .data(nodes)
    .enter().append("svg:circle")
    .attr("r", function(d) {
        return d.radius - 1;
    })
    .style("fill", function(d, i) {
        return color(d.type);
    });

force.on("tick", function(e) {
    var q = d3.geom.quadtree(nodes),
        k = e.alpha * .1,
        i = 0,
        n = nodes.length,
        o;

    while (++i < n) {
        o = nodes[i];
        if (o.fixed) continue;
        c = nodes[o.type];
        o.x += (c.x - o.x) * k;
        o.y += (c.y - o.y) * k;
        q.visit(collide(o));
    }

    svg.selectAll("circle")
        .attr("cx", function(d) {
            return d.x;
        })
        .attr("cy", function(d) {
            return d.y;
        });
});

function collide(node) {
    var r = node.radius + 10,
        nx1 = node.x - r,
        nx2 = node.x + r,
        ny1 = node.y - r,
        ny2 = node.y + r;
    return function(quad, x1, y1, x2, y2) {
        if (quad.point && (quad.point !== node)) {
            var x = node.x - quad.point.x,
                y = node.y - quad.point.y,
                l = Math.sqrt(x * x + y * y),
                r = node.radius + quad.point.radius;
            if (l < r) {
                l = (l - r) / l * .5;
                node.px += x * l;
                node.py += y * l;
            }
        }
        return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
    };
}



var nodosTemp;

d3.csv("data/presupuesto.csv", function(data) {
    data.forEach(function(d) {
        d.monto = +d.monto;
    });

    var max = d3.max(data, function(d) {
        return d.monto;
    });

    var radioRango = d3.scale.linear()
        .domain([0, max])
        .range([0, maxR]);

    // saco el máximo y armo el array de nodosTemp para pushear al svg

});
