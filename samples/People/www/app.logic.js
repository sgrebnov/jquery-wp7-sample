
/* 

TODO 
1. move all hardcoded styles to corresponding css
2. all wp7-related styles to special wp7 theme

*/

// specifies whether we retrieve real data from device or use some dummy generated information
var useDummyData = false;

//-------------------------------------------------------------------------
// Contacts
//-------------------------------------------------------------------------
function getContacts(showGroupTag) {

    if (useDummyData) {

        var contacts = new Array();

        for (var i = 0; i < 10; i++) {

            var obj = new Object();
            obj.displayName = 'John Smith';
            obj.name = 'John Smith';
            obj.phoneNumbers = new Array();
            obj.emails = new Array();
            obj.urls = new Array();
            obj.note = 'Some note';
            contacts[i] = JSON.stringify(obj);
        }

        updateContactsList(contacts, showGroupTag);

        return;
    }


    obj = new ContactFindOptions();
    obj.filter = ""; //Brooks";
    obj.multiple = true;

    navigator.contacts.find(["displayName", "name", "phoneNumbers", "emails", "urls", "note"],
		    function (contacts) {
		        updateContactsList(contacts, showGroupTag);
		    },
			function (e) {
			    document.getElementById('contacts_results').innerHTML = "Error: " + e.code;
			},
		    obj);
};

function updateContactsList(contacts, showGroupTag) {

    var s = "";

    //jQuery list items
    var list = '';


    if (typeof showGroupTag !== 'undefined') {
        list += '<li role="option" tabindex="0"  class="ui-btn ui-li ui-btn-up-a contact-list-li"><div class="contact-list-container">'
							 + '<span class="contact-list-all-item">all</span></div></li>';
        list += '<li role="option" tabindex="0"  class="contact-list-li"><div class="contact-list-Me-item-container"><span class="contact-list-Me-item">Me</span></div></li>';





        list += '<li role="option" tabindex="0"  class="ui-btn ui-li ui-btn-up-a contact-list-li"><div class="contact-list-container">'
							 + '<span class="contact-list-Family-item">Family</span></div></li>';
    }


    //jQuery contacts photo
    var imgSrc = '';

    if (contacts.length == 0) {
        s = "No contacts found";
    }
    else {
        s = "Number of contacts: " + contacts.length + "<br><table width='100%'><tr><th>Name</th><td>Phone</td><td>Email</td></tr>";

        var firstLetter = '';

        for (var i = 0; i < contacts.length; i++) {

            try {
                var contact = JSON.parse(contacts[i]);
            }
            catch (e) {
                console.log(e.message + " " + contacts[i]);
                continue;
            }
            s = s + "<tr><td>" + contact.displayName + "</td><td>";

            if (contact.phoneNumbers && contact.phoneNumbers.length > 0) {
                s = s + contact.phoneNumbers[0];
            }
            s = s + "</td><td>"

            if (contact.emails && contact.emails.length > 0) {
                s = s + contact.emails[0];
            }
            s = s + "</td></tr>";

            //jQuery add divider if needed
            if (typeof showGroupTag !== 'undefined' && firstLetter != contact.displayName.charAt(0)) {
                firstLetter = contact.displayName.charAt(0);
                list += '<li data-role="list-divider"><div class="contact-list-divider-container"><span class="contact-list-divider-item">' + firstLetter.toLowerCase() + '</span></div></li>';
            }


            if (i % 2 === 1) {
                imgSrc = 'avatar1.jpg';
            } else {
                imgSrc = 'avatar2.jpg';
            }
            var contactPhoto = '<img class="contact-list-photo" src="' + imgSrc + '">';

            var contactDetails = '<ul data-role="listview" data-theme="d" style="height:700px;">' +
				        '<li style="padding:15px;"><span style="color:#ffffff;font-size:17px;font-family:Segoe WP;">' + contact.displayName.toUpperCase() + '</span><br/><span style="color:grey;font-size:16px;font-family:Segoe WP;">Windows Life</span></li>' +
                        '<li style="padding:15px;"><span style="color:#ffffff;font-size:47px;font-family:Segoe WP Light;">profile</span>&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:grey;font-size:47px;font-family:Segoe WP Light;">history</span></li>' +
                        '<li style="padding:15px;"><span style="color:#ffffff;font-family:Segoe WP;font-size:25px;font-weight:normal;">call work</span><br/><span style="color:red;font-size:15px;font-family:Segoe WP;">' + contact.phoneNumbers[0] + '</span></li>' +
				        '<li style="padding:15px;"><span style="color:#ffffff;font-family:Segoe WP;font-size:25px;font-weight:normal;">send email</span><br/><span style="color:red;font-size:15px;font-family:Segoe WP;">' + contact.emails[0] + '</span></li>' +
                        '<li style="padding:15px;text-align:left;"><span style="color:gray;font-family:Segoe WP;font-size:15px;font-weight:normal;">Please specify the gender</span><br/>' +
                            '<div style="margin:0px;text-align:left;padding:0px;"><span id="gender" name="gender" style="color:#ffffff;font-family:Segoe WP;font-size:18px;font-weight:normal;">Male</span>' +
                            '<select id="genderSwitch" name="genderSwitch" data-role="slider" data-track-theme="e" data-theme="c" style="float:"></div>' +
                            '<option value="off"></option><option value="on"></option></select></li>' +
                        '<li style="padding:15px;padding-bottom:0px;"><a onClick="delteteCallHistory()" href="#" data-inline="true" data-role="button" data-theme="d" data-corners="false" style="margin:0px;padding:0px;">delete call history</a></li>' +
                        '<li style="padding:15px;padding-top:0px;"><span style="color:#ffffff;font-family:Segoe WP;font-size:16px;font-weight:normal;padding-top:0px;margin-top:0px;">Deletes all information about incoming and outcoming calls for this person</span></li>' +
                        '</ul>';

            list += '<li role="option" tabindex="0"  class="ui-btn ui-li ui-btn-up-a contact-list-contact-li"><div class="contact-list-contact-container">'
							 + contactPhoto + '<span class="contact-list-contact-item">' + contact.displayName + '</span></div>' + contactDetails + '</li>';

            deleteHeaderFromNestedListPage();

        }
        s = s + "</table>";

        //jQuery add item to list view
        $("#searchresult").html(list);
        $("#searchresult").listview("refresh");
    }

    document.getElementById('contacts_results').innerHTML = s;
};

function deleteHeaderFromNestedListPage() {

    $('div.ui-page').live('pagebeforeshow', function (event, ui) {

        if (ui.prevPage.length == 0) return;
        if (window.location.search == null || window.location.search.lenght == 0) return;

        return;

        $('.ui-header').addClass('to-remove-now');
        $('.to-remove-now').remove();
    });

}

function delteteCallHistory() {
    var message = "Are you sure?";
    var title = "This functionality hasn't been implemented yet";
    var buttons = "OK,Cancel";
    navigator.notification.confirm(message,
      null,
      title,
      buttons);
}