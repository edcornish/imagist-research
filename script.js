let n = 0;
let p = 0;
let l = 0;
const studioIndex = []
var publicSpreadsheetUrl = 'https://docs.google.com/spreadsheets/d/1uz_1Nra_8QGY82iApIgauvy4YYBBOcM9zjKDfXsrgKw/edit?usp=sharing';
const pageNumber = document.querySelector(".pageNumber")
const studio = document.querySelector(".studio")
const route = document.querySelector(".route")
const description = document.querySelector(".description")
const frame = document.querySelector(".frame")
const mobileButton = document.querySelector(".mobileButton")
const navbar = document.querySelector(".navBar")
const dots = document.querySelectorAll(".dot")
const browserWindow = document.querySelector(".browserWindow")
const index = document.querySelector(".index")
const indexContainer = document.querySelector(".indexContainer")
const header = document.querySelector(".header")
const thumbnail = document.querySelector(".thumbnail")
const breaker = document.querySelector(".breaker")
const breakerText = document.querySelector(".breakerText")
const buttonText = ["Mobile" , "Desktop"]
const hideIndexText = ["Index" , "Hide"]
const mobileViewToggle = function(){frame.classList.toggle('mobileView')}
const phoneToggle = function(){navbar.classList.toggle('mobilePhone')}
const browserToggle = function(){browserWindow.classList.toggle('browserHide')}
const headerToggle = function(){header.classList.toggle('browserHide')}


// Switch between mobile and desktop view when the button in the coner is pressed
function changeClass(){
	
	// These two toggle the class for the iFrame and the fake browser bar
	mobileViewToggle()
	phoneToggle()
	
	// This toggles between 'Mobile' and 'Desktop' in the button
	if (p > 0) {
		p = 0
	} else {
		p++
	}

	//  This changes the text in the button
	mobileButton.innerHTML = buttonText[p]
}

// This adds an eventListener to the mobile button so the code knows to run the changeClass function everytime it's clicked
window.onload = function(){
	document.querySelector(".mobileButton").addEventListener( 'click', changeClass)
}


// This is to access the Google Sheet
function init() {
	Tabletop.init( { key: publicSpreadsheetUrl,
		callback: showInfo,
		simpleSheet: true } )
}


function showInfo(data, tabletop) {

	// This is to create the page numbers in the top-right
	const outOf = ' / '+data.length

	
	// This extracts all the studio names from the spreadsheet to create an index of links
	indexMaker = function() {
		for (x = 0; x<data.length; x++) {

			studioIndex.push(data[x].studioName)
			var a = document.createElement("a")
			var linkText = document.createTextNode(data[x].studioName);
			a.classList.add('indexLink')
			a.appendChild(linkText);
			a.href = data[x].websiteAddress;
			a.target = "_blank"
			indexContainer.appendChild(a);
		}	
	}
	indexMaker()

	const indexIndexer = document.querySelectorAll(".indexLink")


	// This is a function to change all the content on the page based on the contents of the Google Sheet.
	// It is used several times throughout the code
	const updateAll = function() {
		indexIndexer.forEach((indexIndexer,index) => {
			indexIndexer.classList.remove("red")
		})
		const indexHighlightAdd = function(){indexIndexer[n].classList.add('red')}
		pageNumber.innerHTML = n+1 + outOf
		route.innerHTML = data[n].route
		studio.innerHTML = data[n].studioName
		description.innerHTML = data[n].description
		frame.setAttribute("src", data[n].websiteAddress)
		indexHighlightAdd()

		// Hide the browser window on breaker pages
		if(data[n].previewImage==="HIDE"){
			browserWindow.classList.add('browserHide')
			breakerText.innerHTML="<span class='caps'>"+data[n].route+"</span><br>"+data[n].description
			breaker.classList.remove('browserHide')
			document.querySelector('.header').classList.add('transparent')}
		else
			{browserWindow.classList.remove('browserHide')
			breaker.classList.add('browserHide')
			document.querySelector('.header').classList.remove('transparent')}

		// Add static images to pages that can't be previewed with an iFrame
		if(data[n].noPreview==="noPreview"){
			document.querySelector(".placeholder").style.backgroundImage="url("+data[n].screengrab+")"
			document.querySelector(".placeholder").classList.remove("browserHide")
		}else{
			document.querySelector(".placeholder").style.backgroundImage="none"
			document.querySelector(".placeholder").classList.add("browserHide")
		}

	}

	// This runs updateAll function so the page updates on load
	updateAll()


	// This function allows navigation by left and right keyboard keys
	document.addEventListener("keydown", function(event) {

		const key = event.key;

		switch (key) {

			case "ArrowLeft":
			n--
			break;

			case "ArrowRight":
			n++
			break;
		}

	  // This creates a loop so the user can scroll through the entire dataset
	  if (n < 0) {
	  	n = data.length-1
	  }

	  if (n > data.length-1) {
	  	n = 0
	  }

	  updateAll()
	});

	// All this code is to navigate by clicking the divs to the left and right of teh screen
	const nPlus = function(){
		
		n++
		if (n > data.length-1) {
			n = 0
		}
		updateAll()
	}

	const nMinus = function(){
		
		n--
		if (n < 0) {
			n = data.length-1
		}
		updateAll()
	}

	// This creates the highlight on the index page
	const hider = function(){
		browserToggle()
		mobileButton.classList.toggle('browserHide')
		headerToggle()
		document.querySelector('body').classList.toggle('blackBackground')
		document.querySelector(".indexButton").classList.toggle('fullOpacity')
		document.querySelector(".indexContainer").classList.toggle('fullOpacity2')

		if (l > 0) {
			l = 0
		} else {
			l++
		}

		document.querySelector(".indexButton").innerHTML = hideIndexText[l]
	}

	// This adds event listeners to the divs so they can record the clicks
	buttonAdder = function(){
		document.querySelector(".right").addEventListener("click", nPlus)
		document.querySelector(".left").addEventListener("click", nMinus)
		document.querySelector(".indexButton").addEventListener("click", hider)
	}
	buttonAdder()

	// This creates the image hover-states on the index
	const indexLinks = document.querySelectorAll('.indexLink')
		indexLinks.forEach((indexLinks,index) => {
		const img = document.querySelector(".thumbnail")
		const thumbnailUpdate = function(){
			// img.src=data[index].previewImage
			img.style.backgroundImage = "url("+data[index].previewImage+")"
			document.querySelector(".thumbnail").classList.add('fullOpacity2')
		}

		const thumbnailOff = function() {
			document.querySelector(".thumbnail").classList.remove('fullOpacity2')	
		}

		// Mouse over / mouse leave for the hover-states
		indexLinks.addEventListener("mouseenter", thumbnailUpdate)
		indexLinks.addEventListener("mouseleave", thumbnailOff)
	})


}

window.addEventListener('DOMContentLoaded', init)

