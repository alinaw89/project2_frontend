// PATH FOR HEROKU
var baseURL = function() {
  // return "http://localhost:3000";
  return "https://fathomless-lowlands-1030.herokuapp.com";
};



$(document).ready(function() {

  toggle();

  // CLICK FUNCTION ON BUTTONS TO HIDE/SHOW CONTENT
  $("#register-user").on('click', function() {
    $(".content").hide();
    $("#new-user").show();
  });

  $("#user-login").on('click', function() {
    $(".content").hide();
    $("#login").show();
  });

  $("#display-cosmetic").on('click', function() {
    $(".content").hide();
    $("#new-product").show();
  });

  $("#logout").on('click', function() {
    $(".content").hide();
  });

  $("#about-compact").on('click', function() {
    $("aboutapp").show();
  })


  // SHOW ALL COSMETIC PRODUCTS BY CATEGORY
  $("#display-cosmetic-bag").on('click', function(event) {
    //gives the id of the category that was clicked on
    var categoryID = event.target.dataset.categoryId;

    $.ajax({
      url: baseURL() + '/categories/' + categoryID,
      // sends HTTP GET request
      method: 'GET',
      dataType: 'json',
      // you send the header back so your back end knows who it is; when you log in you get the token, and when you do other options you pass the token back...so it checks if that token is the same as the token saved
      //simplestorage stores the token, more secure than storing in a div
      headers: {
        Authorization: 'Token token=' + simpleStorage.get('token')
      }
    }).done(function(category_data) {
      $(".content").hide();
      $("#cosmetic_products").show();
      $("#cosmetic_products").html('');
      //for each category, pass in cosmetic product param, it'll append to the cosmetic product list with all of the cosmetic product names in that category
      category_data.forEach(function(cosmetic_product) {
        $("#cosmetic_products").append("<li id='" + cosmetic_product.id + "'>" + cosmetic_product.name + "</li>");
      });
    });
  });



  // SHOW ALL COSMETIC PRODUCTS
  var showAllProducts = function() {
    $.ajax({
      method: 'GET',
      url: baseURL() + "/cosmetic_products",
      headers: {
        Authorization: 'Token token=' + simpleStorage.get('token')
      }
    }).done(function(cosmetic_product_data) {
      console.log(cosmetic_product_data);
      $(".content").hide();
      $("#cosmetic_products").html('');
      //pass in cosmetic product param, it'll append each cosmetic product to a list with all of the cosmetic products names
      cosmetic_product_data.forEach(function(cosmetic_product) {
        $("#cosmetic_products").append("<li id='" + cosmetic_product.id + "'>" + cosmetic_product.name + "</li>");
      });
      $("#cosmetic_products").show();
    }).fail(function() {
      alert("fail to get products");
    });
  };


  //  CLICK FUNCTION TO SHOW ALL COSMETIC PRODUCTS
  $('#show-all-products').on('click', showAllProducts);



  // RENDERING COSMETIC ITEM
  $("#cosmetic_products").on("click", function(event) {
    $.ajax({
      method: 'GET',
      //specific cosmetic_product id that was clicked
      url: baseURL() + "/cosmetic_products/" + event.target.id,
      headers: {
        Authorization: 'Token token=' + simpleStorage.get('token')
      }
    }).done(function(cosmetic_product_data) {
      console.log(cosmetic_product_data);
      var html = "<dl> <dt>Name</dt><dd>" + cosmetic_product_data.name + "<dt>Brand</dt><dd>" + cosmetic_product_data.brand + "<dt>Color</dt><dd>" + cosmetic_product_data.color + "<dt>Price</dt><dd>" + cosmetic_product_data.price + "<dt>Purchase Date</dt><dd>" + cosmetic_product_data.purchase_date + "<dt>Category</dt><dd>" + cosmetic_product_data.category_name + "<dt>Image</dt><dd>" + '<img src="' + cosmetic_product_data.photo + '"/>' + '</br>' + '<button id="editprod">Edit</button>' + " " + '<button id="deleteprod" data-product-id="' + cosmetic_product_data.id + '">Delete</button>';
      $("#cosmetic_product").html("");
      $("#cosmetic_product").append(html);
      wrapCosmetic();
    }).fail(function() {
      alert("Failed to load products");
    });
  });


  // DELETING COSMETIC ITEM
  var wrapCosmetic = function() {
    $("#deleteprod").on('click', function(event) {
      //confirms with the user
      var answer = confirm("Are you sure?");
      // if true
      if (answer) {
        $.ajax({
          method: 'DELETE',
          //passes in the product id that was clicked to be deleted
          url: baseURL() + "/cosmetic_products/" + $('#deleteprod').data('product-id'),
          headers: {
            Authorization: 'Token token=' + simpleStorage.get('token')
          }
        }).done(function(cosmetic_product_data) {
          $("#cosmetic_product").html('');
          // automatically updates the cosmetic products list without deleted item
          showAllProducts();
          console.log("Product successfully deleted");
        });
      } else {
        console.log("Will not delete product");
      };
    });
  };



  // CREATING NEW COSMETIC ITEM
  $("#new-prod-button").on("click", function(event) {
    //using form data object for image file upload
    var fd = new FormData();
    // each input area that was filled out
    fd.append('name', $("#new-prod-name").val());
    fd.append('brand', $("#new-prod-brand").val());
    fd.append('color', $("#new-prod-color").val());
    fd.append('price', parseFloat($("#new-prod-price").val()));
    fd.append('purchase_date', $("#new-prod-date").val());
    fd.append('category_id', $("#new-prod-cat").val());
    fd.append('image', $("#new-prod-image")[0].files[0]);

    $.ajax({
      type: 'POST',
      url: baseURL() + "/cosmetic_products",
      processData: false,
      contentType: false,
      cache: false,
      data: fd,
      headers: {
        Authorization: 'Token token=' + simpleStorage.get('token')
      }
    }).done(function() {
      //renders new product to html
      $("#new-product").html("Product saved to cosmetic bag")
      console.log("Created new product");
    }).fail(function() {
      console.log("Failed to create product");
    });
  });


  // NEW USER BUTTON
  $("#new-user-button").on("click", function(event) {
    var newUser = {
      name: $("#new-user-name").val(),
      email: $("#new-user-email").val(),
      password: $("#new-user-pw").val(),
      password_confirmation: $("#new-user-confirm-pw").val()
    };
    $.ajax({
      type: 'POST',
      url: baseURL() + '/register',
      data: {
        credentials: newUser
      }
    }).done(function(response) {
      //hides new user div
      $("#new-user").hide();
      console.log("Your account has been created!")
    }).fail(function(error) {
      console.log("Error in creating new user " + error);
    });
  });


  // LOGIN BUTTON
  $("#login-button").on("click", function() {
    var email = $("#login-user-email").val();
    var password = $("#login-user-pw").val();
    var params = {
      credentials: {
        email: email,
        password: password
      }
    };
    $.ajax({
      type: 'POST',
      url: baseURL() + '/login',
      dataType: "json",
      data: params
    }).done(function(data) {
      //login div hidden
      $("#login").hide();
      //renders welcome message
      renderUserGreeting(data);
      // setting token to a non-empty string (correct value)
      //simple storage to store data locally (token)
      // lets the user be logged in for 12 hrs? and after that, the session is closed
      simpleStorage.set('token', data.token, {
        TTL: 43200000
      });
      //when user logs in, certain divs shown/hidden
      toggle();
      //sets dropdown button for categories
      getCategories();
      console.log("Successful login!");
    }).fail(function(error) {
      console.log("Error in login " + error);
    });
  });



  // LOGOUT BUTTON
  $("#logout").on("click", function() {
    $.ajax({
      method: 'DELETE',
      url: baseURL() + "/logout",
      headers: {
        Authorization: 'Token token=' + simpleStorage.get('token')
      }
    }).done(function() {
      console.log("logged out");
    }).fail(function() {
      alert("Error in logging out");
    }).always(function() {
      simpleStorage.set('token', '');
      toggle();
    });
  });



  // USER GREETING
  var renderUserGreeting = function(data) {
    $("#userDiv").html("Welcome, " + data.name);
  };

});


//sets drop down button for categories
var getCategories = function() {
  $.ajax({
    method: 'GET',
    url: baseURL() + "/categories",
    headers: {
      Authorization: 'Token token=' + simpleStorage.get('token')
    }
  }).done(function(category_data) {
    console.log(category_data);
    //for each category, takes name and appends to new prod category  select list
    category_data.forEach(function(category) {
      var html = "<option value='" + category.id + "'> " + category.name + "</option>";
      $('#new-prod-cat').append(html);
    });
  }).fail(function() {
    alert("Failed getting cosmetic categories");
  });
};

// FUNCTION THAT CHECKS TO SEE IF TOKEN IS PRESENT, TO SHOW THINGS, HIDE THINGS
var toggle = function() {
  if (simpleStorage.get('token')) {
    $("#display-cosmetic").show();
    $("#show-all-products").show();
    $("#logout").show();
    $("#user-login").hide();
    $("#userDiv").show();
    $("#aboutapp").hide();
    $("#cosmetic_product").show();
    $("#cosmetic_products").show();
  } else {
    $("#display-cosmetic").hide();
    $("#show-all-products").hide();
    $("#logout").hide();
    $("#user-login").show();
    $("#userDiv").hide();
    $("#aboutapp").show();
    $("#cosmetic_product").hide();
    $("#cosmetic_products").hide();
    $("#cosbag").hide();
  }
};









// curl -X POST -d "cosmetic_product[name]=lipstick 2&cosmetic_product[brand]=nars&cosmetic_product[color]=black&cosmetic_product[price]=20" http://localhost:3000/cosmetic_products
