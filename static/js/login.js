$(document).ready(function () {
  var authenticationData = Cookies.get("authenticationData");
  if (authenticationData && authenticationData.indexOf("%***&&&***%") != -1) {
    window.location.href = "/dashboard";
  }
});

function login() {
  var username = $("#inputUsername").val();
  var password = $("#inputPassword").val();
  var instance = $("#inputInstance").val();

  var authenticationData = username + "%***&&&***%" + password + "%***&&&***%" + instance;
  Cookies.set("authenticationData", authenticationData, { path: '' });
}
