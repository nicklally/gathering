var map = L.map('map').setView([40.394783, -105.075581], 18);
var resultAsGeojson;
var shapeArr = [];

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

    // built with help from https://gist.github.com/tyrasd/45e4a6a44c734497e82ccaae16a9c9ea
    function buildOverpassApiUrl(map, overpassQuery) {
        var bounds = map.getBounds().getSouth() + ',' + map.getBounds().getWest() + ',' + map.getBounds().getNorth() + ',' + map.getBounds().getEast();
        var nodeQuery = 'node[' + overpassQuery + '](' + bounds + ');';
        var wayQuery = 'way[' + overpassQuery + '](' + bounds + ');';
        var relationQuery = 'relation[' + overpassQuery + '](' + bounds + ');';
        var query = '?data=[out:json][timeout:15];(' + nodeQuery + wayQuery + relationQuery + ');out body geom;';
        var baseUrl = 'https://overpass-api.de/api/interpreter';
        var resultUrl = baseUrl + query;
        return resultUrl;
      }

      async function OSMquery () {
        var queryTextfieldValue = document.getElementById("query-textfield").value;
        var overpassApiUrl = buildOverpassApiUrl(map, queryTextfieldValue);
     // replace jquery https://youmightnotneedjquery.com/   
        const response = await fetch(overpassApiUrl);
        const osmDataJson = await response.json();
        //console.log(osmDataJson);
          resultAsGeojson = osmtogeojson(osmDataJson);
          //console.log(resultAsGeojson);
          var resultLayer = L.geoJson(resultAsGeojson, {
            style: function (feature) {
              return {color: "#ff0000"};
            },
            filter: function (feature, layer) {
              var isPolygon = (feature.geometry) && (feature.geometry.type !== undefined) && (feature.geometry.type === "Polygon") || (feature.geometry.type === "LineString");
              if (isPolygon) {
               return true;
              }
              //return true;
            },
            onEachFeature: function (feature, layer) {
              var popupContent = "";
              popupContent = popupContent + "<dt>@id</dt><dd>" + feature.properties.type + "/" + feature.properties.id + "</dd>";
              var keys = Object.keys(feature.properties.tags);
              keys.forEach(function (key) {
                popupContent = popupContent + "<dt>" + key + "</dt><dd>" + feature.properties.tags[key] + "</dd>";
              });
              popupContent = popupContent + "</dl>"
              layer.bindPopup(popupContent);
            }
          }).addTo(map);
      };

      function downloadSVG(){
        //console.log(resultAsGeojson);
        var resultAsGeojsonProj = reproject(resultAsGeojson);

        //console.log(resultAsGeojsonProj);
        var svgOptions = new Object();
        //svgOptions.mapExtent = "left: " + map.getBounds().getWest() + ", bottom: " + map.getBounds().getSouth() + ", right: " + map.getBounds().getEast() + ", top: " + map.getBounds().getNorth();
        //svgOptions.vpSize = "width: " + document.getElementById("map").offsetWidth + ", height: " + document.getElementById("map").offsetHeight;
        //console.log(svgOptions);
        /* var mapExtents = new Object();
            mapExtents.left = map.getBounds().getWest();
            mapExtents.bottom = map.getBounds().getSouth();
            mapExtents.right = map.getBounds().getEast(); 
            mapExtents.top = map.getBounds().getNorth();
        svgOptions.mapExtent = mapExtents; */
        var vpSize = new Object();
            vpSize.width = document.getElementById("map").offsetWidth;
            vpSize.height = document.getElementById("map").offsetHeight;
        svgOptions.viewportSize = vpSize;
        
        //console.log(svgOptions);
        var converter = new GeoJSON2SVG(svgOptions);
        var svgConv = converter.convert(resultAsGeojsonProj);

        var mapW = document.getElementById("map").offsetWidth;
        var mapH = document.getElementById("map").offsetHeight;
        
        var svgPre = "<svg version=\"1.1\" width=\"" + mapW + "\" height=\"" + mapH + "\" xmlns=\"http://www.w3.org/2000/svg\"><style>path{fill: none;stroke:gray;stroke-width:0.5px;}</style>"
        var svgPost = "</svg>";
        svgOut = svgPre + svgConv + svgPost; 
        //console.log(svgOut);

        const blob = new Blob([svgOut.toString()]);
        const element = document.createElement("a");
        element.download = "output.svg";
        element.href = window.URL.createObjectURL(blob);
        element.click();
        element.remove();
      }

function lockMap(obj){
    if(!obj.checked){
        map.dragging.enable();
        map.scrollWheelZoom.enable();
    } else {
        map.dragging.disable(); 
        map.scrollWheelZoom.disable();
    }
};

function loadP5(){
    shapeArr = [];
    var resultAsGeojsonProj = reproject(resultAsGeojson);
    //console.log(resultAsGeojsonProj);
    //console.log(resultAsGeojsonProj.features.length);

    for (var i = 0; i < resultAsGeojsonProj.features.length; i++){
        var shapeCoords =[];
        for (var j = 0; j < resultAsGeojsonProj.features[i].geometry.coordinates.length; j++){
           var coords = resultAsGeojsonProj.features[i].geometry.coordinates[j];
            for (c in coords){
                //add coordinates in pairs to array
                shapeCoords.push(coords[c][0]+11696923);
                shapeCoords.push(coords[c][1]-4923215);
                console.log(coords[c][1]-4923015);
            }
        }
        //each shapeCoords array is a shape in shapeArr
        shapeArr.push(shapeCoords);
    }
    //console.log(shapeArr);
    //drawShapes(shapeArr);
}

// PROCESSING SKETCH CODE
const s = ( p ) => {

    let x = 100; 
    let y = 100;
  
    p.setup = function() {
      p.createCanvas(document.getElementById("map").offsetWidth,document.getElementById("map").offsetHeight);
    };

    p.draw = function() {
      p.background(0);
      p.fill(255);
      p.rect(x,y,50,50);
      x += p.random(-0.5,0.5);
      y += p.random(-0.5,0.5);
      if(shapeArr){
        drawShapes(shapeArr);
      };
    };

    function drawShapes(shapes){
        for (var i = 0; i < shapes.length; i++){
            p.stroke("red");
           p.beginShape();
            for (var j = 0; j< shapes[i].length; j+=2){
                p.vertex(shapes[i][j],shapes[i][j+1]);
                //console.log(shapes[i][j] + ' ' + shapes[i][j+1]);
            }
            p.endShape(p.CLOSE);
            //console.log("close shape");
        };
    };
  };
  
  let myp5 = new p5(s, "sketch");

  