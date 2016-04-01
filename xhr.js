function Debug(msg){
    var myWindow = window.open("", "", "width=400, height=400");
    myWindow.document.body.innerHTML = msg;
}

function param(object) {
    var encodedString = '';
    for (var prop in object) {
        if (object.hasOwnProperty(prop)) {
            if (encodedString.length > 0) {
                encodedString += '&';
            }
            encodedString += encodeURI(prop + '=' + object[prop]);
        }
    }
    return encodedString;
}
//var dict={"key 1":"a 2&#@","key2":"n"}
//alert(param(dict))

function getXHR(){
    var xhr = false;
    if (window.XMLHttpRequest)
        xhr = new XMLHttpRequest();                     //Firefox, Safari, >= IE 7 ...
    else if (window.ActiveXObject){                     //IE
        try {  xhr = new ActiveXObject('Microsoft.XMLHTTP');   }
        catch(e) {
            try {  xhr = new ActiveXObject("Msxml2.XMLHTTP");  }   // < IE 7
            catch(e) {}
        }
    }
    return xhr;
}

function GET(url,success,format,error){
    var self = this;

    // Instantiate XHR
    this.xhr = getXHR();

    if(!this.xhr) {
        alert("Ajax is not supported by your browser!");
        return;
    }

    this.url = url;
    this.success = success;
    this.error = error;
    this.format = format;

    this.xhr.onload = function() {
        if (self.xhr.status === 200) {
                response = self.xhr.responseText;
                if(format == "txt") response = self.xhr.responseText;
                if(format == "json") response = JSON.parse(self.xhr.responseText);
                if (self.success) self.success(response);
        }
        else{
                var err_name = err_codes[self.xhr.status][0];
                var err_state = err_codes[self.xhr.status][1];
                var fullDescription = err_codes[self.xhr.status][2];
                if(self.error)
                    self.error(self.xhr.status);
                else
                    alert("Error " + self.xhr.status + " : " + err_name + "\n[" + err_state + " - " + fullDescription+"]");
        }
    }

    this.xhr.onerror = function() {
        alert("Error: No response from server.");
    }

    // Send data to server
    this.go = function(){
        this.xhr.open('GET', self.url);
        this.xhr.send(null);
    }

}

function POST(url,params,success,format,error){
    var self = this;

    // Instantiate XHR
    this.xhr = getXHR();
    if(!this.xhr) {
        alert("Ajax is not supported by your browser!");
        return;
    }

    this.url = url;
    this.success = success;
    this.error = error;
    this.format = format;

    this.xhr.onload = function() {
        if (self.xhr.status === 200) {
                response = self.xhr.responseText;
                if(format == "txt") response = self.xhr.responseText;
                if(format == "json") response = JSON.parse(self.xhr.responseText);
                if (self.success) self.success(response);
        }
        else{
                var err_name = err_codes[self.xhr.status][0];
                var err_state = err_codes[self.xhr.status][1];
                var fullDescription = err_codes[self.xhr.status][2];
                if(self.error)
                    self.error(self.xhr.status);
                else
                    alert("Error " + self.xhr.status + " : " + err_name + "\n[" + err_state + " - " + fullDescription+"]");
        }
    }

    this.xhr.onerror = function() {
        alert("Error: No response from server.");
    }

    //send data to server
    this.go = function(){
        this.xhr.open('POST', self.url);
        this.xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	//=========================================================================
	/****  include  in template  ****/
	var csrf_token = document.getElementsByName("csrfmiddlewaretoken")[0].value;
	/****  render csrf in views.py  ****/
	//var csrf_token = "{{ csrf_token }}"
	this.xhr.setRequestHeader("X-CSRFToken", csrf_token );
	//=========================================================================
        self.xhr.send(params);
    }

}

/*
function success(response){
}
var req = new GET("url",success,"json");

or

req.url = "url"
req.success = function(response)(){}
req.format = "json";
req.go();
*/
