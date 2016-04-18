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


function REQ(url,key,success){
    xhr = getXHR();
    if(!xhr) message1("Ajax is not supported by your browser!");

    xhr.onload = function() {
        if (xhr.status === 200){
            if (success) success(xhr.responseText,key);
        }
        else{
            alert("Error " + xhr.status);
        }
    }

    xhr.onerror = function() {
        alert("Error: No response.");
    }

    xhr.open('GET', url);
    xhr.responseType = "text";
    xhr.send(null);
}