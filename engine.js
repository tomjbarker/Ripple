var http = require("http");
var url = require("url");

var handle = {}
handle["/"] = checkUA;
handle["/favicon.ico"] = favicon;

var uaViewPortCategories = {
	"320": new RegExp(/Nexus S|iPhone|BB10|Nexus 4|Nexus 5|HTC|LG|GT/),
	"640": new RegExp(/Nexus 7/),
	"1024": new RegExp(/Silk|iPad|Android/)
};

var assetPath = {
	"css": "assets/css/1024/",
	"img": "assets/img/1024/",
	"js": "assets/js/1024/"
};

var serv = http.createServer(function (req, res) {
    var pathname = url.parse(req.url).pathname;
	route(pathname, res, req);
});


function route(path, res, req){
	console.log("routing " + path)
	handle[path](res, req);
}


function checkUA(res, req) {
	var ua = req.headers["user-agent"]
	var re = new RegExp(/iPhone|iPod|iPad|Mobile|Android/);
	if(re.exec(ua)){
		getMobileCapabilities(ua, res);
	}
	renderExperience(res);
}


function getMobileCapabilities(ua, res){
    res.writeHead(200, { "Content-Type": "text/html" });
	var viewPortWidth = 1024;
	if(uaViewPortCategories["320"].exec(ua)){
		viewPortWidth = 320
	}else if(uaViewPortCategories["640"].exec(ua)){
		viewPortWidth = 640
	}else if(uaViewPortCategories["1024"].exec(ua)){
		viewPortWidth = 1024
	}
	
	assetPath.css = "assets/css/"+viewPortWidth+"/";
	assetPath.img = "assets/img/"+viewPortWidth+"/"
	assetPath.js = "assets/js/"+viewPortWidth+"/"
}

function renderExperience(res){
    res.writeHead(200, { "Content-Type": "text/html" });
    res.write(assetPath.css + "<br/>");
	res.write(assetPath.img + "<br/>");
	res.end(assetPath.js);
}


function favicon(res, req){
	res.writeHead(200, {
'Content-Type': 'image/x-icon'
} );
	res.end();
}


serv.listen(3000);