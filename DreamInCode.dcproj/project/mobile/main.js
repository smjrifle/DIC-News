/* 
 This file was generated by Dashcode.  
 You may edit this file to customize your widget or web page 
 according to the license.txt file included in the project.
 */

var topStories = parseInt(attributes.topStories, 10);       // The number of stories featured in the top section

//
// Function: load()
// Called by HTML body element's onload event when the web application is ready to start
//
function load()
{
    dashcode.setupParts();
    
    // set today's date
    var todaysDate = document.getElementById("todaysDate");
    todaysDate.innerText = createDateStr(new Date()).toUpperCase(); 
    
    setupFilters("headlineList");
    
    // This message checks for common errors with the RSS feed or setup.
    // The handler will hide the split view and display the error message.
    handleCommonErrors(attributes.dataSource,function(errorMessage){
        var stackLayout = document.getElementById("StackLayout")
        
        if (stackLayout) {
            stackLayout.style.display = 'none';
        }
        
        showError(errorMessage);
    });
    
    // get notifications from the stack layout when the transition ends
    document.getElementById("StackLayout").object.endTransitionCallback = function(stackLayout, oldView, newView){
        // clear selection of lists when navigating to the first view
        var firstView = stackLayout.getAllViews()[0];
        if (newView == firstView) {
            document.getElementById("headlineList").object.clearSelection(true);
        }

    }
   
}

function articleClicked(event)
{
    document.getElementById("StackLayout").object.setCurrentView("articlePage", false, true);
}

function backToArticlesClicked(event)
{
    document.getElementById("StackLayout").object.setCurrentView("frontPage", true);
}

function readMoreClicked(event)
{
    var headlineList = dashcode.getDataSource('headlineList');
    var secondHeadlines = dashcode.getDataSource("secondHeadlines");
    var selectedItem = null;
    
    if (headlineList.hasSelection()) {
        selectedItem = headlineList.selectedObjects()[0];
    } else if (secondHeadlines.hasSelection()){
        selectedItem = secondHeadlines.selectedObjects()[0];
    }
    
    if (selectedItem) {
        var link = selectedItem.valueForKeyPath('link');
    
        // If the link is an object, not a string, then this may be an ATOM feed, grab the actual
        // href from the href attr
        if (typeof(link) == 'object') {
            link = selectedItem.valueForKeyPath('link.$href');
            
            // If the link is an array (there is more then one link), just grab the first one
            if (DC.typeOf(link) == 'array'){
                link = link[0];
            }
        }
        
        // window.location = link;
        var views = document.getElementById('stackLayout');
        var settings = document.getElementById('webPage');
        
        if(views && views.object && settings) {
            views.object.setCurrentView(settings);
        }
    }
    
}

var headlineListDataSource = {
		
	// The List calls this method once for every row.
	prepareRow: function(rowElement, rowIndex, templateElements) {
		if (rowIndex >= topStories) {
            templateElements['headlineDescription'].style.display = 'none';
            templateElements['headlineTitle'].style.fontSize = '15px';
		}
	}
};