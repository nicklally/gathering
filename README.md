# gathering

Live demo (in progress): https://nicklally.github.io/gathering/

Begin by using the search to query OpenStreetMap features. Some sample queries: 

    * building
    * highway
    * highway = cycleway
    * landuse = retail 

For more information on possible queries, see the [Overpass API documentation](https://wiki.openstreetmap.org/wiki/Overpass_API), try the [overpass turbo](https://overpass-turbo.eu/) wizard, or right-click on a location in [OpenStreeMap](https://www.openstreetmap.org) and choose "query features." 

After a layer has been loaded, you can select "Export SVG" for a vector file that can be edited in a program of your choice (e.g., [Inkscape](https://inkscape.org/) or Illustrator). By selecting "Lock map" before export, all outputted layers will align making it easy to compile them in another program. All SVG layers are projected in web mercator. 

You can also click "INTERACT" at the top of the screen, which loads the last queried feature into an instance of [p5.js](https://p5js.org/). Currently, you can click on the loaded shapes and they will move/break apart. This is intended as a sandbox for future experimentation with geographic information in an interactive environment. For example, the functionality of [shaping](https://github.com/nicklally/shaping) or [enfolding](https://github.com/nicklally/enfolding), which both currently work with raster images, may one day be implemented here. 


