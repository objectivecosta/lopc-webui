function login() {
  var username = $("#inputUsername").val();
  var password = $("#inputPassword").val();
  var instance = $("#inputInstance").val();

  var authenticationData = username + "%***&&&***%" + password + "%***&&&***%" + instance;

  Cookies.set("authenticationData", authenticationData, { path: '' });
  window.location = "/dashboard";
}
