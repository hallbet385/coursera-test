$(function () { // Same as document.addEventListener("DOMContentLoaded"...

  // Same as document.querySelector("#navbarToggle").addEventListener("blur",...
  $("#navbarToggle").blur(function (event) {
    var screenWidth = window.innerWidth;
    if (screenWidth < 768) {
      $("#collapsable-nav").collapse('hide');
    }
  });
});

(function (global) {

var dc = {};

var homeHtmlUrl = "snippets/home-snippet.html";
var allCategoriesUrl =
  "https://coursera-jhu-default-rtdb.firebaseio.com/categories.json";
var categoriesTitleHtml = "snippets/categories-title-snippet.html";
var categoryHtml = "snippets/category-snippet.html";
var menuItemsUrl =
  "https://coursera-jhu-default-rtdb.firebaseio.com/menu_items/";
var menuItemsTitleHtml = "snippets/menu-items-title.html";
var menuItemHtml = "snippets/menu-item.html";

// Convenience function for inserting innerHTML for 'select'
//grab that element, the target element, and set its inner HTML, 
//to whatever the HTML string is that you sent to this function
var insertHtml = function (selector, html) {
  var targetElem = document.querySelector(selector);
  targetElem.innerHTML = html; 
};

// Show loading icon inside element identified by 'selector'.
var showLoading = function (selector) {
  var html = "<div class='text-center'>";
  html += "<img src='images/ajax-loader.gif'></div>";
  insertHtml(selector, html);
}; 

// Return substitute of '{{propName}}'
// with propValue in given 'string'
var insertProperty = function (string, propName, propValue) {
  var propToReplace = "{{" + propName + "}}";
  string = string
    .replace(new RegExp(propToReplace, "g"), propValue);
  return string;
};

// Remove the class 'active' from home and switch to Menu button
var switchMenuToActive = function () {
  // Remove 'active' from home button
  var classes = document.querySelector("#navHomeButton").className;
  classes = classes.replace(new RegExp("active", "g"), "");
  document.querySelector("#navHomeButton").className = classes;

  // Add 'active' to menu button if not already there
  classes = document.querySelector("#navMenuButton").className;
  if (classes.indexOf("active") === -1) {
    classes += " active";
    document.querySelector("#navMenuButton").className = classes;
  }
};

// On page load (before images or CSS) do this
document.addEventListener("DOMContentLoaded", function (event) {

// TODO: STEP 0: Look over the code from
// *** start ***
// to
// *** finish ***
// below.
// We changed this code to retrieve all categories from the server instead of
// simply requesting home HTML snippet. We now also have another function
// called buildAndShowHomeHTML that will receive all the categories from the server
// and process them: choose random category, retrieve home HTML snippet, insert that
// random category into the home HTML snippet, and then insert that snippet into our
// main page (index.html).
//
// TODO: STEP 1: Substitute [...] below with the *value* of the function buildAndShowHomeHTML,
// so it can be called when server responds with the categories data.

// *** start ***
// On first load, show home view (home page of site)
showLoading("#main-content");
$ajaxUtils.sendGetRequest(
  allCategoriesUrl,
  buildAndShowHomeHTML,  // ***** <---- TODO: STEP 1: Substitute [...] ******
  true); // Explicitly setting the flag to get JSON from server processed into an object literal
});
// *** finish **


// Builds HTML for the home page based on categories array
// returned from the server.
function buildAndShowHomeHTML (categories) {

  // Load home snippet page
  $ajaxUtils.sendGetRequest(
    homeHtmlUrl,
    function (homeHtml) {

      // TODO: STEP 2: Here, call chooseRandomCategory, passing it retrieved 'categories'
      // Pay attention to what type of data that function returns vs what the chosenCategoryShortName
      // variable's name implies it expects.
      var chosenCategoryShortName = 
		chooseRandomCategory (categories); 

      // TODO: STEP 3: Substitute {{randomCategoryShortName}} in the home html snippet with the
      // chosen category from STEP 2. Use existing insertProperty function for that purpose.
      // Look through this code for an example of how to do use the insertProperty function.
      // WARNING! You are inserting something that will have to result in a valid Javascript
      // syntax because the substitution of {{randomCategoryShortName}} becomes an argument
      // being passed into the $dc.loadMenuItems function. Think about what that argument needs
      // to look like. For example, a valid call would look something like this:
      // $dc.loadMenuItems('L')
      // Hint: you need to surround the chosen category short name with something before inserting
      // it into the home html snippet.
      //
	 
      var homeHtmlToInsertIntoMainPage = homeHtmlUrl;  
	  //var randomCategoryShortName = chosenCategoryShortName.name;
	  homeHtmlToInsertIntoMainPage = 
		insertProperty(homeHtmlToInsertIntoMainPage, "randomCategoryShortName", chosenCategoryShortName.short_name);

      // TODO: STEP 4: Insert the produced HTML in STEP 3 into the main page
      // Use the existing insertHtml function for that purpose. Look through this code for an example
      // of how to do that.
      // ....
	  
	  insertHtml("#main-content", homeHtmlToInsertIntoMainPage);

    },
    false); // False here because we are getting just regular HTML from the server, so no need to process JSON.
	
	console.log(homeHtmlToInsertIntoMainPage);
}


// Given array of category objects, returns a random category object.
function chooseRandomCategory (categories) {
  // Choose a random index into the array (from 0 inclusively until array length (exclusively))
  var randomArrayIndex = Math.floor(Math.random() * categories.length);

  // return category object with that randomArrayIndex
  return categories[randomArrayIndex];
}


// Load the menu categories view
//We are using our allCategoriesUrl defined above, that's the URL to firebaseio where the menu categories
//are stored. Then we're passing buildAndShowCategoriesHTML, which is a value of a function that is
//defined below. And since we don't really need ‘true’ after buildAndShowCategoriesHTML, it is
//default, we are going to leave it off, which means that this function, buildAndShowCategoriesHTML, 
//will get categories, (whatever the first argument in the function defined below which is categories
//(what is defined in parenthesis where the function is declared), is going to be an object that is
//converted from the JSON string. It's going to be a full blown object. 
//So once this Ajax call is done in loadMenuCategories and the buildAndShowCategoriesHTML
//function is called, we end up inside the buildAndShowCategoriesHTML function.

dc.loadMenuCategories = function () {
  showLoading("#main-content");
  $ajaxUtils.sendGetRequest(
    allCategoriesUrl,
    buildAndShowCategoriesHTML);
};


// Load the menu items view. Based on the categoryShort that was clicked on.
// Indivitual page of menu items once a category is clicked from the Menu Categories page
// (ie. Lunch, Soup, Appetizers etc.) 
// 'categoryShort' is a short_name for a category (ie. Lunch, Soup, Appetizers etc.) 
// 'categoryShort'is what got passed into us when the user clicked on the particular Menu Category
// short_name is referrenced in category-snippet.html
//It is the property which we use to get at the data for a particular category
// menuItemUrl + categoryShort + ".json" = the URL the Ajax Request to
// buildAndShowMenuItemsHTML - this function processes the results of the
// ajax request just above it. It processes the data we get back from the ajax request
dc.loadMenuItems = function (categoryShort) {
  showLoading("#main-content");
  $ajaxUtils.sendGetRequest(
    menuItemsUrl + categoryShort + ".json",
    buildAndShowMenuItemsHTML);
};


// Builds HTML for the categories page based on the data
// from the server
// buildCategoriesViewHtml function builds each individual category on the categories page
function buildAndShowCategoriesHTML (categories) {
  // Load title snippet of categories page
  $ajaxUtils.sendGetRequest(
    categoriesTitleHtml,  
    function (categoriesTitleHtml) {
      // Retrieve single category snippet
      $ajaxUtils.sendGetRequest(
        categoryHtml,
        function (categoryHtml) {
          // Switch CSS class active to menu button
          switchMenuToActive();

          var categoriesViewHtml =
            buildCategoriesViewHtml(categories,
                                    categoriesTitleHtml,
                                    categoryHtml);
          insertHtml("#main-content", categoriesViewHtml);
        },
        false); // do not process the html snippet as json
    },
    false);  // do not process the html snippet as json
}


// Using categories data and snippets html
// build categoriesViewHTML variable in above function 
// to be inserted into the main categories page
// finalHtml is the value that is returned - it is the variable categoriesTitleHtml
// defined at the beginning of the self called function above (categories-title-snippet.html)
// plus categoryHtml(category-snippet.html)
// this function creates the html for the Menu Categories page that loads when you click the
// menu box on the homepage 
function buildCategoriesViewHtml(categories,
                                 categoriesTitleHtml,
                                 categoryHtml) {


  //inserts a section with a class row  
  var finalHtml = categoriesTitleHtml;
  finalHtml += "<section class='row'>";

  // Loop over categories object
  //then we're looping over our categories object and every time we pull out 
  //the name, the short name, and all we're doing then is calling insertProperty(). 
  for (var i = 0; i < categories.length; i++) {
    // Insert category values
    var html = categoryHtml;
    var name = "" + categories[i].name;
    var short_name = categories[i].short_name;
    html =
      insertProperty(html, "name", name);
    html =
      insertProperty(html,
                     "short_name",
                     short_name);
    finalHtml += html;
  }

  finalHtml += "</section>";
  return finalHtml;
  // it then pops back up to buildAndShowCategoriesHTML function and is stored in the 
  // variable defined categoriesViewHtml. It is then inserted into the div on the homepage
  // that has the #main-content id 
}



// Builds HTML for the single category page (ie. Lunch, Soup, Appetizers etc.) 
// based on the data from the server

// categoryMenuItems is an object thats going to get returned because our json is going to get processed
// then we have a double Ajax request that is similar to buildAndShowCategoriesHTML function above
// First we get the menuItemsTitleHtml (menu-items-title.html snippet)
// Then we get the menuItemHtml (menu-item.html snippet, this is a single menu item within the caategory that was clicked)
// Then we call the buildMenuItemsViewHtml function. What is returned from that function is stored in the menuItemsViewHtml variable
// buildMenuItemsViewHtml function builds the html for each individual menu item within the clicked category placing it on the single category page
// we pass the buildMenuItemsViewHtml function a categoryMenuItems object. As well as the html snippet for the title (menuItemsTitleHtml) and
// the html snippet for the one single menu item (menuItemHtml) 
// Once  buildMenuItemsViewHtml function is complete and returns the final html for the individual menu items we use insertHtml to place the items 
// into the #main-content element on the Menu Items page.
function buildAndShowMenuItemsHTML (categoryMenuItems) {
  // Load title snippet of menu items page
  $ajaxUtils.sendGetRequest(
    menuItemsTitleHtml,
    function (menuItemsTitleHtml) {
      // Retrieve single menu item snippet
      $ajaxUtils.sendGetRequest(
        menuItemHtml,
        function (menuItemHtml) {
          // Switch CSS class active to menu button
          switchMenuToActive();

          var menuItemsViewHtml =
            buildMenuItemsViewHtml(categoryMenuItems,
                                   menuItemsTitleHtml,
                                   menuItemHtml);
          insertHtml("#main-content", menuItemsViewHtml);
        },
        false);
    },
    false);
}


// Using category and menu items data and snippets html
// build individual menu items HTML to be inserted 
// into the Menu Items page for a particular category

//Unlike the previously similar function, buildCategoriesViewHtml,
//we actually need to insert some values inside of the title of the individual items page. 
//So, in this case, it's going to be ‘name’ and ‘special_instructions’. 
//‘name’ and ‘special_instructions’ come from the categoryMenuItems object.
//That's that object that was returned for us from the server as our JSON that 
//was converted into an object, .category, that's our property, .name. 
//Same thing in the second menuItemsTitleHtml = statement – 
//categoryMenuItems.category.special_instructions. 
//Once we insert those two things into the manuItemsTitleHtml, it is ready to be used for our final HTML.  
//So that's why we're starting this final HTML (that is returned by this function, that is then inserted into the 
// element on the single items page with an id of "#main-content") with this particular variable (finalHtml)
//that's already kind of pre-inserted with the values of our object. 


function buildMenuItemsViewHtml(categoryMenuItems,
                                menuItemsTitleHtml,
                                menuItemHtml) {

  menuItemsTitleHtml =
    insertProperty(menuItemsTitleHtml,
                   "name",
                   categoryMenuItems.category.name);
  menuItemsTitleHtml =
    insertProperty(menuItemsTitleHtml,
                   "special_instructions",
                   categoryMenuItems.category.special_instructions);

  var finalHtml = menuItemsTitleHtml;
  //inserts a section with a class row  
  finalHtml += "<section class='row'>";

  // Loop over menu items
  var menuItems = categoryMenuItems.menu_items;
  var catShortName = categoryMenuItems.category.short_name;
  for (var i = 0; i < menuItems.length; i++) {
    // Insert menu item values
    var html = menuItemHtml;
    html =
      insertProperty(html, "short_name", menuItems[i].short_name);
    html =
      insertProperty(html,
                     "catShortName",
                     catShortName);
    html =
      insertItemPrice(html,
                      "price_small",
                      menuItems[i].price_small);
    html =
      insertItemPortionName(html,
                            "small_portion_name",
                            menuItems[i].small_portion_name);
    html =
      insertItemPrice(html,
                      "price_large",
                      menuItems[i].price_large);
    html =
      insertItemPortionName(html,
                            "large_portion_name",
                            menuItems[i].large_portion_name);
    html =
      insertProperty(html,
                     "name",
                     menuItems[i].name);
    html =
      insertProperty(html,
                     "description",
                     menuItems[i].description);

    // Add clearfix after every second menu item
    if (i % 2 !== 0) {
      html +=
        "<div class='clearfix visible-lg-block visible-md-block'></div>";
    }

    finalHtml += html;
  }

  finalHtml += "</section>";
  return finalHtml;
}


// Appends price with '$' if price exists
function insertItemPrice(html,
                         pricePropName,
                         priceValue) {
  // If not specified, replace with empty string
  if (!priceValue) {
    return insertProperty(html, pricePropName, "");
  }

  priceValue = "$" + priceValue.toFixed(2);
  html = insertProperty(html, pricePropName, priceValue);
  return html;
}


// Appends portion name in parens if it exists
function insertItemPortionName(html,
                               portionPropName,
                               portionValue) {
  // If not specified, return original string
  if (!portionValue) {
    return insertProperty(html, portionPropName, "");
  }

  portionValue = "(" + portionValue + ")";
  html = insertProperty(html, portionPropName, portionValue);
  return html;
}


global.$dc = dc;

})(window);
