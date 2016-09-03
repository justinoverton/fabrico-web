/*

TerrainMap -

    

*/

let terrainmap = module.exports = class TerrainMap {
    
    /*
     * RGBA format 1d array
     */
    constructor(data, width, height) {
        this.data = data;
        this.width = width;
        this.height = height;
    }
    
    /*
     Load image into heighmap. RGBA format 1d array
     
     Red = Elevation
     Green = Vegitation density 
            0 = rocky/barren
            255 = thick forest/jungle
     Blue = Water density 
            0 = ground
            1 - 127 = reserved ?
            128 = swamp
            255 = impassible without boat
     A = ??
     
     */
    get(x, y) {
        
        if(x < 0 ||    x >= this.width || y < 0 || y >= this.height) {
            return null;
        }
        
        let w = this.width;
        let h = this.height;
        
        let idx = y * w + x;
        idx *= 4;//there's 4 bytes
        
        let r = this.data[idx];
        let g = this.data[idx+1];
        let b = this.data[idx+2];
        let a = this.data[idx+3];
        
        return {
            
            height: r,
            vegitation: g,
            water: b
            
        };
    }
    
    /*
    /*
     * Create map from noise
     *
    static create(width, height, noiseFn) {
        
        
        
    }
    */
}
