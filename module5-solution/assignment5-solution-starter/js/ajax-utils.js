(function (global) {

// Set up a namespace for our utility
var ajaxUtils = {};


// Returns an HTTP request object
function getRequestObject() {
  if (window.XMLHttpRequest) {
    return (new XMLHttpRequest());
  } 
  else if (window.ActiveXObject) {
    // For very old IE browsers (optional)
    return (new ActiveXObject("Microsoft.XMLHTTP"));
  } 
  else {
    global.alert("Ajax is not supported!");
    return(null); 
  }
}


// Makes an Ajax GET request to the 'requestUrl'
//requestURL, where to go to make the get request
//responseHandler is a function that handles the result of what the server returns.
//the user of this library passes a function to sendGetRequest when they invoke it
ajaxUtils.sendGetRequest = 
  function(requestUrl, responseHandler, isJsonResponse) {
    var request = getRequestObject();
    request.onreadystatechange = 
      function() { 
        handleResponse(request, 
                       responseHandler,
                       isJsonResponse); 
      }; // onreadystatechange - we are passing this a function expression. The function is not actually 
	     // being executed. We are just passing the value of this function.
		 // Not the return value, but just the value of the function object, and we're 
		 // setting it to this property onreadystatechange. And inside of that,
		 // we're calling handleResponse, and this is what is going to be executed, 
		 // since you can see the parenthesis around it. 
    request.open("GET", requestUrl, true);
    request.send(null); // for POST only
  };


// Only calls user provided 'responseHandler'
// function if response is ready
// and not an error
// request is the original request object that was created under sendGetRequest
// responseHandler is a function that the user passed/provided this function 
// this function pulls the response from the server from the request object
function handleResponse(request,
                        responseHandler,
                        isJsonResponse) {
  if ((request.readyState == 4) &&
     (request.status == 200)) {

    // Default to isJsonResponse = true
    if (isJsonResponse == undefined) {
      isJsonResponse = true;
    }

    if (isJsonResponse) {
      responseHandler(JSON.parse(request.responseText));
    }
    else {
      responseHandler(request.responseText);
    }
  }
}


// Expose utility to the global object so we can actually use it
global.$ajaxUtils = ajaxUtils;


})(window);

