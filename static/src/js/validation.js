
$(document).ready(function() {
    $("#frm_custom_vendor_request").submit(function(e) { //regF is form id
        
        var phone = $('#phone')
		var email = $('#email')
		var password = $('#password')
		var c_password = $('#c_password')
		var company_name = $('#company_name')
		var list_quali_type = $('#list_quali_type')
		var service_provider = $('#service_provider')
		var dealer = $('#dealer')
		var principal_name = $('#principal_name')
		var work_experience = $('#work_experience')

		// var income_tax_filing_status = document.getElementsByName("income_tax_filing_status");
		var income_tax_filing_status = $('input[type="radio"][class="income_tax_filing_status"]:checked').val(); 
		var sales_tax_status = $('input[type="radio"][class="sales_tax_status"]:checked').val(); 
       
		var num_of_employee = $('#num_of_employee')
		var gstid = $('#gstid')
		var ntnid = $('#ntnid')

		// checkbox
		var companyprofile = $('#companyprofile')
		var productlist = $('#productlist')
		var stamp_paper = $('#stamp_paper')
		var toolsplants = $('#toolsplants')
		var bankStatement = $('#bankStatement')
		var incomeTaxReg = $('#incomeTaxReg')
		var saletax = $('#saletax')
		var eobi = $('#eobi')
		var certificate_of_pre_qualification = $('#certificate_of_pre_qualification')
		

		var city = $('#city')
		var state_id = $('#state_id')
		var selectcountry = $('#selectcountry')

		if(!phone.val()) {
			alert("Please Fill Phone");
			phone.focus()
			return false;
		}
		else if(!email.val()) {
			alert('Please Fill email.')
			email.focus()
			return false;
		}
		else if(!password.val()) {
			alert('Please Fill Password.')
			password.focus()
			return false;
		}
		else if(!c_password.val()) {
			alert('Please Fill up Confirm Password.')
			c_password.focus()
			return false;
		}
		else if(!company_name.val()) {
			alert('Please Fill up Company Name.')
			company_name.focus()
			return false;
		}
		else if(!city.val()) {
			alert('Please Fill up City.')
			city.focus()
			return false;
		}
		else if(!state_id.val()) {
			alert('Please Fill up State.')
			state_id.focus()
			return false;
		}
		else if(!selectcountry.val()) {
			alert('Please Fill up Country.')
			selectcountry.focus()
			return false;
		}
		else if(!list_quali_type.val()) {
			alert('Please Fill up Type.')
			list_quali_type.focus()
			return false;
		}
		else if(service_provider.val().length == 0) {
			alert('Please Fill up Material / Service Provider.')
			service_provider.focus()
			return false;
		}
		else if(!dealer.val()) {
			alert('Please Fill up Authorized Dealer/Representative.')
			dealer.focus()
			return false;
		}
		else if(!principal_name.val() && dealer.val() == 'yes') {
			alert('Please Fill up Principal\'s Name.')
			principal_name.focus()
			return false;
		}
		else if(!work_experience.val()) {
			alert('Please Fill up Work Experience.')
			work_experience.focus()
			return false;
		}
		else if(!income_tax_filing_status) {
			alert('Please Fill up Income Tax Filing Status.')
			income_tax_filing_status.focus()
			return false;
		}	
		else if(!sales_tax_status) {
			alert('Please Fill up Sales Tax Status.')
			sales_tax_status.focus()
			return false;
		}
		else if(!num_of_employee.val()) {
			alert('Please Fill up Number of Employees.')
			num_of_employee.focus()
			return false;
		}
		else if(!gstid.val() && selectcountry.val() == 'Pakistan') {
			alert('Please Fill up GST.')
			gstid.focus()
			return false;
		}
		else if(!ntnid.val() && selectcountry.val() == 'Pakistan') {
			alert('Please Fill up NTN.')
			ntnid.focus()
			return false;
		}		
		else if(!companyprofile.is(":checked")) {
			alert('Please Check Company Profile.')
			$("#profileUpload").focus()
			$("#profileUpload").attr('required', 'required');    //turns required on

			return false;
		}	
		else if(!productlist.is(":checked")) {
			alert('Please Check Product List.')
			$("#productUpload").attr('required', 'required');    //turns required on
			$("#productUpload").focus()
			return false;
		}
		else if(!stamp_paper.is(":checked") && selectcountry.val() == 'Pakistan') {
			alert('Please Check Undertaking on Stamp paper for not being Blacklisted (For Local).')
			$("#stamp_paperUpload").attr('required', 'required');    //turns required on
			$("#stamp_paperUpload").focus()
			return false;
		}
		else if(!toolsplants.is(":checked") && selectcountry.val() == 'Pakistan') {
			alert('Please Check List of Tools Plants / Assets Owned with Approx Value (For Local).')
			$("#toolsplantsUpload").attr('required', 'required');    //turns required on
			$("#toolsplantsUpload").focus()
			return false;
		}
		else if(!bankStatement.is(":checked")) {
			alert('Please Check Bank Statement (For Last 06 Months).')
			$("#bankStatementUpload").attr('required', 'required');    //turns required on
			$("#bankStatementUpload").focus()

			return false;
		}	
		else if(!incomeTaxReg.is(":checked") && selectcountry.val() == 'Pakistan') {
			alert('Please Check Income Tax Registration Certificate(For Local).')
			$("#incomeTaxRegUpload").attr('required', 'required');    //turns required on
			$("#incomeTaxRegUpload").focus()
			return false;
		}	
		else if(!saletax.is(":checked") && selectcountry.val() == 'Pakistan') {
			alert('Please Check Sales Tax Certificate (For Local).')
			$("#saletaxUpload").attr('required', 'required');    //turns required on
			$("#saletaxUpload").focus()
			return false;
		}		
		else if(!eobi.is(":checked") && selectcountry.val() == 'Pakistan') {
			alert('Please Check EOBI Certificate (For Local).')
			$("#eobiUpload").attr('required', 'required');    //turns required on
			$("#eobiUpload").focus()

			return false;
		}	
		else if(!certificate_of_pre_qualification.is(":checked") && selectcountry.val() == 'Pakistan') {
			alert('Please Check Certificate of Pre-Qualification with Other Organization / Concerns.')
			$("#certificate_of_pre_qualificationUpload").attr('required', 'required');    //turns required on
			$("#certificate_of_pre_qualificationUpload").focus()
			return false;
		}		
		else{
			$('#custom_vendor_request').submit();
			return true;
		}

        e.preventDefault(e);
    });
});