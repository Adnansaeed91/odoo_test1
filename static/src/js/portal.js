odoo.define('vendor_form.portal', function (require) {
'use strict';

var publicWidget = require('web.public.widget');
var utils = require('web.utils');

var core = require('web.core');
var _t = core._t;

publicWidget.registry.portalDetails = publicWidget.Widget.extend({
    selector: '.o_membership_details',

    events: {
        'change input#imageUpload': '_onVendorImage',
		
    },
    
    init: function () {
        var def = this._super.apply(this, arguments);
        return def;
    },

//    start: function () {
//        var self = this;
//        self._onVendorImage();
//
//    },


    _onVendorImage: function() {
        // data-previewId
        var self = this;

        var previewid = $('#imageUpload').attr("data-previewId");
       
        // alert($("#imageUpload").val())
        // alert(previewid)
        console.log(self)
        self._readURL(self,previewid);
    },


    _readURL: function(input,previewid) {
        //const file = document.querySelector('input[type=file]').files[0];

        console.log(input)
        console.log("========")
	    if (input && input.files[0]) {
            alert(file)
	        var reader = new FileReader();
	        reader.onload = function(e) {
	        	if (previewid == 'GSTPreview') {
	        		$('#GSTPreviewid').addClass('avatar-preview_gst mx-auto mt-1');
	        	}else if (previewid == 'NTNPreview') {
	        		$('#NTNPreviewid').addClass('avatar-preview_gst mx-auto mt-1');
	        	}
                $('#'+previewid).css('background-image', 'url('+e.target.result +')');
                //$('#'+previewid).css('background-image', 'url('+ $(input.val()) +')');
                
	            $('#'+previewid).hide();
	            $('#'+previewid).fadeIn(650);
	        }
	        reader.readAsDataURL(input.files[0]);
	    }
	},
   

    

    
    


   
	

});
});