const url = "http://localhost:3000";

function register(email, password) {
  $("#errMessage").hide()
  $.ajax({
    url: `${url}/register`,
    method: "POST",
    data: {
      email,
      password
    },
    statusCode: {
      201: function (user) {
        login(email, password)
      },
      404: function (err) {
        console.log(err);
        checkLogin()
      },
      400: function (err) {
        console.log(err);
        let errObj = JSON.parse(err.responseText);
        console.log(errObj);
        let errMsg = Object.values(errObj)
        $(".ui.form").removeClass("loading")
        $("#errMessage").show()
        $("#errMessageText").empty()
        $("#errMessageText").append(
          `<div class="header">
                <ul id="errText"></ul>
            </div>
            <p>Please check your email / password</p>`
        )
        errMsg.forEach(errors => {
          $("#errText").append(
            `<li>${errors}</li>`)
        })

      }
    }
  })
}

$('.ui.form').submit(function (event) {
  event.preventDefault()
  console.log($("#btnSubmit").html());
  if ($("#btnSubmit").html() === "Login") {
    $(".ui.form").addClass("loading")
    let email = $(this).serializeArray()[0].value
    let password = $(this).serializeArray()[1].value
    login(email, password)
  } else {
    $(".ui.form").addClass("loading")
    let email = $(this).serializeArray()[0].value
    let password = $(this).serializeArray()[1].value
    register(email, password)
  }
})

function logout() {
  localStorage.removeItem("token");
  $("#map").hide()
  var auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut()
    .then(function () {
      showLogin();
    });
}

function login(email, password) {
  $("#errMessage").hide()
  $.ajax({
    url: `${url}/login`,
    method: "POST",
    data: {
      email,
      password
    },
    statusCode: {
      200: function (user) {
        localStorage.setItem("token", user.access_token)
        // localStorage.setItem("email", user.email)
        $(".ui.form").removeClass("loading")
        checkLogin()
      },
      404: function (err) {
        console.log(err);
        $(".ui.form").removeClass("loading")
        $("#errMessage").show()
        $("#errMessageText").empty()
        $("#errMessageText").append(
          `<div class="header">
                invalid email / password
            </div>
            <p>Please check your email / password</p>`
        )
      },
      400: function (err) {
        console.log(err);
        $(".ui.form").removeClass("loading")
        $("#errMessage").show()
        $("#errMessageText").empty()
        $("#errMessageText").append(
          `<div class="header">
                invalid email / password
            </div>
            <p>Please check your email / password</p>`
        )
      }
    }
  })
}

function onSignIn(googleUser) {
  var id_token = googleUser.getAuthResponse().id_token;
  $.ajax({
      url: `${url}/google`,
      method: 'POST',
      data: {
        googleToken: id_token
      }
    })
    .done(function (response) {
      localStorage.setItem('access_token', response.access_token)
      showHome()
    })
    .fail(function (jqXHR, textStatus) {
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
}



$("#toggle").click(function (event) {
  event.preventDefault()
  toggleBtn()
})

function toggleBtn() {
  if ($("#btnSubmit").html() === "Login") {
    $("#errMessage").hide()
    $("#btnSubmit").html("Register")
    $("#toggle").html("Login")
    $("#toggleText").html("Already registered?")
  } else {
    $("#errMessage").hide()
    $("#btnSubmit").html("Login")
    $("#toggle").html("Register")
    $("#toggleText").html("New to us?")
  }
}

function showLogin() {
  $("#homePage").hide();
  $("#registerPage").hide();
  loginHTML();
  $("#loginForm").show();
  $("#navbar").show();
}

function showHome() {
  $("#loginForm").hide();
  // $("#loginPage").empty();

  $("#registerPage").hide();
  // $("#registerPage").empty();

  $("#homePage").show();
  $("#navbar").show();
  $("#map").show()
}

function checkLogin() {
  if (localStorage.getItem('token')) {
    $("#loginForm").hide()
    $("#homePage").show();
  } else {
    $("#loginForm").show()
    $("#homePage").hide();
  }
}

$(document).ready(function () {
  // if (localStorage.getItem("access_token")) {
  //   showHome();
  // } else {
  //   showLogin();
  // }
  checkLogin()
  renderGsignIn()
  $('.ui.form')
    .form({
      fields: {
        email: {
          identifier: 'email',
          rules: [{
              type: 'empty',
              prompt: 'Please enter your e-mail'
            },
            {
              type: 'email',
              prompt: 'Please enter a valid e-mail'
            }
          ]
        },
        password: {
          identifier: 'password',
          rules: [{
              type: 'empty',
              prompt: 'Please enter your password'
            },
            {
              type: 'length[6]',
              prompt: 'Your password must be at least 6 characters'
            }
          ]
        }
      }
    });
});

function renderGsignIn() {
  gapi.signin2.render('g-signin2', {
    'scope': 'profile email',
    'width': 215,
    'height': 50,
    'longtitle': true,
    'theme': 'light',
    'onsuccess': onSignIn,
    // 'onfailure': onFailure
  });
}