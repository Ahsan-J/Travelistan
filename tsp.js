let distances = {};

let place = function (name,lat,lng){
    this.latitude = lat;
    this.longtitude = lng;
    this.name = name;
    distances[name] = {};
    registerDistance(this,this,Infinity);
}

function calculateDistance( placeA , placeB ) {
    return Math.sqrt( Math.pow((placeA.latitude - placeB.latitude),2) + Math.pow((placeA.longtitude-placeB.longtitude),2) ) * 100
}

function registerDistance( placeA, placeB,distance ) {
    let node;
    if(distance!=Infinity){
        distance = calculateDistance(placeA,placeB);
    }
    if(placeA.name==placeB.name){
        distance=Infinity;
    }
    node = distances[placeA.name]; 
    node[placeB.name] = distance; 
    node = distances[placeB.name]; 
    node[placeA.name] = distance; 
}

function rowMinimization (distances){
    for(let city in distances){
        let cities = distances[city]
        let arr = Object.values(cities);
        let min = Math.min.apply(null, arr);
        for(let key in cities){
            cities[key] = cities[key] - min;
        }
        distances[city] = cities
    }
}

function columnMinimization (distances){
    for(let city in distances){
        for(let i in distances[city]){
            var arr = [];
            for(let key in distances){
                arr.push(distances[key][i])
            }
            let min = Math.min.apply(null,arr.filter(item => item !== Infinity));
            if(min>0){
                for(let key in distances){
                    distances[key][i] = distances[key][i]-min
                }
                break;
            }
        }
    }
}

function penalty (distances){
    let strkingElem = {
        row:'',
        col:'',
        penalty:0,
    }
    for(let city in distances){
        for(let i in distances[city]){
            if(distances[city][i]==0){
                var colArr = [];
                for(let key in distances){
                    if(city+i !== key+i && distances[key][i] !== Infinity){
                        colArr.push(distances[key][i]);
                    }
                }
                let colMin = Math.min.apply(null,colArr.filter(item => item !== Infinity));
                
                var rowArr = [];
                for(let key in distances[city]){
                    if(city+i !== city+key && distances[city][key] !== Infinity){
                        rowArr.push(distances[city][key]);
                    }
                }

                let rowMin = Math.min.apply(null,rowArr.filter(item => item !== Infinity ));

                // if(colMin === Infinity){
                //     colMin = 0;
                // }
                // if(rowMin === Infinity){
                //     rowMin = 0;
                // }

                if(strkingElem.penalty<(colMin+rowMin)){
                    // console.log(colMin,rowMin)
                    strkingElem = {
                        ...strkingElem,
                        row : city,
                        col : i,
                        penalty : colMin + rowMin
                    }
                }
            }
        }
    }
    return strkingElem;
}

function reduceMatrix (distances){
    let strkingElem = penalty(distances);
    for(let key in distances){
        delete distances[key][strkingElem.col]
    }
    delete distances[strkingElem.row];
    if(distances[strkingElem.col] != undefined){
        if(distances[strkingElem.col][strkingElem.row] != undefined){
            distances[strkingElem.col][strkingElem.row] = Infinity;
        }
    }
    return strkingElem;
}


// bundledCities.push(new place("AttabadLake",36.320573, 74.865163));
// bundledCities.push(new place("Naran",34.909017, 73.650835));
// bundledCities.push(new place("Gilgit", 35.882180, 74.464219));
// bundledCities.push(new place("Khyber",34.097492, 71.157251));
// bundledCities.push(new place("Astore",35.366013, 74.861748));
// bundledCities.push(new place("Hunza",36.419270, 74.545174));
// bundledCities.push(new place("Skardu",35.360375, 75.553668));
// console.log(bundledCities);
function Travelistan() {
    let bundledCities = [];
    
    bundledCities.push(new place("Chilas",35.423849, 74.094674));
    bundledCities.push(new place("Islamabad", 33.695818, 73.070959));
    bundledCities.push(new place("Abbotabad", 34.166509, 73.220923));
    bundledCities.push(new place("Mansehra",34.330438, 73.197898));
    bundledCities.push(new place("Balakot",34.549003, 73.354601));
    
    let start = {...bundledCities[0]};
    for(let i in bundledCities){
        for(let j in bundledCities){
            registerDistance(bundledCities[i],bundledCities[j])
        }
    }

    let data = [];
    let size = Object.keys(distances).length
    for(let k=0;k<size;k++){
        rowMinimization(distances);
        columnMinimization(distances);
        data.push(reduceMatrix(distances));
    }
    var path = [];
    path.push(start.name);

    for(let i in data){
        for(let j in data){
            if(data[j].row == path[i]){
                path.push(data[j].col);
            }
        }
    }
    console.log(path);
    distances={};
    return path;
}

module.exports = {
    Travelistan : Travelistan,
}