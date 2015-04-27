
var searchList = [];	//create array to hold gists returned from search

// object for each instance of gists returned from search
function GistEntry(gName,gAdd,gistId){
	this.gName = gName;
	this.gAdd = gAdd;
	this.gistId = gistId;
}


function fetchGists(){
	var req = new XMLHttpRequest();
	if(!req){
		throw 'Unable to create HttpRequest.';
	}

	var url = "https://api.github.com/gists/public"

	req.onreadystatechange = function(){
		if (req.readyState === 4){
			var gistLog = JSON.parse(this.responseText)
			for (var i = 0; i < gistLog.length; i++){
				var gistName = gistLog[i].description;
				var gistAdd = gistLog[i].url;
				var gistId = gistLog[i].id;
				var g = new GistEntry(gistName, gistAdd, gistId);
				searchList.push(g);
			}
		}
		createSearchList(document.getElementById("gist-list"));
	}
	req.open('GET', url);
	req.send();
}

function createSearchList(ul){
	for (var i = 0; i < 10; i++){
		var de = document.createElement('de');
		de.appendChild(deGist(searchList[i]));
		ul.appendChild(de);
		var fbutton = document.createElement("button");
		fbutton.innerHTML = "Favorite";
		fbutton.setAttribute("gistId", searchList[i].gistId);
		fbutton.onclick = function(){
			var gistId = this.getAttribute("gistId");
			var toBeFavoredGist = findById(gistId);
			localStorage.setItem("favorites", toBeFavoredGist);
			createFavorites(document.getElementById("fgist-list"));
		}
		de.appendChild(fbutton);
	}
}


function deGist(g) {
	var dl = document.createElement('dl');
	var dt = document.createElement('dt');
	var gistLink = document.createElement('a');
	dt.textContent = 'URL: ';
	gistLink.href = g.gAdd;
	dl.appendChild(dt);
	dl.appendChild(gistLink);
	var dd = document.createElement('dd');
	entry = dlEntry('Description', g.gName);
	dl.appendChild(entry.dt);
	dl.appendChild(entry.dd);
	dl.style.backgroundColor = 'lightgrey';
	dl.style.fontFamily = 'helvetica';
	return dl;
}

function dlEntry(term, definition){
	var dt = document.createElement('dt');
	var dd = document.createElement('dd');
	dt.textContent = term;
	dd.textContent = definition;
	return {'dt':dt, 'dd':dd};
}

function findById(id){
	for (var i = 0; i < searchList.length; i++){
		if (searchList[i].gistId == id){
			return searchList[i];
		}
	}
}

function createFavorites(ul){
	var favGist = localStorage.getItem("favorites");
	var de = document.createElement('de');
	de.appendChild(deGist(favGist));
	ul.appendChild(de);

}


window.onload = function() {
	var settingsStr = localStorage.getItem('userList');
	if( settingsStr === null ) {
		settings = {'list':[]};
		localStorage.setItem('userList', JSON.stringify(settings));
	}
	else {
		settings = JSON.parse(settingsStr);
	}
	//createFavorites(document.getElementById("fgist-list"));
}
