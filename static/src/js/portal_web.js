odoo.define('vendor_registration_form.page_addons', function (require) {
'use strict';

    var publicWidget = require('web.public.widget');
    var utils = require('web.utils');
    var core = require('web.core');
    var _t = core._t;

     var ajax = require('web.ajax');

//    const data = [
//        {id: 0, text: 'Vue.js'},
//        {id: 1, text: 'React.js'},
//        {id: 2, text: 'Angular'}
//        ];

//    $.each(data, function (i, d) {
//        $('#service_provider').append($('<option>', {
//            value: d.id,
//            text : d.text
//        }));
//    });


    $(document).on('click', '.remove-field', function(e) {
        $(this).parent('.remove').remove();
        e.preventDefault();
    });

    $(document).ready(function() {
        $("#service_provider").select2({
            width: 'auto'
        });
    });

    // Confirm pass
    $('#password, #c_password').on('keyup', function ()
    {
      if ($('#password').val() == '' && $('#c_password').val() == '') {
        $('#c_password').css('border-color', '#ced4da');
      }else if ($('#password').val() != $('#c_password').val() && ($('#c_password').val() != '')) {
        $('#c_password').css('border-color', 'red');
      }
      else if ($('#password').val() == $('#c_password').val()){
        $('#c_password').css('border-color', 'green');
      }

    });

    publicWidget.registry.portalDetails = publicWidget.Widget.extend({
        selector: '.o_membership_details',

        events: {
            // 'change input[name=listedQualified]': '_onlistedQualified',
            'change input#imageUpload': '_onVendorImage',

        },

        start: function () {
            var def = this._super.apply(this, arguments);

            $('#companyprofile').on("change", this._onCompanyProfile.bind(this));
            $('#productlist').on("change", this._onProductList.bind(this));
            $('#stamp_paper').on("change", this._onStampPaper.bind(this));
            $('#toolsplants').on("change", this._onToolsPlants.bind(this));
            $('#bankStatement').on("change", this._onBankStatement.bind(this));
            $('#incomeTaxReg').on("change", this._onIncomeTaxReg.bind(this));
            $('#saletax').on("change", this._onSaleTax.bind(this));
            $('#eobi').on("change", this._onEobi.bind(this));
            $('#certificate_of_pre_qualification').on("change", this._onCertificateOfPreQualification.bind(this));
            
            $('#dealer').on("change", this._onDealer.bind(this));
            
            $('#NTNUpload').on("change", this._onNTNUpload.bind(this));
            $('#GSTUpload').on("change", this._onGSTUpload.bind(this));

            $('#selectcountry').on("change", this._onSelectCountry.bind(this));
            $('#list_quali_type').on("change", this._onlistedQualified.bind(this));
            
            // For File name 
            $('.custom-file-input').on("change", this._InputFileName.bind(this));
            
            $('.extra-fields-customer').on("click", this._onClickExtraFieldCustomer.bind(this));
            $('.extra-fields-contacts').on("click", this._onClickExtraFieldContacts.bind(this));

            $('#email').on("keyup", this._onEmail_available_check.bind(this));

            return def
        },
        _onClickExtraFieldCustomer: function(ev) {
            $('.customer_records').clone().appendTo('.customer_records_dynamic').find('input').val('');
            $('.customer_records_dynamic .customer_records').addClass('single remove');
            $('.single .extra-fields-customer').remove();
            $('.single').prepend('<a href="#" style="color:#007bff !important" class="remove-field btn-remove-customer col-12 text-right mt-4">Remove this account</a>');
            $('.customer_records_dynamic > .single').attr("class", "remove row");

            $('.customer_records_dynamic input').each(function() {
                var count = 1;
                var fieldname = $(this).attr("name");
                $(this).attr('name', fieldname + count);
                count++;
            });
        },

        _onClickExtraFieldContacts: function(ev) {
            $('.contact_records').clone().appendTo('.contact_records_dynamic').find('input').val('');
            $('.contact_records_dynamic .contact_records').addClass('single remove');
            $('.single .extra-fields-contacts').remove();
            $('.single').prepend('<a href="#" style="color:#007bff !important" class="remove-field btn-remove-customer col-12 text-right mt-4">Remove this contact</a>');
            $('.contact_records_dynamic > .single').attr("class", "remove row");

            $('.contact_records_dynamic input').each(function() {
                var count = 1;
                var fieldname = $(this).attr("name");
                $(this).attr('name', fieldname + count);
                count++;
            });
        },
        
        tagshowfunc: function(input,previewid) {
            if ($(input).is(':checked')) {
                $('#'+previewid).removeAttr("disabled");
            }else{
                $('#'+previewid).attr("disabled",'true');
            }
        },
    
        _onCompanyProfile: function(ev) {
            var $companyprofile = $('#companyprofile') 
            var showtag = $companyprofile.attr("data-showtag");
	        this.tagshowfunc($companyprofile,showtag);
        },
        _onProductList: function(ev) {
            var $productlist = $('#productlist') 
            var showtag = $productlist.attr("data-showtag");
	        this.tagshowfunc($productlist,showtag);
        },
        _onStampPaper: function(ev) {
            var $stamp_paper = $('#stamp_paper') 
            var showtag = $stamp_paper.attr("data-showtag");
	        this.tagshowfunc($stamp_paper,showtag);
        },
        _onToolsPlants: function(ev) {
            var $toolsplants = $('#toolsplants') 
            var showtag = $toolsplants.attr("data-showtag");
	        this.tagshowfunc($toolsplants,showtag);
        },
        _onBankStatement: function(ev) {
            var $bankStatement = $('#bankStatement') 
            var showtag = $bankStatement.attr("data-showtag");
	        this.tagshowfunc($bankStatement,showtag);
        },
        _onIncomeTaxReg: function(ev) {
            var $incomeTaxReg = $('#incomeTaxReg') 
            var showtag = $incomeTaxReg.attr("data-showtag");
	        this.tagshowfunc($incomeTaxReg,showtag);
        },
        _onSaleTax: function(ev) {
            var $saletax = $('#saletax') 
            var showtag = $saletax.attr("data-showtag");
	        this.tagshowfunc($saletax,showtag);
        },
        _onEobi: function(ev) {
            var $eobi = $('#eobi') 
            var showtag = $eobi.attr("data-showtag");
	        this.tagshowfunc($eobi,showtag);
        },
        _onCertificateOfPreQualification: function(ev) {
            var $certificate_of_pre_qualification = $('#certificate_of_pre_qualification')
            var showtag = $certificate_of_pre_qualification.attr("data-showtag");
	        this.tagshowfunc($certificate_of_pre_qualification,showtag);
        },
        _onDealer: function(ev) {
            var dealer = $('#dealer');

            if(dealer.val() == 'yes'){
                $("#principal_name").removeAttr('disabled');
                // $("#principal_name").attr('required', 'required');    //turns required on

            } else if(dealer.val() == 'no'){
                $("#principal_name").attr('disabled','true');
            }
        },
        _clearBoolean: function(){
            // Deselect Boolean and file
                // $('#companyprofile').prop('checked', false); // Unchecks it
                // $('#productlist').prop('checked', false); // Unchecks it
                // $('#bankStatement').prop('checked', false); // Unchecks it
                $('#stamp_paper').prop('checked', false); // Unchecks it
                $('#toolsplants').prop('checked', false); // Unchecks it
                $('#incomeTaxReg').prop('checked', false); // Unchecks it
                $('#saletax').prop('checked', false); // Unchecks it
                $('#eobi').prop('checked', false); // Unchecks it
                $('#certificate_of_pre_qualification').prop('checked', false); // Unchecks it


                // $("#profileUpload").val(null); // set it null
                // $('#profileUpload').siblings(".custom-file-label").html('Select Profile');

                // $("#productUpload").val(null); // set it null
                // $("#productUpload").siblings(".custom-file-label").html('Select Product List');

                // $("#bankStatementUpload").val(null); // set it null
                // $("#bankStatementUpload").siblings(".custom-file-label").html('Select Bank Statement');

                $("#stamp_paperUpload").val(null); // set it null
                $("#stamp_paperUpload").siblings(".custom-file-label").html('Select File');

                $("#toolsplantsUpload").val(null); // set it null
                $("#toolsplantsUpload").siblings(".custom-file-label").html('Select File');


                $("#incomeTaxRegUpload").val(null); // set it null
                $("#incomeTaxRegUpload").siblings(".custom-file-label").html('Select File');

                $("#saletaxUpload").val(null); // set it null
                $("#saletaxUpload").siblings(".custom-file-label").html('Select Certificate');

                $("#eobiUpload").val(null); // set it null
                $("#eobiUpload").siblings(".custom-file-label").html('Select Certificate');

                $("#certificate_of_pre_qualificationUpload").val(null); // set it null
                $("#certificate_of_pre_qualificationUpload").siblings(".custom-file-label").html('Select Certificate');


        },

        _onSelectCountry: function(ev) {
            if($('#selectcountry').val() == 'Pakistan'){

                // set Qualify
                $("#list_quali_type").val('qualified'); // set it null


                $("#gstid").val(null); // set it null
                $("#GSTUpload").val(null); // set it null
                $("#GSTUpload").siblings(".custom-file-label").html('Select GST');

                $("#ntnid").val(null); // set it null
                $("#NTNUpload").val(null); // set it null
                $("#NTNUpload").siblings(".custom-file-label").html('Select NTN');


                $("#country_gst_ntn_detail").css('display','flex');


                $("#GSTFileOption").css('display','block');
                $("#NTNFileOption").css('display','block');

                $("#texid").css('display','none');
                $("#taxid").val(null); // set it null

                $(".local-hide").css('display','inline-block');
            } else{

                // set Qualify
                $("#list_quali_type").val('listed'); 



                // $("#country_gst_ntn_detail").css('display','none');
                $("#country_gst_ntn_detail").hide();


                $("#GSTFileOption").css('display','none');

                $("#gstid").val(null); // set it null
                $("#GSTUpload").val(null); // set it null
                $("#GSTUpload").siblings(".custom-file-label").html('Select GST');


                $("#NTNFileOption").css('display','none');
                $("#ntnid").val(null); // set it null
                $("#NTNUpload").val(null); // set it null
                $("#NTNUpload").siblings(".custom-file-label").html('Select NTN');

                $(".local-hide").css('display','none');
                $("#texid").css('display','flex');


                this._clearBoolean()


            }
        },

        _onlistedQualified: function() {
            var listedQualified = document.getElementsByName("listedQualified");
            for(var i = 0; i < listedQualified.length; i++){
                if (listedQualified[i].checked == true) {
                    var checkedValue = listedQualified[i]
                }
            }
            var sales_tax_status = $('input[type="radio"][class="sales_tax_status"]:checked').val(); 
            var list_quali_type = $('#list_quali_type').val()

            // if(checkedValue.value == 'qualified'){
            if(list_quali_type== 'qualified'){
                $("#qualified_section").css('display','flex');
                

            } else if(list_quali_type == 'listed'){
                $("#qualified_section").css('display','none');



                $('#companyprofile').prop('checked', false); // Unchecks it
                $('#productlist').prop('checked', false); // Unchecks it
                $('#stamp_paper').prop('checked', false); // Unchecks it
                $('#toolsplants').prop('checked', false); // Unchecks it
                $('#bankStatement').prop('checked', false); // Unchecks it
                $('#incomeTaxReg').prop('checked', false); // Unchecks it
                $('#saletax').prop('checked', false); // Unchecks it
                $('#eobi').prop('checked', false); // Unchecks it
                $('#certificate_of_pre_qualification').prop('checked', false); // Unchecks it


                $("#profileUpload").val(null); // set it null
                $('#profileUpload').siblings(".custom-file-label").html('Select Profile');

                
                $("#productUpload").val(null); // set it null
                $("#productUpload").siblings(".custom-file-label").html('Select Product List');

                $("#stamp_paperUpload").val(null); // set it null
                $("#stamp_paperUpload").siblings(".custom-file-label").html('Select File');

                $("#toolsplantsUpload").val(null); // set it null
                $("#toolsplantsUpload").siblings(".custom-file-label").html('Select File');

                $("#bankStatementUpload").val(null); // set it null
                $("#bankStatementUpload").siblings(".custom-file-label").html('Select Bank Statement');

                $("#incomeTaxRegUpload").val(null); // set it null
                $("#incomeTaxRegUpload").siblings(".custom-file-label").html('Select File');

                $("#saletaxUpload").val(null); // set it null
                $("#saletaxUpload").siblings(".custom-file-label").html('Select Certificate');
                
                $("#eobiUpload").val(null); // set it null
                $("#eobiUpload").siblings(".custom-file-label").html('Select Certificate');

                $("#certificate_of_pre_qualificationUpload").val(null); // set it null
                $("#certificate_of_pre_qualificationUpload").siblings(".custom-file-label").html('Select Certificate');



            }
        },
        _onVendorImage: function() {
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
            var previewid = $('#GSTUpload').attr("data-previewId");
            self.readURL(input,previewid);
        },

        _onNTNUpload: function() {
            // data-previewId
            var input = document.querySelector('input[id="NTNUpload"]');
            var previewid = $('#NTNUpload').attr("data-previewId");
            this.readURL(input,previewid);
        },
        _InputFileName: function(ev) {
            var fileName = ev.target.files[0].name
            var id = ev.target.id
            $('#'+id).siblings(".custom-file-label").addClass("selected").html(fileName);
        },
        _onEmail_available_check: function(ev) {
            var email = $('#email').val()
            var error_msg_email = document.querySelector("#error-msg-email");

            ajax.jsonRpc("/check/mail", 'call', {'email': email}).then(function(data) {

                if (data == true) {
                    error_msg_email.classList.remove("hide");
                    $('#email').css('color', 'red');
                    $('#error-msg-email').css('color', 'red');
                    $('#email').css('border-bottom', '1px solid red');

                } else {
                    error_msg_email.classList.add("hide");
                    $('#error-msg-email').css('color', 'red');
                    $('#email').css('color', 'black');
                    if ($('#email').val() != ''){
                        $('#email').css('border-bottom', '1px solid black');
                    }else{
                        $('#email').css('border-bottom', '1px solid #ced4da');
                      }
            }});
        },

        
    });
        
});