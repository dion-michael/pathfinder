const url = "http://localhost:3000";
let fromPos
let toPos
let currentLoc
let jakarta = {
  lat: -6.21462,
  lng: 106.84513
}

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
        showHome()
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
$("#toggle").click(function (event) {
  event.preventDefault()
  toggleBtn()
})

function getLocation() {
  if (navigator.geolocation) {
    var options = {
      timeout: 60000
    }
    navigator.geolocation.getCurrentPosition(showLocation)
  } else {
    console.log('Geolocation is not supported by this browser."')
  }
}

function showLocation(position) {
  var latitude = position.coords.latitude
  var longitude = position.coords.longitude
  var both = `${latitude},${longitude}`
  var coor = [latitude, longitude]
  $.ajax({
      url: `${url}/weather`,
      method: "POST",
      data: {
        both: both,
        coor: coor
      },
      headers: {
        access_token: localStorage.getItem("access_token")
      }
    })
    .done(function (response) {
      console.log(response.hourly.icon)
      if (response.hourly.icon == 'clear-day') {
        response.hourly.icon = 'CLEAR_DAY'

      } else if (response.hourly.icon == 'clear-night') {
        response.hourly.icon = 'CLEAR_NIGHT'

      } else if (response.hourly.icon == 'partly-cloudy-day') {
        response.hourly.icon = 'PARTLY_CLOUDY_DAY'

      } else if (response.hourly.icon == 'partly-cloudy-night') {
        response.hourly.icon = 'PARTLY_CLOUDY_NIGHT'

      } else if (response.hourly.icon == 'cloudy') {
        response.hourly.icon = 'CLOUDY'

      } else if (response.hourly.icon == 'rain') {
        response.hourly.icon = 'RAIN'

      } else if (response.hourly.icon == 'sleet') {
        response.hourly.icon = 'SLEET'

      } else if (response.hourly.icon == 'snow') {
        response.hourly.icon = 'SNOW'

      } else if (response.hourly.icon == 'fog') {
        response.hourly.icon = 'FOG'
      }
      console.log(response)
      $('#weather').html(`
        <canvas id="icon1" width="72" height="72"></canvas>

        <div id="table1" style=justify-content:center;>
        ${response.currently.temperature}°C<br>
        ${response.timezone}<br>
        ${response.currently.summary}
        </div>

        <div id="table2" style="justify-content:center;margin-top: 4%">
        <strong>Summary:</strong><br>
        ${response.hourly.summary}<br>
        </div>

        <script>
        var skycons = new Skycons({"color": "teal"});
        skycons.add("icon1", Skycons.${response.hourly.icon});
        skycons.play();
        </script>
      `)
    })
    .fail(function (jqXHR, textStatus) {
      console.log(jqXHR);
    });
}

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
    showHome()
  } else {
    showLogin()
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
  getLocation()
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

function trafiRoute(result) {
  let route = result["Routes"][0] // RECOMMENDED, CHEAPER, TRANSJAKARTA (based on preference labels)
  for (let i = 0; i < result["Routes"].length; i++) {
    if (result["Routes"][i]["PreferenceLabel"] === "TRANSJAKARTA") {
      route = result["Routes"][i]
    }
  }
  let duration = route["DurationMinutes"]
  let walk = route["WalkMinutes"]
  let departTime = route["DepartureTime"]
  let arriveTime = route["ArrivalTime"]
  let price = route["Price"]
  let location = []
  for (let i = 0; i < route["RouteSegments"].length; i++) {
    let routeSegment = route["RouteSegments"][i]
    let dispRoute = []
    let start = {
      name: routeSegment["StartPoint"]["Name"],
      lat: routeSegment["StartPoint"]["Coordinate"]["Lat"],
      lng: routeSegment["StartPoint"]["Coordinate"]["Lng"],
      time: routeSegment["StartPoint"]["Time"]
    }
    let end = {
      name: routeSegment["EndPoint"]["Name"],
      lat: routeSegment["EndPoint"]["Coordinate"]["Lat"],
      lng: routeSegment["EndPoint"]["Coordinate"]["Lng"],
      time: routeSegment["EndPoint"]["Time"]
    }
    dispRoute.push(start)
    dispRoute.push(end)
    if (routeSegment["RouteSegmentType"] === 1) {
      dispRoute.push("WALKING")
    } else {
      dispRoute.push("DRIVING")
    }
    // dispRoute(start_loc, end_loc, type)
    location.push(dispRoute)
  }
}
$("#findRouteBtn").click(function () {
  let from = $("#from").val()
  let to = $("#from").val()
  console.log(from);
  console.log(to);
  findLocation()
})

function findLocation() {
  console.log("from ", fromPos);
  console.log(toPos);
  console.log(jakarta);
  let location_c = {
    lat: -6.251461,
    lng: 106.791731
  }

  displayRoute(fromPos, toPos, "DRIVING")
  displayRoute(toPos, jakarta, "DRIVING")
}