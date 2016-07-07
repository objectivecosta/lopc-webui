'use strict';
var pushEstimatedAudience = -1;
$(document).ready(function () {
  console.log("Document is ready!");

  var authenticationData = Cookies.get("authenticationData");
  if (!authenticationData || authenticationData.indexOf("%***&&&***%") == -1) {
    window.location.href = "/";
  }

  var authenticationData = Cookies.get("authenticationData");
  var data = authenticationData.split("%***&&&***%");
  var username = data[0];
  var password = data[1];
  var instance = data[2];

  $.ajax({
    url: "https://" + instance + "/app?username=" + username,
    type: 'get',
    headers: {'x-authorization-type' : 'user'},
    contentType: "application/json",
    dataType: 'json',
    success: function (data) {
      var appList = data;
      for (var app of appList) {
        $('#appsDropdown').append(`<li><a data-appid='${app.appId}' onclick='selectApp(this);'>${app.name}</a></li>`);
      }
    }
  });

  refreshQueryAudience();
});

function selectApp(sender) {
  var appId = sender.getAttribute('data-appid');
  var appName = sender.innerHTML;
  $("#appTitleField").val(appName);
  $("#appIdField").val(appId);
}

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

  var query = queryEditor.getValue();
  console.log("Typed query: " + query);
  if (!query  || query.length == 0) query = "{}"
  query = JSON.parse(query);

  $.ajax({
    url: "https://" + instance + "/push/reach",
    type: 'post',
    data: JSON.stringify({query: query}),
    headers: {'x-authorization-type' : 'user'},
    contentType: "application/json",
    dataType: 'json',
    success: function (data) {
      console.log("Data: " + JSON.stringify(data));
      $(".expectedAudience").html("Expected audience size: " + data.length);
      pushEstimatedAudience = data.length;
    }
  });

}


function fireTheIonCannon() {
  var authenticationData = Cookies.get("authenticationData");
  var data = authenticationData.split("%***&&&***%");
  var username = data[0];
  var password = data[1];
  var instance = data[2];

  var appId = $("#appIdField").val();

  if (!appId || appId.length == 0) {
    swal({
      title: "Did not send",
      text: "<h3>No app selected.</h3>",
      type:"error",
      html: true
    });
    return;
  }

  var query = queryEditor.getValue();
  console.log("Typed query: " + query);
  if (!query  || query.length == 0) query = "{}"
  query = JSON.parse(query);

  var payload = payloadEditor.getValue();
  console.log("Typed payload: " + payload);
  if (!payload  || payload.length == 0) payload = "{}"
  payload = JSON.parse(payload);

  if (!payload.alert || payload.alert.length == 0) {
    swal({
      title: "Did not send",
      text: "<h3>Alert text cannot be empty</h3>",
      type:"error",
      html: true
    });
    return;
  }

  var env = "d";

  if ($('#isProduction').is(":checked")) env = "p"

  swal({
    title: "Are you sure you want to send those pushes?",
    text: "<h4>Alert: '" + payload.alert + "'<br><br>Recipients: " + pushEstimatedAudience + "</h4>",
    type: "info",
    showCancelButton: true,
    closeOnConfirm: false,
    showLoaderOnConfirm: true,
    html: true
    },
    function() {
      $.ajax({
        url: "https://" + instance + "/push?appId=" + appId + "&env=" + env ,
        type: 'post',
        data: JSON.stringify({query: query, payload : payload}),
        headers: {'x-authorization-type' : 'user'},
        contentType: "application/json",
        dataType: 'json',
        success: function (data) {
          swal({
            title: "Push sent!",
            text: "<h3>The request was made to the specified LOPC instance!</h3>",
            type:"success",
            html: true
          });
        }
      });
  });



}
