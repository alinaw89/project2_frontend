// test run

$(document).ready(function(){

  $.ajax({
    method: 'GET',
    url: "http://localhost:3000/cosmetic_products"
  }).done(function(cosmetic_product_data){
    console.log(cosmetic_product_data);
  });
});



// $('#new-prod-button').click(function(){
//   var cosmetic_product = {
//   name: $("#new-prod-name").val(),
//   brand: $("#new-prod-brand").val(),
//   color: $("#new-prod-color").val(),
//   price: parseFloat($("#new-prod-price").val()),
//   purchase_date: $("#new-prod-date").val(),
//   category: $("#new-prod-cat").val()};
//   // image: $("new-prod-image").val()};

//   $.ajax({
//     type: 'POST',
//     url: "http://localhost:3000/cosmetic_products",
//     data: {cosmetic_product: cosmetic_product}
//     }).done(function(){
//     alert ("success");
//     }).fail(function(){
//     alert ("failure");
//   });

// });

