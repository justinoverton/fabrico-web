const drd = require('fabrico/node_modules/definitely-random-data/dist/drd.js');
//                   definitely-random-data
const fabrico = require('fabrico');
const _ = require('../underscore.js')._;
const astar = require('./astar.js');

function defaultNodeProvider(x,y) {
    return {
        id: x + '_' + y,
        x: x,
        y: y,
        movable: true,
        height: 0,
        vegitation: 0,
        water: 0,
        population: 0
    };
}

class MapBuilder {
    
    constructor(x, y, nodeProvider) {
        
        this.nodeProvider = nodeProvider || defaultNodeProvider;
        this.width = x;
        this.height = y;
        this.graph = [];
        for(let yy = 0; yy < y; yy++) {
            
            let row = [];
            this.graph[yy] = row;
            for(let xx = 0; xx < x; xx++) {
                row[xx] = this.nodeProvider(xx, yy);
            }
        }
    }
    
    getNode(x, y) {
        
        if(y >= 0 && y < this.graph.length) {
            if(x >= 0 && x < this.graph[y].length) {
                return this.graph[y][x];
            }
        }
        
        return null;
    } 
    
    neighbors(node) {
        let ret = [];
        
        let n = this.getNode(node.x, node.y+1);
        if(n !== null) ret.push(n);
        
        n = this.getNode(node.x+1, node.y+1);
        if(n !== null) ret.push(n);
    
        n = this.getNode(node.x+1, node.y);
        if(n !== null) ret.push(n);
        
        n = this.getNode(node.x+1, node.y-1);
        if(n !== null) ret.push(n);
    
        n = this.getNode(node.x, node.y-1);
        if(n !== null) ret.push(n);
        
        n = this.getNode(node.x-1, node.y-1);
        if(n !== null) ret.push(n);
        
        n = this.getNode(node.x-1, node.y);
        if(n !== null) ret.push(n);
        
        n = this.getNode(node.x-1, node.y+1);
        if(n !== null) ret.push(n);
        
        return ret;
    }
    
    path(start, end, h) {
        return astar.find(this, start, end, h);
    }
    
    breadthFirstSearch(start, vist, diags) {
        
        let dist = {};
        let parents = {};
        
        let q = [];
        
        dist[start.id] = 0;
        q.push(start);
        let  distFn = astar.diagonalHeuristic;
        
        while(q.length > 0) {
            
            let cur = q.shift();
            for(let n of this.neighbors(cur)) {
                if(_.isUndefined(dist[n.id]) && vist(n, dist[cur.id], cur)) {
                    
                    dist[n.id] = distFn(start, n);
                    parents[n.id] = cur;
                    q.push(n);
                }
            }
        }
        
        return {
            distances: dist,
            parents: parents
        }
    }

}

let builder = exports.builder = function(terrainMap) {
    
    let b = new MapBuilder(terrainMap.width, terrainMap.height, function (x, y) {
        let node = defaultNodeProvider(x, y);
        let t = terrainMap.get(x, y);
        node.height = t.height;
        node.vegitation = t.vegitation;
        node.water = t.water;
        node.population = 0;
        
        return node;
    });
    
    return b;
}

let seedPopulation = exports.seedPopulation = function(b, density) {
    
    let rng = drd.Defaults.defaultRng;
    density = density || 6;
    let distFn = astar.diagonalHeuristic;
    
    let seeds = [];
    
    let maxx = null;
    let maxy = null;
    let minx = null;
    let miny = null;
    
    for(let i=0; i<density; i++) {
        
        let sx = rng.getRandomInt(0, b.width);
        let sy = rng.getRandomInt(0, b.height);
        
        let cur = b.getNode(sx, sy);
        if(cur.water === 255) {
            
            //find nearest non-water tile
            let found = false;
            b.breadthFirstSearch(cur, function(n) {
                
                if(found)
                    return false;
                
                if(n.water === 255)
                    return true;
                
                found = true;
                cur = n;
                return false;
            });
            
            if(cur.water === 255)
                continue; //With that much water it's hopeless
        }
        
        seeds.push(cur);
        
        if(maxx == null || maxx.x < cur.x)
            maxx = cur;
        if(maxy == null || maxy.y < cur.y)
            maxy = cur;
        if(minx == null || minx.x > cur.x)
            minx = cur;
        if(miny == null || miny.y > cur.y)
            miny = cur;
    }
    
    let furtherestPair = null;
    let furtherestDist = null;
    
    let dists = [maxx, maxy, minx, miny];
    
    for(let i=0; i<dists.length; i++) {
        let a = dists[i];
        for(let k=i+1; k<dists.length; k++) {
            let b = dists[k];
            let d = distFn(a, b);
            if(furtherestDist == null || d > furtherestDist) {
                furtherestPair = [a, b];
                furtherestDist = d;
            }
        }
    }
    
    let weightFn = function(a, b) {
        
        //every change of elevation of 17 costs 1 tile
        //every change of vegitation of 17 costs 1 tile
        //every water costs 8 tiles
        
        if(a == null || b == null)
            return 1;
        
        let dh = Math.abs(a.height - b.height) / 17;
        let dv = Math.abs(a.vegitation - b.vegitation) / 17;
        let dw = (a.water > 0 ? 8 : 0) + (b.water > 0 ? 8 : 0);
        
        return 1 + dh + dv + dw;
    };
    
    let mainRoad = [];
    let sideRoads = [];
    
    for(let o of b.path(furtherestPair[0], furtherestPair[1], weightFn)) {
        o.population = 255;
        mainRoad[o.id] = o;
    }
    
    for(let cur of seeds) {
        
        let cur = seeds.shift();
        if(cur === furtherestPair[0] || cur === furtherestPair[1]) {
            continue;
        }
        
        let p = astar.find(b, cur, function(end) { return end != null && mainRoad[end.id]; }, weightFn);
        
        for(let o of p) {
            o.population = 255;
        }
    }
    
    return b;
}

