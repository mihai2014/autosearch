function equalIgnoreCase(string1,string2){
    var areEqual = string1.toUpperCase() === string2.toUpperCase();
    return areEqual;
}
function isThere(name,dictList){
    for(var i=0; i<dictList.length; i++) {
        //if (name == dictList[i].name)
        if(equalIgnoreCase(name,dictList[i].name))
            return dictList[i].id;
    }
    return -1;
}
function labelRed(label,string){
    //if(id == "" || id == null) return;
    //var label = document.getElementById(id);
    label.style.color = "red";
    label.innerHTML = string;
}
function labelBlack(label,string){
    //if(id == "" || id == null) return;
    //var label = document.getElementById(id);
    label.style.color = "black";
    label.innerHTML = string;
}


function setAutoSearch(inputDiv){
    var showDivWidth = "140px";
    var showDivHeight = "100px";     //160px fit for 8 rows
    var maxRows = 8;

    //scan inputDiv to reach input type text element
    var children = inputDiv.childNodes;
    for(i=0; i<children.length; i++){
        var child = children[i];       
	if(child.tagName == "INPUT"){ 
	    if(child.type == "text") var input = child;
	}
    }   

    //scan inputDiv to reach input type hidden name url
    var children = inputDiv.childNodes;
    for(i=0; i<children.length; i++){
        var child = children[i];
        if(child.tagName == "INPUT"){
            if(child.type == "hidden") 
		if(child.name = "url")
		    var hidden = child;
        }
    }

    var link = hidden.value; 

    //setting for absolute positioning of showDiv child (parent must not be static)
    inputDiv.style.position = "relative";
 
    var inputName = input.id;
    var labelInput = document.getElementById("label"+inputName);
      
    var showDiv = document.createElement("div");
    showDiv.style.position = "absolute";
    showDiv.style.top = "1.5em";
    showDiv.style.height = showDivHeight; 
    showDiv.style.width = showDivWidth;
    showDiv.style.border = "1px solid black";
    showDiv.style.backgroundColor = "white";
    showDiv.style.overflow = "auto";
    showDiv.style.display = "none";
    showDiv.tabIndex = "-1";
    showDiv.style.zIndex = "100";

    inputDiv.appendChild(showDiv)

    var rowFocusMouse = null;

    var selectedRow;
    var selectedIdRow = -1;
    var selectedRowNr = -1;
    var selectedName = "";

    //this could be superfluu
    function detectSelectedRow(){
        var children = showDiv.childNodes;
        //identify already selected row
        //this have to be faster than document.getElementById(slelectedRowId)) because locally scanning
        for(i=0; i<children.length; i++){
            var child = children[i];
            if(child.tagName == "DIV"){
                if(child.style.backgroundColor == "green"){
                    return child;
                }
            }
        }
	return none;
    }

    function autocompleteInput(){
	input.value = selectedName;  
    }

    function selectByClick(row,rowNr){ 
	//var selectedRow = detectSelectedRow();
	selectedRow.style.backgroundColor = "white";

	//select new row
	row.style.backgroundColor = "green";
	selectedRow = row;
	selectedRowId = row.id;
	selectedName = row.name_str;
	selectedRowNr = rowNr;

	autocompleteInput(); 
	showDiv.style.display = "none";
    }

    function selectRowByArrow(direction){ 
	var maxNr  = showDiv.childNodes.length-1;	
	if(direction=="up"){
	    var newPos = selectedRowNr - 1;
	    if(newPos < 0) return;
            //deselect last
            selectedRow.style.backgroundColor = "white";
            //select new
            var newRow = selectedRow.previousSibling;
	}
	if(direction=="down"){
	    var newPos = selectedRowNr + 1;
	    if(newPos > maxNr) return;
            //deselect last
            selectedRow.style.backgroundColor = "white";
            //select new
            var newRow = selectedRow.nextSibling;
	}
        newRow.style.backgroundColor = "green";
        selectedRow = newRow;
        selectedRowId = newRow.id;
        selectedName = newRow.name_str;
        selectedRowNr = newPos;
/*


*/
	//auto adjust scroll position to fit selection in visible area
	//--------------------------------------------------------------------------------------------------------
        var rowHeight = newRow.scrollHeight;
	var rowOffsetTop = newRow.offsetTop;			//distance between row and top of showDiv
 	var showDivOffsetTop = showDiv.offsetTop;		//distance between showDiv and top body;
        var showDivUpward = showDiv.scrollTop;      		//hidden in top
        var showDivAllHeight = showDiv.scrollHeight; 		//entire scroll win
        var showDivVisibleHeight = showDiv.clientHeight;	//visible win , already defined upward: showDivHeight  

	var hiddenUpScroll = showDivUpward;
	var hiddenDownScroll = showDivAllHeight - showDivUpward - showDivVisibleHeight;
	//rowOffsetTop E [hiddenUpScroll , hiddenUpScroll + showDivVisibleHeight - rowHeight]

	if(rowOffsetTop < hiddenUpScroll){
	    var down = hiddenUpScroll - rowOffsetTop; 
	    showDiv.scrollBy(0,-1*down) 
	}

	if(rowOffsetTop > (hiddenUpScroll + showDivVisibleHeight - rowHeight)){
	    var up = rowOffsetTop - (hiddenUpScroll + showDivVisibleHeight - rowHeight); 
	    showDiv.scrollBy(0,up)
	}
	//---------------------------------------------------------------------------------------------------------
    }


    input.onkeydown = function(e){
        switch (e.keyCode) {
            //up arrow
            case 38:
		selectRowByArrow("up");
                break;
            //down arrow
            case 40:
		selectRowByArrow("down");
                break;
	    //enter
	    case 13:
		showDiv.style.display = "none";
		autocompleteInput();
		break
	    //esc
            case 27:
		showDiv.style.display = "none";
		break;
        }
    }

    //lost focus
    //onblur action is before click on row, so click selection could not happen
    //instead, we make selection here
    input.onblur = function(){
	if (rowFocusMouse){
            selectedRow = rowFocusMouse;
            selectedRowId = rowFocusMouse.id;
            selectedName = rowFocusMouse.name_str;
            //selectedRowNr = rowNr;
            autocompleteInput();
	}

	showDiv.style.display = "none";
    }

    //back
    input.onfocus = function(){
        var key = input.value;

        //empty input text
        if (key == ""){
            showDiv.style.display = "none";
            return;
        }
        
        var url = link + key;
        var req = new GET(url,success,"json");
        req.go();
	req = null;
    }

    function newRow(id,name_str,i){
	var row = document.createElement("div");

	row.onmouseover = function(){
	    if(this.style.backgroundColor == "green") return;
	    this.style.backgroundColor="gray"; 
	    rowFocusMouse = this; 
	}
	row.onmouseout = function() {
	    if(this.style.backgroundColor == "green") return;
	    this.style.backgroundColor="white"; 
	    //exclude situation: mouse focus row, leave row, tab which would select last mouse focus 
	    rowFocusMouse = null;
	}
	row.onclick = function(){
	    selectByClick(this,i);
	}

        //for different coloring text
        var l = input.value.length;
	var part1 = name_str.substring(0, l);
	var part2 = name_str.substring(l, name_str.length);
	name2 = part1 + "<span style='color:red '>" + part2 + "</span>";	

	row.id = id;
	row.name_str = name_str;
	//var text = document.createTextNode(name);
	//row.appendChild(text);
	row.innerHTML = name2;  
	showDiv.appendChild(row);

	//default select 1st row
	if(i==0){
            row.style.backgroundColor = "green";
	    selectedRow = row;
	    selectedIdRow = id;
	    selectedRowNr = i;
	    selectedName = name_str;
	}
    }

    function success(response){
	if(response.length > 0){
	    showDiv.style.display = "block";
	    //reset...
	    showDiv.innerHTML = "";

	    labelBlack(labelInput,inputName);
	}else{
	    showDiv.style.display = "none";

	    labelRed(labelInput,inputName+" nou!");
	}

	var max = 0;
	for(var i=0; i<response.length; i++){
	    max++;
	    var row     = response[i];
	    var id 	= row['id'];
	    var name 	= row['name'];
	    var label 	= row['label'];
	    //...and refresh
	    newRow(id,name,i);
	    if(max == maxRows) break;
	}

    }
    //function error(status){}

    input.onkeyup = function(e){
	var key = input.value;
	//empty input text or //tab
	if (key == "" ){
	    showDiv.style.display = "none";
	    return;
	}
	//arrow up and down, esc, enter
	if(e.keyCode == 38 || e.keyCode == 40 || e.keyCode == 27 || e.keyCode == 13){
	    return;
	}
	var url = link + key; 
	var req = new GET(url,success,"json"); 
	req.go();
	req = null;
    }

}

function initAutosearch(){
    //set all autosearch inputs
    var list = document.getElementsByClassName("autosearch");

    for (j = 0; j < list.length; j++) {
        var autosearch = list[j];
        setAutoSearch(autosearch);
    }
}

