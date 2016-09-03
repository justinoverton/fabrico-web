const binHeap = require('binheap');
const _ = require('../underscore.js')._;

function constructPath(cameFrom, current) {
    
    let p = [current];
    
    while(cameFrom[current.id]) {
        current = cameFrom[current.id];
        p.push(current);
    }
    
    return p;
}

class AStarFinder {
    
    constructor() {
    }
    
    diagonalHeuristic(start, end) {
        let D = 1;
        let D2 = Math.SQRT2;
        
        let dx = Math.abs(start.x - end.x);
        let dy = Math.abs(start.y - end.y);
        return D * (dx + dy) + (D2 - 2 * D) * Math.min(dx, dy)
    }
    
    find(map, start, end, heuristic) {
        
        heuristic = heuristic || this.diagonalHeuristic;
        
        let endFn = null;
        if(_.isFunction(end)) {
            endFn = end;
            end = null;
        }
        
        let data = {
            map: map,
            start: start,
            from: {},
            gscore: {},
            fscore: {},
            closedSet: {}
        };
        
        data.openSet = binHeap(function(node) { return data.fscore[node.id]; });
        
        data.gscore[start.id] = 0;
        data.fscore[start.id] = heuristic(start, end);
        data.openSet.push(start);
        
        while(data.openSet.size() > 0) {
            
            let current = data.openSet.pop();
            
            if(current === end || (endFn && endFn(current))) {
                return constructPath(data.from, current);
            }
            
            data.closedSet[current.id] = current;
            for(let n of map.neighbors(current)) {
                
                if(data.closedSet[n.id]) {
                    continue;
                }
                
                let isNew = false;
                let g = data.gscore[current.id] + heuristic(n, current);
                if(data.openSet.heap.indexOf(n) === -1) {
                    //new node
                    data.openSet.push(n);
                    isNew = true;
                } else if(g >= data.gscore[n.id]) {
                    //worse path
                    continue;
                }
                
                data.from[n.id] = current;
                data.gscore[n.id] = g;
                data.fscore[n.id] = g + heuristic(n, end);
                
                if(!isNew) {
                    data.openSet.rescoreElement(n);
                }
            }
        }
        
        return [];
    }
}

module.exports = new AStarFinder();
