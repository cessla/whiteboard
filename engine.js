/*
PWI Projekt - Wirtualne płótno
Sławomir Cesarz
Informatyka, sem.5
2015

source:
https://dev.opera.com/articles/html5-canvas-painting/
http://bucephalus.org/text/CanvasHandbook/CanvasHandbook.html
https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial
http://stackoverflow.com/
http://www.w3.org/TR/DOM-Level-2-Events/events.html#Events-EventListener
*/


var lastTimestamp = "";
window.onload = function () {
	'use strict';
	var tempCanvas,	tempContext, baseCanvas, baseContext;
	var thumbArray = [];
	
	// The active tool instance.
	var tool, strokeStyle, fillStyle, lineWidth;
	var tool_default = 'line';
	var strokeStyle_default = '#0000ff';
	var fillStyle_default = '#00ff00';
	var lineWidth_default = 3;

	var activeUserId = readCookie('whiteboardUserId');
	var thumbListArr = [];
	
	function init() {
		// Find the baseCanvas element.
		baseCanvas = document.getElementById('baseCanvas');
		baseCanvas.width = 400;
		baseCanvas.height = 300;
			
		if (!baseCanvas) {
			alert('Error: I cannot find the tempCanvas element!');
			return;
		}

		if (!baseCanvas.getContext) {
			alert('Error: no baseCanvas.getContext!');
			return;
		}

		// Get the 2D baseCanvas context.
		baseContext = baseCanvas.getContext('2d');
		if (!baseContext) {
			alert('Error: failed to getContext!');
			return;
		}

		// Add the temporary canvas.
		var canvasContainer = baseCanvas.parentNode;
		tempCanvas = document.createElement('canvas');
		if (!tempCanvas) {
			alert('Error: I cannot create a new tempCanvas element!');
			return;
		}

		tempCanvas.id = 'tempCanvas';
		tempCanvas.width = baseCanvas.width;
		tempCanvas.height = baseCanvas.height;
		canvasContainer.appendChild(tempCanvas);

		tempContext = tempCanvas.getContext('2d');
		tempContext.lineCap = 'round';
		baseContext.lineCap = 'round';
		
		
		
		
		

		// Get the tool select input.
		var tool_select = document.getElementById('toolSelector');
		if (!tool_select) {
			alert('Error: failed to get the toolSelector element!');
			return;
		}
		tool_select.addEventListener('change', event_tool_change, false);

		// Activate the default tool.
		if (toolset[tool_default]) {
			tool = new toolset[tool_default]();
			tool_select.value = tool_default;
		}

		// Get the stroke color select input.
		var strokeStyle_select = document.getElementById('strokeStyleSelector');
		if (!strokeStyle_select) {
			alert('Error: failed to get the strokeStyleSelector element!');
			return;
		}
		strokeStyle_select.addEventListener('change', event_strokeStyle_change, false);
		
		var strokeStyle_nodes = strokeStyle_select.childNodes;
		var strokeStyle_nodesLen = strokeStyle_nodes.length;
		for (var i=0; i< strokeStyle_nodesLen; i++) {
			if (strokeStyle_nodes[i].nodeName.toLowerCase() == 'option') {
				//console.log(nodes[i].textContent);
				 strokeStyle_nodes[i].style.background = (strokeStyle_nodes[i].textContent).toLowerCase();
			 }
		}

		// Activate the default stroke color.
		if (!toolset.strokeStyle) {
			toolset.strokeStyle = strokeStyle_default;
			strokeStyle_select.value = strokeStyle_default;
			strokeStyle_select.style.background = strokeStyle_default;
			tempContext.strokeStyle = strokeStyle_default;
		}

		// Get the fill color select input.
		var fillStyle_select = document.getElementById('fillStyleSelector');
		if (!fillStyle_select) {
			alert('Error: failed to get the fillStyleSelector element!');
			return;
		}
		fillStyle_select.addEventListener('change', event_fillStyle_change, false);

		var fillStyle_nodes = fillStyle_select.childNodes;
		var fillStyle_nodesLen = fillStyle_nodes.length;
		for (var i=0; i< fillStyle_nodesLen; i++) {
			if (fillStyle_nodes[i].nodeName.toLowerCase() == 'option') {
				//console.log(nodes[i].textContent);
				 fillStyle_nodes[i].style.background = (fillStyle_nodes[i].textContent).toLowerCase();
			 }
		}
		
		// Activate the default fill color.
		if (!toolset.fillStyle) {
			toolset.fillStyle = fillStyle_default;
			fillStyle_select.value = fillStyle_default;
			fillStyle_select.style.background = fillStyle_default;
			tempContext.fillStyle = fillStyle_default;
		}

		// Get the line width select input.
		var lineWidth_select = document.getElementById('lineWidthSelector');
		if (!lineWidth_select) {
			alert('Error: failed to get the lineWidthSelector element!');
			return;
		}
		lineWidth_select.addEventListener('change', event_lineWidth_change, false);

		// Activate the default stroke color.
		if (!toolset.lineWidth) {
			toolset.lineWidth = lineWidth_default;
			lineWidth_select.value = lineWidth_default;
			tempContext.lineWidth = lineWidth_default;
		}

		// Attach the mousedown, mousemove and mouseup event listeners.
		tempCanvas.addEventListener('mousedown', event_tempCanvas, false);
		tempCanvas.addEventListener('mousemove', event_tempCanvas, false);
		tempCanvas.addEventListener('mouseup', event_tempCanvas, false);
		tempCanvas.addEventListener('click', event_tempCanvas, false);
		window.addEventListener('keydown', event_tempCanvas, false);
		window.addEventListener('keyup', event_tempCanvas, false);
		window.addEventListener('keypress', event_tempCanvas, false);
		
	}
	
	
	// The general-purpose event handler. This function just determines the mouse
	// position relative to the tempCanvas element.
	function event_tempCanvas(e) {
		if (e.layerX || e.layerX == 0) { // Firefox
			e._x = e.layerX;
			e._y = e.layerY;
		} else if (e.offsetX || e.offsetX == 0) { // Opera
			e._x = e.offsetX;
			e._y = e.offsetY;
		}

		// Call the event handler of the tool.
		var func = tool[e.type];
		if (func) {
			func(e);
		}
	}

	// The event handler for any changes made to the tool selector.
	function event_tool_change(e) {
		if (toolset[this.value]) {
			console.log("warunek if: true");
			tool = new toolset[this.value]();
		}
	}
	// The event handler for any changes made to the stroke color selector.
	function event_strokeStyle_change(e) {
		if (toolset.strokeStyle != this.value) {
			toolset.strokeStyle = this.value;
			tempContext.strokeStyle = this.value;
			this.style.background = this.value;
		}
	}

	// The event handler for any changes made to the fill color selector.
	function event_fillStyle_change(e) {
		if (toolset.fillStyle != this.value) {
			toolset.fillStyle = this.value;
			tempContext.fillStyle = this.value;
			this.style.background = this.value;
		}
	}

	// The event handler for any changes made to the line width selector.
	function event_lineWidth_change(e) {
		if (toolset.lineWidth != this.value) {
			toolset.lineWidth = this.value;
			tempContext.lineWidth = this.value;
		}
	}

	
	function baseImgUpdate() {
		baseContext.drawImage(tempCanvas, 0, 0);
		tempContext.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
	}

	// This object holds the implementation of each drawing tool.
	var toolset = {};
	
	toolset.logs = {};
	toolset.logName = "";
	toolset.genName = function () {
		var randomName = "log_" + Date.now() + "_" + (Math.floor(Math.random() * (999 - 100 + 1)) + 100);
		toolset.logName = randomName;
	}
	
	// The drawing pencil.
	toolset.pencil = function () {
		var tool = this;
		this.started = false;
		tool.log = "";

		
		this.click = function (e) {
			//console.log(toolset.lineWidth);
			tempContext.beginPath();
			tempContext.moveTo(e._x, e._y);
			tempContext.lineTo(e._x + 0.5, e._y + 0.5);
			tempContext.stroke();
			tempContext.closePath();
			//tempContext.fillRect(e._x,e._y,toolset.lineWidth,toolset.lineWidth);
			
			var log = "c.strokeStyle = '"+ tempContext.strokeStyle +"';\nc.lineWidth = '"+ tempContext.lineWidth +"';\nc.beginPath();\nc.moveTo("+ e._x +", "+ e._y +");\nc.lineTo("+ (e._x + 0.5) +", "+ (e._y + 0.5) +");\nc.stroke();\nc.closePath();\n";
				//console.log(tool.log);
			
			var data = "user="+ activeUserId +"&image="+ readCookie('whiteboardImageId') +"&command=" + encodeURIComponent(log); //btoa(tool.log);
			makeRequest("POST", "collectData.php", data, sendData);
			
			
			baseImgUpdate();
		};
	};

	// The rectangle tool.
	toolset.rect = function () {
		var tool = this;
		this.started = false;
		this.symetric = false;
		

		this.mousedown = function (e) {
			tool.started = true;
			tool.startX = e._x;
			tool.startY = e._y;
		};

		this.mousemove = function (e) {
			if (!tool.started) {
				return;
			}

			tool.rectStartX = Math.min(e._x, tool.startX),
			tool.rectStartY = Math.min(e._y, tool.startY),
			tool.rectWidth = Math.abs(e._x - tool.startX),
			tool.rectHeight = Math.abs(e._y - tool.startY);

			tempContext.clearRect(0, 0, tempCanvas.width, tempCanvas.height);

			if (tool.symetric) {
				tool.rectHeight = tool.rectWidth;
			}
			if (!tool.rectWidth || !tool.rectHeight) {
				return;
			}

			tempContext.fillRect(tool.rectStartX, tool.rectStartY, tool.rectWidth, tool.rectHeight);
			tempContext.strokeRect(tool.rectStartX, tool.rectStartY, tool.rectWidth, tool.rectHeight);

			// console.log(tool.rectStartX, tool.rectStartY, tool.rectWidth, tool.rectHeight);
		};

		this.mouseup = function (e) {
			if (tool.started) {
				tool.mousemove(e);
				tool.started = false;
				tool.symetric = false;

				var log = "c.fillStyle = '" + tempContext.fillStyle + "';\nc.strokeStyle = '" + tempContext.strokeStyle + "';\nc.lineWidth = '" + tempContext.lineWidth + "';\nc.fillRect(" + tool.rectStartX + ", " + tool.rectStartY + ", " + tool.rectWidth + ", " + tool.rectHeight + ");\nc.strokeRect(" + tool.rectStartX + ", " + tool.rectStartY + ", " + tool.rectWidth + ", " + tool.rectHeight + ");\n";
				//console.log(tool.log);
				var command = encodeURIComponent(log);
				var data = "user="+ activeUserId +"&image="+ readCookie('whiteboardImageId') +"&command=" + log; //btoa(tool.log);
				makeRequest("POST", "collectData.php", data, sendData);

				baseImgUpdate();
			}
		};

		this.keydown = function (e) {
			var evt = e || window.event;
			var isShift = evt.shiftKey ? true : false;
			if (isShift) {
				tool.symetric = true;
			}
			//console.log(evt.charCode > evt.keyCode ? evt.charCode : evt.keyCode);
			//console.log(isShift);
		};

		this.keyup = function (e) {
			var evt = e || window.event;
			//var isShift = evt.shiftKey ? true : false;
			if (evt.keyCode == 16) {
				tool.symetric = false;
			}
		};
	};

	// The line tool.
	toolset.line = function () {
		var tool = this;
		this.started = false;
		this.logName = "";
		this.log = "";

		this.mousedown = function (e) {
			tool.started = true;
			toolset.genName();
			tool.logName = toolset.logName;
			tool.startX = e._x;
			tool.startY = e._y;
		};

		this.mousemove = function (e) {
			if (!tool.started) {
				return;
			}
			tool.endX = e._x;
			tool.endY = e._y;
			tempContext.clearRect(0, 0, tempCanvas.width, tempCanvas.height);

			tempContext.beginPath();
			tempContext.moveTo(tool.startX, tool.startY);
			tempContext.lineTo(e._x, e._y);
			tempContext.stroke();
			//tempContext.closePath();
		};

		this.mouseup = function (e) {
			if (tool.started) {
				//tool.mousemove(e);
				tool.started = false;
				//console.log(tempContext.fillStyle);
				var log = "c.fillStyle = '" + tempContext.fillStyle + "';\nc.strokeStyle = '" + tempContext.strokeStyle + "';\nc.lineWidth = '" + tempContext.lineWidth + "';\nc.beginPath();\nc.moveTo(" + tool.startX + ", " + tool.startY + ");\nc.lineTo(" + tool.endX + ", " + tool.endY + ");\nc.stroke();\nc.closePath();\n";
				//console.log(tool.log);
				var command = encodeURIComponent(log);
				var data = "user="+ activeUserId +"&image="+ readCookie('whiteboardImageId') +"&command=" + command; //btoa(tool.log);
				makeRequest("POST", "collectData.php", data, sendData);

				//tool.log = "";
				baseImgUpdate();
			}
		};
	};

	// The ellipse tool.
	toolset.ellipse = function () {
		var tool = this;
		this.started = false;
		this.symetric = false;
		this.log = "";

		this.mousedown = function (e) {
			tool.started = true;
			tool.centerX = e._x;
			tool.centerY = e._y;

		};

		this.mousemove = function (e) {
			if (!tool.started) {
				return;
			}

			tempContext.clearRect(0, 0, tempCanvas.width, tempCanvas.height);

			tool.radiusX = Math.abs(e._x - tool.centerX);
			tool.radiusY = Math.abs(e._y - tool.centerY);
	
			if (tool.symetric) {
				tool.radiusY = tool.radiusX;
			}
			
			tempContext.beginPath();
			var xPos,
			yPos;
			for (var i = 0 * Math.PI; i < 2 * Math.PI; i += 0.2) {
				xPos = tool.centerX - (tool.radiusY * Math.sin(i)) * Math.sin(0 * Math.PI) + (tool.radiusX * Math.cos(i));
				yPos = tool.centerY + (tool.radiusX * Math.cos(i)) * Math.sin(0 * Math.PI) + (tool.radiusY * Math.sin(i));

				if (i == 0) {
					tempContext.moveTo(xPos, yPos);
					tool.log += "c.moveTo(" + xPos + ", " + yPos + ");\n";
				} else {
					tempContext.lineTo(xPos, yPos);
					tool.log += "c.lineTo(" + xPos + ", " + yPos + ");\n";
				}
			}
			
			
			tool.log = "var xPos, yPos;\nfor (var i = 0 * Math.PI; i < 2 * Math.PI; i += 0.2) {\nxPos = "+ tool.centerX +" - ("+ tool.radiusY +" * Math.sin(i)) * Math.sin(0 * Math.PI) + ("+ tool.radiusX +" * Math.cos(i));\nyPos = "+ tool.centerY +" + ("+ tool.radiusX +" * Math.cos(i)) * Math.sin(0 * Math.PI) + ("+ tool.radiusY +" * Math.sin(i));\nif (i == 0) {\nc.moveTo(xPos, yPos);\n} else {\nc.lineTo(xPos, yPos);\n}\n}\n";
			
			/* different approach
			tempContext.beginPath();

			tempContext.moveTo(tool.centerX, tool.centerY - tool.radiusY);

			tempContext.bezierCurveTo(
			tool.centerX + tool.radiusX, tool.centerY - tool.radiusY,
			tool.centerX + tool.radiusX, tool.centerY + tool.radiusY,
			tool.centerX, tool.centerY + tool.radiusY);

			tempContext.bezierCurveTo(
			tool.centerX - tool.radiusX, tool.centerY + tool.radiusY,
			tool.centerX - tool.radiusX, tool.centerY - tool.radiusY,
			tool.centerX, tool.centerY - tool.radiusY);

			 */

			tempContext.closePath();

			tempContext.fill();
			tempContext.stroke();

		};

		this.mouseup = function (e) {
			if (tool.started) {
				tool.mousemove(e);
				tool.started = false;
				var log = "c.fillStyle = '" + tempContext.fillStyle + "';\nc.strokeStyle = '" + tempContext.strokeStyle + "';\nc.lineWidth = '" + tempContext.lineWidth + "';\nc.beginPath();\n" + tool.log + "c.closePath();\nc.fill();\nc.stroke();\n";
				//console.log(tool.log);
				var command = encodeURIComponent(log);
				var data = "user="+ activeUserId +"&image="+ readCookie('whiteboardImageId') +"&command=" + command; //btoa(tool.log);
				makeRequest("POST", "collectData.php",  data, sendData);
				baseImgUpdate();
			}
		};

		this.keydown = function (e) {
			var evt = e || window.event;
			var isShift = evt.shiftKey ? true : false;
			if (isShift) {
				tool.symetric = true;
			}
			//console.log(evt.charCode > evt.keyCode ? evt.charCode : evt.keyCode);
			//console.log(isShift);
		};

		this.keyup = function (e) {
			var evt = e || window.event;
			//var isShift = evt.shiftKey ? true : false;
			if (evt.keyCode == 16) {
				tool.symetric = false;
			}
		};

	};

	toolset.text = function () {
		var tool = this;
		this.started = false;
		this.textToDraw = "";
		

		this.click = function (e) {
			if (!tool.started) {
				tool.textToDraw = "";
				tool.started = true;
				tool.startX = e._x;
				tool.startY = e._y;
				
			} else {
				tool.started = false;
				var log = "c.font = '"+ (5 * tempContext.lineWidth) +"pt Arial';\nc.fillStyle = '" + tempContext.fillStyle + "';\nc.fillText('"+ tool.textToDraw +"', "+ tool.startX +", "+ tool.startY +");\n";
				var command = encodeURIComponent(log);
				var data = "user="+ activeUserId +"&image="+ readCookie('whiteboardImageId') +"&command=" + command;
				if (tool.textToDraw != "") {
					makeRequest("POST", "collectData.php",  data, sendData);
				}
				
				baseImgUpdate();
				return;
			}
		};

		this.keyup = function (e) {
			var evt = e || window.event;
			console.log(evt.keyCode);
			//var isShift = evt.shiftKey ? true : false;

			if (tool.started) {
				if (evt.keyCode == 13) {
					tool.started = false;
					
					tempContext.lineWidth = tool.tempLineWidth;
					tool.tempLineWidth = 3;
					
					baseImgUpdate();
					return;
				} else if (evt.keyCode == 8) {
					//console.log(tool.textToDraw);
					tool.textToDraw = tool.textToDraw.slice(0, -1);
					//console.log(tool.textToDraw);
				} else if (evt.keyCode >= 48 && evt.keyCode <= 90) {
					console.log("text" + tool.textToDraw);
					tool.textToDraw += String.fromCharCode(evt.keyCode);
				}

				tempContext.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
				
				tempContext.font = (5 * tempContext.lineWidth) + "pt Arial";
				tempContext.fillText(tool.textToDraw, tool.startX, tool.startY);
				//tempContext.strokeText(tool.textToDraw, tool.startX, tool.startY);
			}
		};

		this.keydown = function (e) {
			var evt = e || window.event;
			if (evt.keyCode == 8) {
				evt.preventDefault();
				//tool.keyup(e);
			}
			//console.log(evt.charCode > evt.keyCode ? evt.charCode : evt.keyCode);
			//console.log(isShift);
		};
	};

	init();
	makeRequest('POST', 'getThumbnails.php', 'page=1', attachThumbs);
	
	(function callLoop() {
		makeRequest('POST', 'getData.php', 'user='+ activeUserId +'&image='+ readCookie('whiteboardImageId') +'&timestamp='+ encodeURIComponent(lastTimestamp), drawImage);
		setTimeout(callLoop, 1500);
	}()); 

	(function callLoop() {
		setTimeout(createThumb(), 5000);
		setTimeout(callLoop, (1000*30));
	}());
		/**/
	
}

function makeRequest(type, url, data, func) {
	//console.log(type+' '+url+' '+data);
	if (window.XMLHttpRequest) { // Mozilla, Safari, ...
		var httpRequest = new XMLHttpRequest();
	} else if (window.ActiveXObject) { // IE
		try {
			var httpRequest = new ActiveXObject("Msxml2.XMLHTTP");
		} catch (e) {
			try {
				var httpRequest = new ActiveXObject("Microsoft.XMLHTTP");
			} catch (e) {}
		}
	}

	if (!httpRequest) {
		alert('Giving up :( Cannot create an XMLHTTP instance');
		return false;
	}
	httpRequest.onreadystatechange = function() {
		if (httpRequest.readyState === 4) {
			if (httpRequest.status === 200) {
				func(httpRequest);
			} else {
				alert('There was a problem with the request.');
			}
		}
	};
	httpRequest.open(type, url);
	httpRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	httpRequest.send(data);
}

function drawImage(httpRequest) {
	//	var res = atob(httpRequest.responseText);
	var res = httpRequest.responseText;
	var dres = decodeURIComponent(res);
	//alert(res);
	//console.log(res);
	console.log(dres);
	//console.log(httpRequest.responseText);
	var baseCanvas = document.getElementById('baseCanvas');
	var c = baseCanvas.getContext('2d');
	eval(dres);
}

function sendData(httpRequest) {
	//	var res = atob(httpRequest.responseText);
	var res = httpRequest.responseText;
	//var dres = decodeURIComponent(res)
	//alert(res);
	//console.log(res);
	console.log(res);
}

function setupCanvas(httpRequest) {
	//	var res = atob(httpRequest.responseText);
	var res = httpRequest.responseText;
	var value = parseInt(res, 10);
	//alert(res);
	console.log(res);
	//console.log(dres);

	createCookie('whiteboardImageId', value, 7, '/');
	//toolset.openImageId = value;

	var tools = document.getElementById('tools');
	tools.setAttribute('style', 'display:block;');

	var canvasContainer = document.getElementById('canvasContainer');
	canvasContainer.setAttribute('style', 'display:block;');

	var baseCanvas = document.getElementById('baseCanvas');
	var baseContext = baseCanvas.getContext('2d');
	baseContext.clearRect(0, 0,baseCanvas.width, baseCanvas.height);
}

function checkResponse(httpRequest) {
	var res = httpRequest.responseText;
	console.log(res);	
}

function displayThumb(httpRequest) {
	var res = httpRequest.responseText;
	var dataURL = decodeURIComponent(res);
	var c = document.getElementById('baseCanvas');
	var tx = c.getContext('2d');
	var img = new Image();
	img.src = dataURL;
	console.log(img);
	tx.drawImage(img, 0, 0);	
}

function createCookie(key, value, validTime, path) {
	var date = new Date();
	date.setTime(date.getTime() + (validTime * 7 * 24 * 60 * 60 * 1000));
	var expireDate = date.toUTCString();
	document.cookie = key +"="+ value +";expires="+ expireDate +";path="+ path +";";
}

function readCookie(key) {
	var cookie_value = "",
    current_cookie = "",
    name_expr = key + "=",
    all_cookies = document.cookie.split(';'),
    n = all_cookies.length;
 	//console.log(all_cookies);
	
	for(var i = 0; i < n; i++) {
		current_cookie = all_cookies[i].trim();
		if(current_cookie.indexOf(name_expr) == 0) {
			cookie_value = current_cookie.substring(name_expr.length, current_cookie.length);
			break;
		}
	}
	return cookie_value;
}

function downloadImage() {
	var c = document.getElementById('baseCanvas');
	var link = document.getElementById('imageLink');
	link.setAttribute('download', 'whiteboardDump.png');
	link.setAttribute('href', c.toDataURL("image/png").replace("image/png", "image/octet-stream"));
}

function createThumb() {
	var c = document.getElementById('baseCanvas');
	var t = document.createElement('canvas');
	if (!t) {
		alert('Error: I cannot create a new tempCanvas element!');
		return;
	}
	var tx = t.getContext('2d');
	t.width = 160;
	t.height = 120;

	var dataURL = c.toDataURL();
	tx.drawImage(c, 0, 0, t.width, t.height);
	var thumb = encodeURIComponent(t.toDataURL("image/png"));
	var imageid = readCookie('whiteboardImageId');
	makeRequest('POST', 'saveThumbnail.php', 'imageid='+ imageid +'&thumb='+ thumb, checkResponse);
}

function displayImageList(httpRequest) {
	var res = httpRequest.responseText;
	var dataURL = decodeURIComponent(res);
	var c = document.getElementById('baseCanvas');
	var tx = c.getContext('2d');
	var img = new Image();
	img.src = dataURL;
	console.log(img);
	tx.drawImage(img, 0, 0);	
}

function addImageList(httpRequest) {
	var res = httpRequest.responseText;
	console.log(res);
	var objectArr = JSON.parse(res);

	//alert(jsonObj);
	//json = jsonObj
	//console.log(objectArr);
	//console.log(json);
	drawThumbs(objectArr);
}

function drawThumbs(objectArr) {
	var list = "";
	var len = objectArr.length;
	var elem;
	var parent = document.getElementById('thumbList');
	
	while (parent.firstChild) {
    	parent.removeChild(parent.firstChild);
	}
	
	for (var i = 0; i < len; i++) {
		elem = document.createElement('img');
		//console.log(elem);
		elem.setAttribute('id', 'item_'+ objectArr[i].ID);
		elem.setAttribute('class', 'thumListItem');
		elem.setAttribute('width', '160px');
		elem.setAttribute('height', '120px');
		//list += "<img id='item_"+ objectArr[i].id +"' class='thumListItem' width='160px' height='120px' />";
		parent.appendChild(elem);
		makeRequest('post', 'getThumb.php', 'imageid='+objectArr[i].ID, insertThumb);
		//console.log(objectArr[i].ID);		
	}
}

function insertThumb(httpRequest) {
	var res = httpRequest.responseText;
	//console.log(res);
	var objectArr = JSON.parse(res);

	var imageid = objectArr.ID;
	var dataURL = objectArr.thumb;

	console.log(imageid);
	console.log(dataURL);

	console.log('item_'+imageid);
	var imgTag = document.getElementById('item_'+imageid);
	console.log(imgTag);
	imgTag.setAttribute('src', dataURL);								
}

function attachThumbs(httpRequest) {		
	var res = httpRequest.responseText;
	//console.log(res);
	var objectArr = JSON.parse(res);
	console.log(JSON.parse(res));
	//var objectArr = res;
	var len = objectArr.length;
	//var imageid = objectArr.ID;
	var dataURL;
	//console.log(len);
	var parent = document.getElementById('thumbList');

	while (parent.firstChild) {
		parent.removeChild(parent.firstChild);
	}
	var elem, elemid, link;
	for (var i=0; i < len; i++) {
		elem = document.createElement('img');
		//console.log(elem);
		//console.log(objectArr[i]);
		elemid = 'item_'+ objectArr[i].ID;
		//console.log(objectArr[i]);
		//console.log(elemid);
		if (objectArr[i].thumb) {
			dataURL = objectArr[i].thumb;
		} else {
			dataURL = "img/nothumb.png";
		}

		elem.setAttribute('id', elemid);
		elem.setAttribute('class', 'thumbListItem');
		//console.log(objectArr[i].thumb);
		elem.setAttribute('src', dataURL);
		elem.setAttribute('width', '160px');
		elem.setAttribute('height', '120px');

		parent.appendChild(elem);
		elem.addEventListener('click', loadImage, false);
	}				
}

function clearCanvas() {
	var baseCanvas = document.getElementById('baseCanvas');
	var baseContext = baseCanvas.getContext('2d');
	baseContext.clearRect(0, 0, baseCanvas.width, baseCanvas.height);
	
	var tempCanvas = document.getElementById('tempCanvas');
	var tempContext = tempCanvas.getContext('2d');
	tempContext.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
}


function loadImage(e) {
	console.log('loading image ...');
	createThumb();
	var openImage = (this.id).substring(5);
	var currentImage = readCookie('whiteboardImageId');
	var userid = readCookie('whiteboardUserId');
	
	var tools = document.getElementById('tools');
			tools.setAttribute('style', 'display:block;');
			
			var canvasContainer = document.getElementById('canvasContainer');
			canvasContainer.setAttribute('style', 'display:block;');
				
	if (openImage != currentImage) {
		createCookie('whiteboardImageId', openImage, 7, '/');
		//toolset.openImageId = openImage;
		clearCanvas();
		makeRequest('POST', 'getData.php', 'user='+ userid +'&image='+ openImage +'&timestamp=0', drawImage);
		
	}
	//var imageid = parseInt(elemid, 10);
	console.log("chce otworzyc: "+ openImage);
	console.log("zminiam cooki na: "+ readCookie('whiteboardImageId'));
	//console.log("id zapisany: "+ openImageID);	
}

