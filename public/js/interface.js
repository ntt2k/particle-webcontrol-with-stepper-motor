// Refresh sensor data
// setInterval(function() {
//
//   // Update light level & core status
//   $.get('/get', {command: '/control', core: 'device1'}, function(json_data) {
//
//     // Light level
//     if (json_data.result){
//       $("#lightDisplay").html("Light level: " + json_data.result + "%");
//     }
//
//     // Core status
//     if (json_data.coreInfo['connected'] == true){
//       $("#sensorsCoreStatus").html("Core Online");
//       $("#sensorsCoreStatus").css("color","green");
//     }
//     else {
//       $("#sensorsCoreStatus").html("Core Offline");
//       $("#sensorsCoreStatus").css("color","red");
//     }
//   });

  // Update temperature
  // $.get('/get', {command: '/temperature', core: 'sensor_core'}, function(json_data) {
  //   if (json_data.result){
  //     $("#tempDisplay").html("Temperature: " + json_data.result + " °C");
  //   }
  // });

  // Update humidity
//   $.get('/get', {command: '/humidity', core: 'sensor_core'}, function(json_data) {
//     if (json_data.result){
//       $("#humidityDisplay").html("Humidity: " + json_data.result + "%");
//     }
//   });
//
// }, 1000);

setInterval(function() {

 $.get('/get', {command: '/currentPos', core: 'device1'}, function(json_data) {
    if (json_data.result > 0) {
      $("#openPercentageDisplay").html("Amount opened: " + json_data.result + "%");
      currentTime = new Date();
      durationTime = Math.round((currentTime - startTime) / 1000);
      $("#durationDisplay").html("Duration: " + durationTime + " seconds");
    }
    else {
      $("#openPercentageDisplay").html("Amount opened: 0%");
      $("#startTimeDisplay").html("Start time:");
      $("#durationDisplay").html("Duration: ");
    }
 });

}, 2000);


// console.log("BEFORE LOAD buttonClick!");
function buttonClick(checkedValue){

  // var checkedValue = document.getElementById(clicked_id).checked;
  if (checkedValue) {
    document.getElementById("myonoffswitch").checked = true;
    $.get('/post', {command: '/control', core: 'device1', params: 'on'});
    console.log("turn on");
  }
  else {
    document.getElementById("myonoffswitch").checked = false;
    // Closing the water before turn off controller
    $.get('/get', {command: '/currentPos', core: 'device1'}, function(json_data) {
      if(json_data.result > 0) {
        console.log("Closing the water before turn off controller!");
        $.get('/post', {command: '/controlOpen', core: 'device1', params: "0"});
        $("#controlSlider").roundSlider({value: 0});

      }
    });

    $.get('/post', {command: '/control', core: 'device1', params: 'off'});
    console.log("turn off");
  }
}
// console.log("AFTER LOAD buttonClick!");

function openValve(percent_open){

    if (document.getElementById("myonoffswitch").checked) {
      // var currentOpen = $("#controlSlider").roundSlider("getValue");
      // console.log("--> DEBUG = " + currentOpen);
      $("#controlSlider").roundSlider({value: percent_open});

       $.get('/get', {command: '/previousPos', core: 'device1'}, function(json_data) {
          if (json_data.result == 0) {
            startTime = new Date();
            console.log("d:",startTime);
            $("#startTimeDisplay").html("Start time: " + startTime.toLocaleTimeString());
          }
        });

      $.get('/post', {command: '/controlOpen', core: 'device1', params: percent_open});
      console.log("open water flow percent =", percent_open);
    }
    else {
      $("#controlSlider").roundSlider({value: 0});
      console.log("Cannot open water, you need to turn on device first!");
    }
}

function loadJSON(file, callback) {

    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', file, true); // Replace 'my_data' with the path to your file
    xobj.onreadystatechange = function () {
          if (xobj.readyState == 4 && xobj.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText);
          }
    };
    xobj.send(null);
 }

 function loadAutomation() {

     loadJSON("automation.json", function(response) {

         var actual_JSON = JSON.parse(response);
        //  console.log(actual_JSON);
        startTime = new Date();
         for (var t in actual_JSON) {
            //  console.log(actual_JSON[task]);
            var task = actual_JSON[t];

             buttonClick(true); // turn on
             openValve(task.amount_opened);
             buttonClick(false); // turn off

            //  var waitTime = task.duration*1000;

            //  suspend(function* () {
            //     console.log("start to wait for " + waitTime + " ms");
            //     yield setTimeout(suspend.resume(), waitTime);
            //     console.log("end to wait for " + waitTime + " ms");
            //     buttonClick(false); // turn off
            //   })();

              // sleep.sleep(task.amount_opened);
              // buttonClick(false); // turn off

         }
     });
 }
