odoo.define('vendor_registration_form.page_addons', function (require) {
'use strict';


var publicWidget = require('web.public.widget');
var utils = require('web.utils');
var core = require('web.core');
var _t = core._t;

const data = [
    {id: 0, text: 'Vue.js'},
    {id: 1, text: 'React.js'},
    {id: 2, text: 'Angular'}
    ];

publicWidget.registry.portalDetails = publicWidget.Widget.extend({
    selector: '.o_membership_details',

   events: {
        'change input#imageUpload': '_onVendorImage',
        'change input#GSTUpload': '_onGSTUpload',
        'change input#NTNUpload': '_onNTNUpload',
        
        'change input#selectcountry': '_onSelectCountry',
        'change input[name=listedQualified]': '_onlistedQualified',
        'change input[name=dealer]': '_onChangeDealer',
        'click #companyprofile': '_onCompanyprofile',

    },

    init: function () {
        var def = this._super.apply(this, arguments);
        return def;
    },

//    start: function () {
//        var self = this;
//        self.serviceProvider();
//    },


    _onVendorImage: function() {
        alert('    _onVendorImage ssssssssssssssssssssssssssssssssssss')

        // data-previewId
        var self = this;
        var input = document.querySelector('input[id="imageUpload"]');
        var previewid = $('#imageUpload').attr("data-previewId")
        self.readURL(input,previewid);
    },

    readURL: function (input,previewid) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            reader.onload = function(e) {
                if (previewid == 'GSTPreview') {
                    $('#GSTPreviewid').addClass('avatar-preview_gst mx-auto mt-1');
                }else if (previewid == 'NTNPreview') {
                    $('#NTNPreviewid').addClass('avatar-preview_gst mx-auto mt-1');
                }
                $('#'+previewid).css('background-image', 'url('+e.target.result +')');
                $('#'+previewid).hide();
                $('#'+previewid).fadeIn(650);
            }
            reader.readAsDataURL(input.files[0]);
        }
    },

    _onGSTUpload: function() {
        // data-previewId
        var self = this;
        var input = document.querySelector('input[id="GSTUpload"]');
        var previewid = $(this).attr("data-previewId");
        self.readURL(input,previewid);
    },

    _onNTNUpload: function() {
    // data-previewId
    var input = document.querySelector('input[id="NTNUpload"]');
    var previewid = $(this).attr("data-previewId");
    readURL(input,previewid);
    },


    tagshowfunc: function(input,previewid) {
        console.log('tagshowfunc  input ===============',input)
        if ($(input).is(':checked')) {
            $('#'+previewid).removeAttr("disabled");
        }else{
            $('#'+previewid).attr("disabled",'true');
        }
    },

    _onCompanyprofile: function(ev) {
        // data-previewId
        console.log('ssssssssssssssss')

        var showtag = $(this).attr("data-showtag");
        this.tagshowfunc(this,showtag);
    },

    
//$("#productlist").change(function() {
//    // data-previewId
//    var showtag = $(this).attr("data-showtag");
//    tagshowfunc(this,showtag);
//});

//$("#toolsplants").change(function() {
//    // data-previewId
//    var showtag = $(this).attr("data-showtag");
//    tagshowfunc(this,showtag);
//});

//$("#bankStatement").change(function() {
//    // data-previewId
//    var showtag = $(this).attr("data-showtag");
//    tagshowfunc(this,showtag);
//});

//$("#incomeTaxReg").change(function() {
//    // data-previewId
//    var showtag = $(this).attr("data-showtag");
//    tagshowfunc(this,showtag);
//});

//$("#saletax").change(function() {
//    // data-previewId
//    var showtag = $(this).attr("data-showtag");
//    tagshowfunc(this,showtag);
//});

//$("#eobi").change(function() {
//    // data-previewId
//    var showtag = $(this).attr("data-showtag");
//    tagshowfunc(this,showtag);
//});

//$("#certificate_of_pre_qualification").change(function() {
//    // data-previewId
//    var showtag = $(this).attr("data-showtag");
//    tagshowfunc(this,showtag);
//});

//$("#certificate_of_pre_qualificationUpload").change(function() {
//    // data-previewId
//    var showtag = $(this).attr("data-showtag");
//    tagshowfunc(this,showtag);
//});

//$("#stamp_paper").change(function() {
//    // data-previewId
//    var showtag = $(this).attr("data-showtag");
//    tagshowfunc(this,showtag);
//});

//    $(".custom-file-input").on("change", function() {
//        var fileName = $(this).val().split("\\").pop();
//        $(this).siblings(".custom-file-label").addClass("selected").html(fileName);
//        });

//    _onSelectCountry:function() {
//        country = $("#selectcountry");
//        console.log('+++++++++++++++++++++++++')
//        if(country.value == 'pakistan'){
//            $("#GSTFileOption").css('display','block');
//            $("#NTNFileOption").css('display','flex');
//            $("#texid").css('display','none');
//            $(".local-hide").css('display','inline-block');
//        } else{
//            $("#GSTFileOption").css('display','none');
//            $("#NTNFileOption").css('display','none');
//            $(".local-hide").css('display','none');
//            $("#texid").css('display','flex');
//        }
//    },

    _onlistedQualified: function() {
        var listedQualified = document.getElementsByName("listedQualified");
        for(var i = 0; i < listedQualified.length; i++){
            if (listedQualified[i].checked == true) {
                var checkedValue = listedQualified[i]
            }
        }
        if(checkedValue.value == 'Qualified'){
            $("#qualified_section1").css('display','flex');
            // $("#qualified_section2").css('display','flex');
            // $("#qualified_section3").css('display','flex');
        } else if(checkedValue.value == 'Listed'){
            $("#qualified_section1").css('display','none');
            // $("#qualified_section2").css('display','none');
            // $("#qualified_section3").css('display','none');
        }
    },
//
//    _onChangeDealer: function() {
//        var dealer = document.getElementsByName("dealer");
//        for(var i = 0; i < dealer.length; i++){
//            if (dealer[i].checked == true) {
//                var dealerValue = dealer[i]
//            }
//        }
//        if(dealerValue.value == 'Authorized Dealer'){
//            $("#principal_name").removeAttr('disabled');
//            // $("#qualified_section2").css('display','flex');
//            // $("#qualified_section3").css('display','flex');
//        } else if(dealerValue.value == 'Representative'){
//            $("#principal_name").attr('disabled','true');
//            // $("#qualified_section2").css('display','none');
//            // $("#qualified_section3").css('display','none');
//        }
//    },

//    serviceProvider: function() {
//        const select = $('#service_provider');
//        const selectedId = $('#selectedId');
//        console.log('---------------',select,selectedId)
//        select.select2({
//            data: data
//        })
//    .on('change', (event) => {
//        const selecions = select.select2('data')
//        .map((element) => parseInt(element.id, 10));
//        selectedId.text(selecions.join(', '));
//    });
//    },

//(function($){
//    $('.extra-fields-customer').click(function() {
//        $('.customer_records').clone().appendTo('.customer_records_dynamic');
//        $('.customer_records_dynamic .customer_records').addClass('single remove');
//        $('.single .extra-fields-customer').remove();
//        $('.single').prepend('<a href="#" class="remove-field btn-remove-customer col-12 text-right mt-4">Remove this account</a>');
//        $('.customer_records_dynamic > .single').attr("class", "remove row");
//
//        $('.customer_records_dynamic input').each(function() {
//        var count = 0;
//        var fieldname = $(this).attr("name");
//        $(this).attr('name', fieldname + count);
//        count++;
//        });
//    });
//
//    $(document).on('click', '.remove-field', function(e) {
//    $(this).parent('.remove').remove();
//    e.preventDefault();
//    });
//
//
//    var telInput = $("#phone"),
//    errorMsg = $("#error-msg"),
//    validMsg = $("#valid-msg");
//
//    // initialise plugin
//    telInput.intlTelInput({
//
//    allowExtensions: true,
//    formatOnDisplay: true,
//    autoFormat: true,
//    autoHideDialCode: true,
//    autoPlaceholder: true,
//    defaultCountry: "auto",
//    ipinfoToken: "yolo",
//
//    nationalMode: false,
//    numberType: "MOBILE",
//    //onlyCountries: ['us', 'gb', 'ch', 'ca', 'do'],
//    preferredCountries: ['sa', 'ae', 'qa','om','bh','kw','ma'],
//    preventInvalidNumbers: true,
//    separateDialCode: true,
//    initialCountry: "auto",
//    geoIpLookup: function(callback) {
//    $.get("http://ipinfo.io", function() {}, "jsonp").always(function(resp) {
//    var countryCode = (resp && resp.country) ? resp.country : "";
//    callback(countryCode);
//    });
//    },
//    utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/11.0.9/js/utils.js"
//    });
//
//    var reset = function() {
//    telInput.removeClass("error");
//    errorMsg.addClass("hide");
//    validMsg.addClass("hide");
//    };
//
//    // on blur: validate
//    telInput.blur(function() {
//    reset();
//    if ($.trim(telInput.val())) {
//    if (telInput.intlTelInput("isValidNumber")) {
//      validMsg.removeClass("hide");
//    } else {
//      telInput.addClass("error");
//      errorMsg.removeClass("hide");
//    }
//    }
//    });
//
//    // on keyup / change flag: reset
//    telInput.on("keyup change", reset);
//
//
//    var telInput = $("#mobile"),
//    errorMsg = $("#error-msg-mobile"),
//    validMsg = $("#valid-msg-mobile");
//
//    // initialise plugin
//    telInput.intlTelInput({
//
//    allowExtensions: true,
//    formatOnDisplay: true,
//    autoFormat: true,
//    autoHideDialCode: true,
//    autoPlaceholder: true,
//    defaultCountry: "auto",
//    ipinfoToken: "yolo",
//
//    nationalMode: false,
//    numberType: "MOBILE",
//    //onlyCountries: ['us', 'gb', 'ch', 'ca', 'do'],
//    preferredCountries: ['sa', 'ae', 'qa','om','bh','kw','ma'],
//    preventInvalidNumbers: true,
//    separateDialCode: true,
//    initialCountry: "auto",
//    geoIpLookup: function(callback) {
//    $.get("http://ipinfo.io", function() {}, "jsonp").always(function(resp) {
//    var countryCode = (resp && resp.country) ? resp.country : "";
//    callback(countryCode);
//    });
//    },
//    utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/11.0.9/js/utils.js"
//    });
//
//    var reset = function() {
//    telInput.removeClass("error");
//    errorMsg.addClass("hide");
//    validMsg.addClass("hide");
//    };
//
//    // on blur: validate
//    telInput.blur(function() {
//    reset();
//    if ($.trim(telInput.val())) {
//    if (telInput.intlTelInput("isValidNumber")) {
//      validMsg.removeClass("hide");
//    } else {
//      telInput.addClass("error");
//      errorMsg.removeClass("hide");
//    }
//    }
//    });
//
//    // on keyup / change flag: reset
//    telInput.on("keyup change", reset);
//    });
});
});