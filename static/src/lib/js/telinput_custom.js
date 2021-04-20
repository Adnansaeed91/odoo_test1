// --------------------------------------------- Phone -------------------------------- 
var phone_number = window.intlTelInput(document.querySelector("#phone"), {

    allowExtensions: true,
    formatOnDisplay: true,
    autoFormat: true,
    autoHideDialCode: true,
    // autoPlaceholder: true,
    defaultCountry: "auto",
    ipinfoToken: "yolo",
    nationalMode: false,
    numberType: "MOBILE",
    preferredCountries: ['sa', 'ae', 'qa','om','bh','kw','ma'],
    preventInvalidNumbers: true,
    separateDialCode: true,
    // initialCountry: "auto",
    initialCountry: "pk",
    customPlaceholder:"auto",


    // commented for api issue -------
    // geoIpLookup: function(success) {
    //   // Get your api-key at https://ipdata.co/
    //   fetch("https://api.ipdata.co/?api-key=test")
    //     .then(function(response) {
    //       if (!response.ok) return success("");
    //       return response.json();
    //     })
    //     .then(function(ipdata) {
    //       // Commented  for issue 
    //       // success(ipdata.country_code);
    //       // Commented  for issue 
    //       add static country code 
    //       success('pk');
    //     });
    // },
    // commented for api issue -------
  utilsScript: "//cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.3/js/utils.js"
});


var input_phone = document.querySelector("#phone"),
  errorMsg = document.querySelector("#error-msg");
  // validMsg = document.querySelector("#valid-msg");

  
var reset = function() {
  // input_phone.classList.remove("error");
  // errorMsg.innerHTML = "";

  if($('#phone').val() == ''){
    $('#phone').css('border-bottom', '1px solid #ced4da');
  }
  else{
    $('#phone').css('border-bottom', '1px solid black');
  }
  
  errorMsg.classList.add("hide");
  // validMsg.classList.add("hide");
};

// on blur: validate
input_phone.addEventListener('blur', function() {
  reset();
  if (input_phone.value.trim()) {
    if (phone_number.isValidNumber()) {
      
      $('#error-msg').css('color', 'red');
      $('#phone').css('color', 'black');

    } else {
      errorMsg.classList.remove("hide");
      
      $('#error-msg').css('color', 'red');
      $('#phone').css('color', 'red');
      $('#phone').css('border-bottom', '1px solid red');

    }
  }
});
$('#phone').on("focus", function(){
  $('#phone').css('border-bottom', '1px solid black');
});
$('#phone').on("focusout", function(){
  $('#phone').css('border-bottom', '1px solid #ced4da');
});

// on keyup / change flag: reset
input_phone.addEventListener('change', reset);
input_phone.addEventListener('keyup', reset);

// --------------------------------------------- Phone --------------------------------

// --------------------------------------------- Mobile --------------------------------
var mobile_number = window.intlTelInput(document.querySelector("#mobile"), {
    allowExtensions: true,
    formatOnDisplay: true,
    autoFormat: true,
    autoHideDialCode: true,
    // autoPlaceholder: true,
    defaultCountry: "auto",
    ipinfoToken: "yolo",
    nationalMode: false,
    numberType: "MOBILE",
    preferredCountries: ['sa', 'ae', 'qa','om','bh','kw','ma'],
    preventInvalidNumbers: true,
    separateDialCode: true,
    // initialCountry: "auto",
    initialCountry: "pk",
    customPlaceholder:"auto",

    // commented for api issue -------
    // geoIpLookup: function(success) {
    //   // Get your api-key at https://ipdata.co/
    //   fetch("https://api.ipdata.co/?api-key=test")
    //     .then(function(response) {
    //       if (!response.ok) return success("");
    //       return response.json();
    //     })
    //     .then(function(ipdata) {
    //       success(ipdata.country_code);
    //     });
    // },
    // commented for api issue -------
  utilsScript: "//cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.3/js/utils.js"
});


var input_mobile = document.querySelector("#mobile"),
  errorMsg_mobile = document.querySelector("#error-msg-mobile");
  // validMsg_mobile = document.querySelector("#valid-msg-mobile");

  
var reset_mobile = function() {
  // input_mobile.classList.remove("error");
  // if ($("#mobile"). is(":focus")) {
  //   $('#mobile').css('border-bottom', '1px solid black');
  // }
  // else 
  if($('#mobile').val() == ''){
    $('#mobile').css('border-bottom', '1px solid #ced4da');
  }
  else{
    $('#mobile').css('border-bottom', '1px solid black');
  }

  // errorMsg.innerHTML = "";
  errorMsg_mobile.classList.add("hide");
  // validMsg_mobile.classList.add("hide");
};

// on blur: validate
input_mobile.addEventListener('blur', function() {
  reset();
  if (input_mobile.value.trim()) {
    if (mobile_number.isValidNumber()) {
      $('#error-msg-mobile').css('color', 'red');
      $('#mobile').css('color', 'black');

    } else {
      errorMsg_mobile.classList.remove("hide");
      
      $('#error-msg-mobile').css('color', 'red');
      $('#mobile').css('color', 'red');
      $('#mobile').css('border-bottom', '1px solid red');
    }
  }
});

$('#mobile').on("focus", function(){
  $('#mobile').css('border-bottom', '1px solid black');
});
$('#mobile').on("focusout", function(){
  $('#mobile').css('border-bottom', '1px solid #ced4da');
});


// on keyup / change flag: reset
input_mobile.addEventListener('change', reset_mobile);
input_mobile.addEventListener('keyup', reset_mobile);


$('#email').on("focus", function(){
  $('#email').css('border-bottom', '1px solid black');
});

$('#email').on("focusout", function(){
  $('#email').css('border-bottom', '1px solid #ced4da');
});

// --------------------------------------------- Mobile --------------------------------

