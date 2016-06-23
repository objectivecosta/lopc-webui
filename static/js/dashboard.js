$(document).ready(function () {
  console.log("Document is ready!");

  var authenticationData = Cookies.get("authenticationData");
  if (!authenticationData || authenticationData.indexOf("%***&&&***%") == -1) {
    window.location = "/";
  }

});

function logout() {
  Cookies.remove('authenticationData');
  window.location = "/";
}

function refreshQueryAudience() {
  var authenticationData = Cookies.get("authenticationData");
  var data = authenticationData.split("%***&&&***%");
  var username = data[0];
  var password = data[1];
  var instance = data[2];

  var query = {};

  $('.queryForm').children('.row').each(function () {
    console.log('NCH: ' + $(this).children().length);
    var field = $(this).find('#queryField').first().val();
    var value = $(this).find('#queryValue').first().val();
    console.log(field + ":" + value);
    query[field] = value;
  });

  console.log("Query: " + JSON.stringify({query: query}));

  $.ajax({
    url: "http://" + instance + "/device/query",
    type: 'post',
    data: JSON.stringify({query: query}),
    headers: {},
    contentType: "application/json",
    dataType: 'json',
    success: function (data) {
      console.log("Data: " + JSON.stringify(data));
      $(".expectedAudience").html("Expected audience size: " + data.length);
    },
    error: function (request, statusCode, error) {
      console.log("req: " + JSON.stringify(request));
      console.log("statusCode: " + statusCode);
      console.log("error: " + error);
    }
  });

}
