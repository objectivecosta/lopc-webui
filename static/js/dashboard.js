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

  $.get("https://" + instance + "/apps?username=" + username, function (data) {
    var appList = data.appList;
    for (var app of appList) {
      $('#appsDropdown').append(`<li><a data-appid='${app.appId}' onclick='selectApp(this);'>${app.name}</a></li>`);
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

  var query = {};

  var shouldReturnPrematurely = false;

  $('.queryForm').children('.row').each(function () {
    console.log('NCH: ' + $(this).children().length);
    var field = $(this).find('#queryField').first().val();
    var value = $(this).find('#queryValue').first().val();

    if (field.length == 0 || value.length == 0) {
      shouldReturnPrematurely = true;
    }
    query[field] = value;
  });

  if (shouldReturnPrematurely == true) {
    return;
  }

  $.ajax({
    url: "https://" + instance + "/device/query",
    type: 'post',
    data: JSON.stringify({query: query}),
    headers: {},
    contentType: "application/json",
    dataType: 'json',
    success: function (data) {
      console.log("Data: " + JSON.stringify(data));
      $(".expectedAudience").html("Expected audience size: " + data.length);
      pushEstimatedAudience = data.length;
    }
  });

}

function addPayloadField() {
  $.get('/static/partials/payloadRow.partial', function(result) {
    $('.payloadForm').append(result);
  });
}

function removePayloadField() {
  $('.payloadForm').children('.row').last().remove();
}

function addQueryField() {
  $('.queryForm').children('.queryAll').first().remove();
  $.get('/static/partials/queryRow.partial', function(result) {
    $('.queryForm').append(result);
  });
}

function removeQueryField() {
  if ($('.queryForm').children('.row').length == 1) {
    $('.queryForm').html("<h2 class='queryAll'>All</h2>");
  } else {
    $('.queryForm').children('.row').last().remove();
  }
}

function fireTheIonCannon() {

  var increaseBadge = $("#payloadIncreaseBadge").is(":checked");

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

  var query = {};

  var shouldReturnPrematurely = false;

  $('.queryForm').children('.row').each(function () {
    var field = $(this).find('#queryField').first().val();
    var value = $(this).find('#queryValue').first().val();

    if (field.length == 0 || value.length == 0) {
      swal({
        title: "Did not send",
        text: "<h3>Error: one (or more) of the query fields/values are empty.</h3>",
        type:"error",
        html: true
      });
      shouldReturnPrematurely = true;
    }
    query[field] = value;
  });

  var payload = {};

  var alertText = $('.payloadForm').find('#payloadAlert').first().val();

  if (alertText.length == 0) {
    swal({
      title: "Did not send",
      text: "<h3>Alert text cannot be empty</h3>",
      type:"error",
      html: true
    });
    shouldReturnPrematurely = true;
  }

  payload.alert = alertText;
  if (increaseBadge == true) payload.badge = "+";

  $('.payloadForm').children('.row').each(function () {
    var field = $(this).find('#payloadField').first().val();
    var value = $(this).find('#payloadValue').first().val();

    if (field.length == 0 || value.length == 0) {
      swal({
        title: "Did not send",
        text: "<h3>One (or more) of the payload fields/values are empty.</h3>",
        type:"error",
        html: true
      });
      shouldReturnPrematurely = true;
    }
    payload[field] = value;
  });

  if (shouldReturnPrematurely == true) {
    return;
  }

  console.log('JSON: ' + JSON.stringify({query: query, payload : payload}));

  swal({
    title: "Are you sure you want to send those pushes?",
    text: "<h4>Alert: '" + alertText + "'<br><br>Recipients: " + pushEstimatedAudience + "</h4>",
    type: "info",
    showCancelButton: true,
    closeOnConfirm: false,
    showLoaderOnConfirm: true,
    html: true
    },
    function(){
      $.ajax({
        url: "https://" + instance + "/push?appId=" + appId ,
        type: 'post',
        data: JSON.stringify({query: query, payload : payload}),
        headers: {},
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
