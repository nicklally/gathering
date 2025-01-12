function goMap(){
	document.getElementById("map").style.display = "block";
	document.getElementById("sketch").style.display = "none";
	//document.getElementById("menuEdit").style.display = "block";
	//document.getElementById("menuRender").style.display = "none";
	document.getElementById("goMap").style.backgroundColor = "#666";
	document.getElementById("goSketch").style.backgroundColor = "#333";
	//editMode = true;
}

function goSketch(){
	document.getElementById("map").style.display = "none";
	document.getElementById("sketch").style.display = "block";
	//document.getElementById("menuEdit").style.display = "none";
	//document.getElementById("menuRender").style.display = "block";
	document.getElementById("goMap").style.backgroundColor = "#333";
	document.getElementById("goSketch").style.backgroundColor = "#666";
	//editMode = false;
}


