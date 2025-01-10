function getOSMData(){
	console.log("clicked");
	data = fetch("https://www.overpass-api.de/api/interpreter?data=[bbox];node[amenity=post_box];out;&bbox=7.0,50.6,7.3,50.8");
	print(data);
}
