<!-- Derick Mullis Visual Framework_1306 Project 1 -->

window.addEventListener("DOMContentLoaded", function(){

function $(x){
	var element = document.getElementById(x);
	return element;
}

function getType() {
	var itemType = document.forms[0].type;
	for(var i=0; i < itemType.length; i++){
		if(itemType[i].checked) {
			typeValue = itemType[i].value;
		}
	}
}

function getQuality() {
	var itemQuality = document.forms[0].quality;
	for(var i=0; i < itemQuality.length; i++){
		if(itemQuality[i].checked) {
			typeQuality = itemQuality[i].value;
		}
	}
}

function saveData(key){
	//condition for if key or not to store new data or edit current data
	if(!key){
	var storeNumber = Math.floor(Math.random()*100000001);
	} else {
		storeNumber = key;  //use existing key to update not create new item in local storage
	}
	getType();
	getQuality();
	var object 				= {};
	object.archetype		= ["Archetype:", $("aGroup").value];
	object.item 			= ["Item Name:", $("itemName").value];
	object.type 			= ["Type:", typeValue];
	object.classification 	= ["Classification:", $("classification").value];
	object.quality 			= ["Quality:", typeQuality];
	object.sellValue 		= ["Sell Value:", $("sellRange").value];
	object.dateStashed 		= ["Date Stashed:", $("stashDate").value];
	object.droppedFrom 		= ["Dropped From:", $("dropped").value];
	localStorage.setItem(storeNumber, JSON.stringify(object));
	window.location.reload();
	alert("Stash Successful!");
}

function pullData () {
	if(localStorage.length === 0){
		alert("There are currently no items in your stash");
	}
	toggle("on");
	var displayDiv = document.createElement("div");
	displayDiv.setAttribute("id", "object");
	var createList = document.createElement("ul");
	displayDiv.appendChild(createList);
	document.body.appendChild(displayDiv);
	$("object").style.display = "block";
	for(var i=0, j=localStorage.length; i<j; i++){
		var createLi = document.createElement("li");
		var linkLi = document.createElement("li");
		createList.appendChild(createLi);
		var storageKey = localStorage.key(i);
		var storageValue = localStorage.getItem(storageKey);
		var listObject = JSON.parse(storageValue);
		var createSubList = document.createElement("ul");
		createLi.appendChild(createSubList);
		for(var n in listObject){
			var createSubLi = document.createElement("li");
			createSubList.appendChild(createSubLi);
			var objSubText = listObject[n][0]+"  "+listObject[n][1];
			createSubLi.innerHTML = objSubText;
			createSubList.appendChild(linkLi);
		}
		updateItemLink(localStorage.key(i), linkLi);  //create edit and delete buttons link for each item in local storage
	}
}

//create the edit and delete links for each stored item when displayed
function updateItemLink(key, linkLi){
	var updateLink = document.createElement("a");
	updateLink.href = "#";
	updateLink.key = key;
	var updateText = "Update Item";
	updateLink.addEventListener("click", updateItem);
	updateLink.innerHTML = updateText;
	linkLi.appendChild(updateLink);
	
	var lineBreak = document.createElement("br");
	linkLi.appendChild(lineBreak);
	
	var removeLink = document.createElement("a");
	removeLink.href = "#";
	removeLink.key = key;
	var removeText = "Remove Item from Stash";
	removeLink.addEventListener("click", removeItem);
	removeLink.innerHTML = removeText;
	linkLi.appendChild(removeLink);
}

function updateItem () {
	var itemValue = localStorage.getItem(this.key);
	//JSON.parse is opposite of JSON.stringify	
	var object = JSON.parse(itemValue);
	
	//Displays the form
	toggle("off");
	
	$("aGroup").value = object.archetype[1];
	$("itemName").value = object.item[1];
	var radioButton = document.forms[0].type;
	for(var i=0; i<radioButton.length; i++){
		if(radioButton[i].value == "weapon" && object.type[1] == "weapon"){
		radioButton[i].setAttribute("checked", "checked");
		}else if(radioButton[i].value == "armor" && object.type[1] == "armor"){
		radioButton[i].setAttribute("checked", "checked");
		}
	}
	$("classification").value = object.classification[1];
	var qualityBox = document.forms[0].quality;
	for(var i=0; i<qualityBox.length; i++){
		if(qualityBox[i].value == "common" && object.quality[1] == "common"){
		qualityBox[i].setAttribute("checked", "checked");
		} else if(qualityBox[i].value == "magical" && object.quality[1] == "magical"){
		qualityBox[i].setAttribute("checked", "checked");
		} else if(qualityBox[i].value == "legendary" && object.quality[1] == "legendary"){
		qualityBox[i].setAttribute("checked", "checked");
		}
	}
	$("sellRange").value = object.sellValue[1];
	$("stashDate").value = object.dateStashed[1];
	$("dropped").value = object.droppedFrom[1];
	
	//remove the listener from Stash It! button
	submit.removeEventListener("click", saveData);
	
	//change submit to edit button
	$("submit").value = "Edit Item";
	var editStash = $("submit");
	editStash.addEventListener("click", validate);  //save the key value as a property of the editStash even to use that data when edited
	editStash.key = this.key;
}

function removeItem(){
	var prompt = confirm("Remove item from stash permanently?");
		if(prompt){
			localStorage.removeItem(this.key);
			window.location.reload();
		} else {
			alert("The item was not removed from stash");
		}
}

function toggle(n){
	switch(n){
		case "on":
			$("itemForm").style.display = "none";
			$("clearData").style.display = "inline";
			$("displayData").style.display = "none";
			$("stashMore").style.display = "inline"
			break;
		case "off":
			$("itemForm").style.display = "block";
			$("clearData").style.display = "inline";
			$("displayData").style.display = "inline";
			$("stashMore").style.display = "none";
			$("object").style.display = "none";
			break;	
		default:
			return false;
	}
}

function validate(event){
	//define the elements 
	var pullArchetype = $("aGroup");
	var pullItem = $("itemName");
	var pullClassification = $("classification");	
	
	//clear error messages
	errorMessage.innerHTML = "";
	pullArchetype.style.border = "1px solid black";
	pullItem.style.border = "1px solid black";
	pullClassification.style.border = "1px solid black";
	
	
	//error message for missing data
	var errorArray = [];
	
	//Validation Conditionals
	if(pullArchetype.value === "--Choose Item Archetype--"){
		var archetypeError = "Please choose a group.";
		pullArchetype.style.border = "1px solid red";
		errorArray.push(archetypeError);
	}
	if(pullItem.value === ""){
		var itemError = "Please enter item name.";
		pullItem.style.border = "1px solid red";
		errorArray.push(itemError);
	}
	if(pullClassification.value === "select"){
		var classificationError = "Please select classification.";
		pullClassification.style.border = "1px solid red";
		errorArray.push(classificationError);
	}
	//If any errors display them
	if(errorArray.length >= 1){
		for(var i=0, j=errorArray.length; i < j; i++){
			var errorTxt = document.createElement("li");
			errorTxt.innerHTML = errorArray[i];
			errorMessage.appendChild(errorTxt);
		}
		event.preventDefault();
		return false;
	} else {
		saveData(this.key); //if no errors save data
	}	
}

function clearItems(){
	if(localStorage.length === 0){
		alert("No items to clear");
	} else {
		localStorage.clear();
		alert("Stash has been cleared");
		window.location.reload();
		return false;
	}
}

function createArchetype(){
	var formArchtype = document.getElementsByTagName(document.forms[0]);
	var	chooseLi = $("archetypeSelect");
	var	createSelect = document.createElement("select");
		createSelect.setAttribute("id", "aGroup");		
	for(var i=0, j=archetype.length; i<j; i++){
		var createOption = document.createElement("option");
		var createText = archetype[i];
		createOption.setAttribute("value", createText);
		createOption.innerHTML = createText;
		createSelect.appendChild(createOption);
	}
	chooseLi.appendChild(createSelect);
}

//Global Variables
var archetype = ["--Choose Item Archetype--", "Warrior", "Rogue", "Mage"];
var errorMessage = $("error");
var typeValue,
	typeQuality
;
createArchetype();


//The Call
var submit = $("submit");
submit.addEventListener("click", validate);
var displayData = $("displayData");
displayData.addEventListener("click", pullData);
var clearData = $("clearData");
clearData.addEventListener("click", clearItems);
});