const url = "http://localhost:3000";

function register() {
  $.ajax({
    url: `${url}/register`,
    method: "POST",
    data: {
      email: $("#registerEmail").val(),
      password: $("#registerPassword").val()
    }
  })
    .done(function(response) {
      showLogin();
    })
    .fail(function(jqXHR, textStatus) {
      if (jqXHR.responseJSON.message) {
        console.log(jqXHR.responseJSON.message);
      } else {
        console.log(jqXHR);
      }
    });
}

function logout() {
  localStorage.removeItem("access_token");
  var auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut()
  .then(function () {
    console.log('User signed out.');
    showLogin();
  });

}

function login() {
  $.ajax({
    url: `${url}/login`,
    method: "POST",
    data: {
      email: $("#loginEmail").val(),
      password: $("#loginPassword").val()
    }
  })
    .done(function(response) {
      localStorage.setItem("access_token", response.access_token);
      showHome();
    })
    .fail(function(jqXHR, textStatus) {
      if (jqXHR.responseJSON.message) {
        console.log(jqXHR.responseJSON.message);
      } else {
        console.log(jqXHR);
      }
    });
}
function onSignIn(googleUser) {
  var id_token = googleUser.getAuthResponse().id_token;
  console.log(id_token)
  $.ajax({
      url:`${url}/google`,
      method: 'POST',
      data: {
          googleToken: id_token
      }
  })
  .done(function(response){
      localStorage.setItem('access_token', response.token)
      showHome()
  })
  .fail(function(jqXHR, textStatus){
    if (jqXHR.responseJSON.message) {
      console.log(jqXHR.responseJSON.message);
    } else {
      console.log(jqXHR);
    }
  })
  
}

function registerHTML() {
    $("#registerPage").html(`
      <h3>Register</h3>
      <form>
          <div class="form-group">
              <label for="registerEmail">Email address</label>
              <input type="email" class="form-control" id="registerEmail" aria-describedby="emailHelp"
                  placeholder="Enter email">
              <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone
                  else.</small>
          </div>
          <div class="form-group">
              <label for="RegisterPassword">Password</label>
              <input type="password" class="form-control" id="registerPassword" placeholder="Password">
          </div>
          <div class="form-group form-check">
              <input type="checkbox" class="form-check-input" id="exampleCheck2">
              <label class="form-check-label" for="exampleCheck1">Check me out</label>
          </div>
          <button id="registerButton2" class="btn btn-primary">Register</button>
          <br>
          <button id="loginButton2" class="btn btn-primary">Login</button>
      </form>
      <script>
      $("#loginButton2").click(function() {
        event.preventDefault();
        loginHTML();
        $("#loginPage").show();
        $("#registerEmail").val("");
        $("#registerPassword").val("");
        $("#registerPage").hide();
        $("#registerPage").empty();
      });
      $("#registerButton2").click(function() {
        event.preventDefault();
        register();
      });
      </script>
    `);
  }
  function loginHTML() {
    $("#loginPage").html(`
      <h3>Login</h3>
      <form>
          <div class="form-group">
              <label for="loginEmail">Email address</label>
              <input type="email" class="form-control" id="loginEmail" aria-describedby="emailHelp"
                  placeholder="Enter email">
              <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone
                  else.</small>
          </div>
          <div class="form-group">
              <label for="loginPassword">Password</label>
              <input type="password" class="form-control" id="loginPassword" placeholder="Password">
          </div>
          <div class="form-group form-check">
              <input type="checkbox" class="form-check-input" id="exampleCheck1">
              <label class="form-check-label" for="exampleCheck1">Check me out</label>
          </div>
          <button id="loginButton" class="btn btn-primary">Login</button>
          <button id="registerButton" class="btn btn-primary">Register</button>
          <div id="g-signin2" data-onsuccess="onSignIn"></div>
      </form>
      <script>
      $("#loginButton").click(function() {
        event.preventDefault();
        login();
      });
      $("#registerButton").click(function() {
        event.preventDefault();
        $("#loginPage").hide();
        $("#loginPage").empty();
        $("#loginEmail").val("");
        $("#loginPassword").val("");
        registerHTML();
        $("#registerPage").show();
      });
      </script>
    `);

    gapi.signin2.render('g-signin2', {
      'scope': 'profile email',
      'width': 240,
      'height': 50,
      'longtitle': true,
      'theme': 'dark',
      'onsuccess': onSignIn,
      // 'onfailure': onFailure
    });
  }

  function navbarHTML() {
    $("#navbar").html(`
      Group Project
    `);
  }

  function showLogin() {

    $("#homePage").hide();
  
    $("#registerPage").hide();
    // $("#registerPage").empty();

    loginHTML();
    $("#loginPage").show();

    navbarHTML();
    $("#navbar").show();
  }

  function showRegister() {
    $("#loginPage").hide();
    // $("#loginPage").empty();

    $("#homePage").hide();

    registerHTML();
    $("#registerPage").show();

    navbarHTML();
    $("#navbar").show();
  }

  function showHome() {
    $("#loginPage").hide();
    // $("#loginPage").empty();

    $("#registerPage").hide();
    // $("#registerPage").empty();

    $("#homePage").show();
  
    navbarHTML();
    $("#navbar").show();
  }

  $(document).ready(function() {
    if (localStorage.getItem("access_token")) {
      showHome();
    } else {
      showLogin();
    }
  });