
		var counter = 0;
		var iwcClient = null;
		var epURL = "http://localhost:8081/";
		var client = new TemplateServiceClient(epURL);

		var currentAppId = null;

			// Handler when the form in "Add New Badge" is submitted
		var badgeTabHandler = (function() {
			getBadgesData();
			$("form#addbadgeform").submit(function(e){
				//disable the default form submission
				e.preventDefault();
				var formData = new FormData($(this)[0]);

				currentAppId = Cookies.get("appid");
				client.sendRequest(
					"POST",
					"badges/items/"+currentAppId,
					formData,
					false,
					{},
					function(data, type){
						console.log(data);
						$("#addbadgediv").modal('toggle');

						reloadActiveTab();

					    // Add alert before table
						//$('#list_badges').before('<div class="alert alert-success"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>New Badge Successfully Added</div>');
						return false;
					},
					function(error) {
					      // this is the error callback
					      console.log(error);
					      					    // Add alert before table
						//$('#list_badges').before('<div class="alert alert-danger"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>Badge Cannot Be Added</div>');
						return false;
					}
				);
				return false;
				});

				$("form#updatebadgeform").submit(function(e){
				//disable the default form submission
					e.preventDefault();
					var formData = new FormData($(this)[0]);
					currentAppId = Cookies.get("appid");
					var badgeid = $("#updatebadgediv").find("#badge_id_name").attr("value");
					console.log(badgeid);
					client.sendRequest(
						"PUT",
						"badges/items/"+currentAppId+"/"+badgeid,
						formData,
						false,
						{},
						function(data, type){
							console.log(data);
							$("#updatebadgediv").modal('toggle');

							reloadActiveTab();

						    // Add alert before table
							//$('#list_badges').before('<div class="alert alert-success"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>New Badge Successfully Added</div>');
							return false;
						},
						function(error) {
						      // this is the error callback
						      					    // Add alert before table
							//$('#list_badges').before('<div class="alert alert-danger"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>Badge Cannot Be Added</div>');
							return false;
						}
					);
					return false;
				});

		});

		function loadMainContentCallback(){
			currentAppId = Cookies.get('appid');
			var texthtml = currentAppId+"<b class='caret'></b>";
			$("#apptitle").html(texthtml);
			$("#backtoappselection").show();
			console.log(currentAppId);
			mainContentHandler();	
		}

		// Dynamically load contents
		var mainContentHandler = (function() {
			$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
			  var target = $(e.target).attr("href") // activated tab
			  
			  	switch(target) {
				    case "#hometab":
				    	$("#menucontent").load("dashboard.html", pointTabHandler);
				        break;
				    case "#pointtab":
				    	$("#menucontent").load("point.html", pointTabHandler);
				        break;
				    case "#badgetab":
				    	$("#menucontent").load("badge.html", badgeTabHandler);
				        break;
				    case "#achievementtab":
				    	$("#menucontent").load("achievement.html", pointTabHandler);
				        break;
				    case "#questtab":
				    	$("#menucontent").load("quest.html", pointTabHandler);
				        break;
				     case "#leveltab":
				    	$("#menucontent").load("level.html", pointTabHandler);
				        break;
				     case "#leaderboardtab":
				    	$("#menucontent").load("leaderboard.html", pointTabHandler);
				        break;
				}
			});


			$('#backtoappselection').on('click', function(event) {
				//$(this).addClass('active').siblings().removeClass('active');
				//Get Value in appidid
				Cookies.remove('appid');
				console.log("a");
				showAppSelection(true);
				getApplicationsData();
				
			});
		});



		function showMainContent(isShown){
			if(isShown == true){

				$("#maincontent").show();
				$("#appselection").hide();

				//$("#settingbutton").show();
				//$("#innerheader").show();
				showLoginView(false);
				$("#maincontent").load("maincontent.html",loadMainContentCallback); 	
					
			}
			else
			{
				$("#maincontent").hide();
				$("#innerheader").hide();
			}
		}

		var showLoginView = function(isShown){
			if(isShown == true){
				$("#loginview").show();
				$("#headerbutton").hide();
				showMainContent(false);
				showAppSelection(false);
			}
			else
			{
				$("#loginview").hide();
				$("#headerbutton").show();
			}
			
		};
		var showAppSelection = function(isShown){
			if(isShown == true){
				$("#appselection").show();
				showMainContent(false);
				showLoginView(false);
				// Hide app id name and go to app selection option
				var texthtml = "App ID<b class='caret'></b>";
				$("#apptitle").html(texthtml);
				$("#backtoappselection").hide();
				//$("#settingbutton").show();
			}
			else
			{
				$("#appselection").hide();
			}
			
		};

		function signinCallback(result) {
		    if(result === "success"){
		        // after successful sign in, display a welcome string for the user
		        $("#status").html("Hello, " + oidc_userinfo.name + "!");
		        
		        console.log(oidc_userinfo)

		        checkAndRegisterUserAgent();
		        showLoginView(false);

		    } else {
		        // if sign in was not successful, log the cause of the error on the console
		        showAppSelection(false);
		        showMainContent(false);
		        showLoginView(true);

		        // dev
		        // showAppSelection(false);
		        // showMainContent(true);
		        // showLoginView(false);

		        console.log(result);
		    }
		}
		
		function getApplicationsData(){
				client.sendRequest("GET",
	    			"manager/apps",
	    			"",
	    			"application/json",
	    			{},
	    			function(data,type){

	    				console.log(data);
	    				//Global apps
	    				$("#globalappstbody").empty();
			    		for(var i = 0; i < data[0].length; i++){
				    		var appData = data[0][i];
				    		var newRow = "<tr><td id='appidid'>" + appData.id + "</td>";
				    		newRow += "<td id='appnameid'>" + appData.appName + "</td>";
							newRow += "<td id='appcommtypeid'>" + appData.commType + "</td>";
										    	
				    		$("#list_global_apps_table tbody").append(newRow);
				    	}

				    	//User apps
				    	$("#registeredappstbody").empty();
			    		for(var i = 0; i < data[1].length; i++){
				    		var appData = data[1][i];
				    		var newRow = "<tr><td id='appidid'>" + appData.id + "</td>";
				    		newRow += "<td id='appnameid'>" + appData.appName + "</td>";
							newRow += "<td id='appcommtypeid'>" + appData.commType + "</td>";
										    	
				    		$("#list_registered_apps_table tbody").append(newRow);
				    	}

						//Settings modal
						$("#registeredappssettingstbody").empty();
			    		for(var i = 0; i < data[1].length; i++){
				    		var appData = data[1][i];
				    		var newRow = "<tr><td id='appidid' class='appidclass'>" + appData.id + "</td>";
				    		newRow += "<td id='appnameid'>" + appData.appName + "</td>";
							newRow += "<td id='appcommtypeid'>" + appData.commType + "</td>";
							newRow += "<td><button type='button' onclick='removeApplicationHandler(this)' data-dismiss='modal' data-toggle='modal' data-target='#alertremoveapp' class='btn btn-danger bdelclass'>Remove</button></td>";
							newRow += "<td><button type='button' onclick='deleteApplicationHandler(this)' data-dismiss='modal' data-toggle='modal' data-target='#alertdeleteapp' class='btn btn-danger bdelclass'>Delete</button></td>";

				    		$("#list_registered_apps_settings_table tbody").append(newRow);
				    	}



				    	// Stay in Application Selection where there is no specified application selected
				    	currentAppId = Cookies.get('appid');
				    	if(currentAppId == null){
						 	showAppSelection(true);				    		
				    	}
				    	else
				    	{

				    		// Here is the point where user get the main content
				    		showMainContent(true);


				    	}
	    			},
	    			function(error) {
	    		          // this is the error callback

	    				$("#appselection").html("<div class='alert alert-danger'>Cannot Retrieve Applications Data</div>");
	    		          console.log(error);
	    		   }
	    		);

		}

		function removeApplicationHandler(element){
			var selectedappid = element.parentNode.parentNode.getElementsByClassName("appidclass")[0].textContent
			$('#alertremoveapp').find('button.btn').attr('id',selectedappid);
			$('#alertremoveapp_text').text('Are you sure you want to remove ' + selectedappid +"?");
		}
		function deleteApplicationHandler(element){
			var selectedappid = element.parentNode.parentNode.getElementsByClassName("appidclass")[0].textContent
			$('#alertdeleteapp').find('button.btn').attr('id',selectedappid);
			$('#alertdeleteapp_text').text('Are you sure you want to delete ' + selectedappid +"?");
		}

		function removeApplicationAlertHandler(){
			console.log('clicked');
			currentAppId = Cookies.get('appid');
			var selectedappid = $('#alertremoveapp').find('button.btn').attr('id');
			client.sendRequest("DELETE",
    			"manager/apps/"+selectedappid+"/"+oidc_userinfo.name,
    			"",
    			"application/json",
    			{},
    			function(data,type){
    				// opened app is the selected app
    				if(selectedappid == currentAppId){
	    				Cookies.remove('appid');
	    				showMainContent(false);
	    				showAppSelection(true);
	    				window.location;
    				}
    				else{
    					
	    				getApplicationsData();
    				}
    				console.log(data);
    			},
    			function(error) {
    		          // this is the error callback
		          console.log(error);
		        }
    		);
    		//$('#innerheader').before('<div class="alert alert-success"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>App Removed!</div>');
			
			$("#alertremoveapp").modal('toggle');	
		}


		function deleteApplicationAlertHandler(){
			console.log('clicked');
			currentAppId = Cookies.get('appid');
			var selectedappid = $('#alertdeleteapp').find('button.btn').attr('id');
			client.sendRequest("DELETE",
    			"manager/apps/"+selectedappid,
    			"",
    			"application/json",
    			{},
    			function(data,type){
    				// opened app is the selected app
    				if(selectedappid == currentAppId){
	    				Cookies.remove('appid');
	    				showMainContent(false);
	    				showAppSelection(true);
	    				window.location;

						// Notification
						$.notify(selectedAppId + " Deleted", "success");
    				}
    				else{

	    				getApplicationsData();
    				}
    				console.log(data);
    			},
    			function(error) {
    		          // this is the error callback
		          console.log(error);
		        }
    		);
    		//$('#innerheader').before('<div class="alert alert-success"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>App Deleted!</div>');
			
			$("#alertdeleteapp").modal('toggle');	
		}

		function checkAndRegisterUserAgentCallback(data,type){
			console.log(data);
			if(data.valid){
				getApplicationsData();
			}
			else{
				showAppSelection(false);
				//$('#appselection').before('<div class="alert alert-warning"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>'+data.message+'</div>');
			}
	    			
		}

		function checkAndRegisterUserAgent(){
			client.sendRequest("GET",
	    			"manager/validation",
	    			"",
	    			"application/json",
	    			{},
	    			checkAndRegisterUserAgentCallback,
	    			function(error) {
	    		        $('#appselection').before('<div class="alert alert-danger">Error connecting web services</div>');

	    		          console.log(error);
	    		    }
	    		);
		}

//--------------------------- Badges -------------------------------//		
		function showImageOnChangeUpdate(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();

            reader.onload = function (e) {
                $('#badgeimageinmodalupdate')
                    .attr('src', e.target.result)
                    .width(200)
                    .height(200);
            };

            reader.readAsDataURL(input.files[0]);
        	}
    	}

    	function showImageOnChangeAdd(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();

            reader.onload = function (e) {
                $('#badgeimageinmodaladd')
                    .attr('src', e.target.result)
                    .width(200)
                    .height(200);
            };

            reader.readAsDataURL(input.files[0]);
        	}
    	}


    	function callbackBadges(data,type){
    		console.log(data);
			for(var i = 0; i < data.length; i++){
	    		var badge = data[i];
	    		var newRow = "<tr><td class='bidclass' id='"+i+"'>" + badge.id + "</td>";
	    		newRow += "<td class='bnameclass' id='"+i+"'>" + badge.name + "</td>";
				newRow += "<td class='bdescclass' id='"+i+"'>" + badge.description + "</td>";
				//newRow += "<td><button id='" + i + "' type='button' onclick='viewBadgeImageHandler(this,0)' class='btn btn-info bimgclass' name='"+ badge.imagePath +"' data-toggle='modal' data-target='#modalimage'>View Image</button></td>";
				newRow += "<td><img class='badgeimage' src='"+ getBadgeImage(badge.id,badge.imagePath) +"' alt='your image' /></td>";
				newRow += "<td>" + "<button id='" + i + "' type='button' onclick='updateBadgeHandler(this)' class='btn btn-warning bupdclass' data-toggle='modal' data-target='#updatebadgediv'>Update</button> ";
				newRow += "<button id='" + i + "' type='button' onclick='deleteBadgeHandler(this)' class='btn btn-danger bdelclass'>Delete</button></td>";
	    		
	    		$("#badgetbody").append(newRow);
	    	}
    	}

		// Handler when the Badges tab is selected. Retrieve all badges data
    	function getBadgesData(){
    		$("#badgetbody").empty();
    		var currentAppId = Cookies.get("appid");
    		console.log(currentAppId);
	    	client.sendRequest("GET",
	    			"badges/items/"+currentAppId,
	    			"",
	    			"application/json",
	    			{},
	    			callbackBadges,
	    			function(error) {
	    				//$('#list_badges').before('<div class="alert alert-success"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>New Badge Successfully Added</div>');
							
	    				$("#list_badges").html("<div class='alert alert-danger'>Cannot Retrieve Badges Data</div>");
	    		          // this is the error callback
	    		        console.log(error);
	    		    }
	    		);
	    }

		// Handler when view image button in the row table for a badge is pressed
		 //    function viewBadgeImageHandler(element,code){

		 //    		//reset element
		 //    		$("#modalimageshow").attr('src','');
		 //    		$("#badgeimageinmodalupdate").attr('src','');
			// 		var badgeid = element.parentNode.parentNode.getElementsByClassName("bidclass")[0].textContent
			// 		console.log(badgeid);
			// 		currentAppId = Cookies.get("appid");

			// 		if(!client.isAnonymous()){
			// 			console.log("Authenticated request");
			// 			var rurl = epURL + "badges/items/"+currentAppId+"/" + badgeid + "/img";
						
			// 			if(rurl.indexOf("\?") > 0){	
			// 				rurl += "&access_token=" + window.localStorage["access_token"];
			// 			} else {
			// 				rurl += "?access_token=" + window.localStorage["access_token"];
			// 			}
			// 			if(code==0){
			// 				$("#modalimageshow").attr('src',rurl);
			// 			}
			// 			if(code==1){
			// 				$("#badgeimageinmodalupdate").attr('src',rurl);
			// 			}
			// 		} else {
			// 			console.log("Anonymous request... ");
			// 		}
					
			// }

			function getBadgeImage(badgeid,imagepath){

	    		//reset element
	   //  		$("#modalimageshow").attr('src','');
	   //  		$("#badgeimageinmodalupdate").attr('src','');
				// var badgeid = element.parentNode.parentNode.getElementsByClassName("bidclass")[0].textContent
				console.log(badgeid);
				currentAppId = Cookies.get("appid");

				if(!client.isAnonymous()){
					console.log("Authenticated request");
					var rurl = epURL + "badges/items/"+currentAppId+"/" + badgeid + "/img";
					
					if(rurl.indexOf("\?") > 0){	
						rurl += "&access_token=" + window.localStorage["access_token"];
					} else {
						rurl += "?access_token=" + window.localStorage["access_token"];
					}
					return rurl;
				} else {
					console.log("Anonymous request... ");
					return null;
				}
				
		}

		// Handler when update button in the row table for a badge is pressed
		function updateBadgeHandler(element){

				// $(".bimgclass").on('click', function(e){
				//e.preventDefault();
				var badgeid = element.parentNode.parentNode.getElementsByClassName("bidclass")[0].textContent
				var badgename = element.parentNode.parentNode.getElementsByClassName("bnameclass")[0].textContent
			    var badgedesc = element.parentNode.parentNode.getElementsByClassName("bdescclass")[0].textContent
			    // var badge_imgSrc = $(bimgclass).attr("name");
				viewBadgeImageHandler(element,1);
				currentAppId = Cookies.get("appid");
				var path_URI = "badges/items/"+currentAppId+"/" + badgeid + "/img";
				$("#updatebadgediv").find("#badge_id_name").attr("value",badgeid);
			     $("#updatebadgediv").find("#badge_name").attr("value",badgename);
			     $("#updatebadgediv").find("#badge_desc").text(badgedesc);
			     $("#updatebadgediv").find("#badgeimageinmodal").attr("src",epURL+path_URI);
			// });
		}

		// Handler when delete button in the row table for a badge is pressed
		 function deleteBadgeHandler(element){

				// $(".bimgclass").on('click', function(e){
				//e.preventDefault();
				var badgeid = element.parentNode.parentNode.getElementsByClassName("bidclass")[0].textContent
				

				currentAppId = Cookies.get("appid");
				var path_URI = "badges/items/"+currentAppId+"/" + badgeid;
	    		client.sendRequest("DELETE",
	    			path_URI,
	    			"",
	    			false,
					{},
	    			function(data, type){
						console.log(data);
						reloadActiveTab();
					    // Add alert before table
						//$('#list_badges').before('<div class="alert alert-success"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>Delete Success</div>');
						return false;
					},
	    			function(error) {
	    		          // this is the error callback
	    		          console.log(error);
	    		    }
	    		);
			// });
		}

		// Called when we want to reload the active tab
		function reloadActiveTab(){
			//reload active tab
			var $link = $('li.active a[data-toggle="tab"]');
		    $link.parent().removeClass('active');
		    var tabLink = $link.attr('href');
		    $('#gamemenutab a[href="' + tabLink + '"]').tab('show');
		}

		$(function() {
			$.notify.defaults(
			{
				arrowShow: false,
				globalPosition: 'top center'
			});
			
			//$("#settingbutton").hide();
//--------------------------- Application selection -------------------------------//
			// Handler when the form in "Create New App" is submitted
			// App ID will be retrieved from the service and will be put on the id attribute in class maincontent
			$("form#createnewappform").submit(function(e){
				//disable the default form submission
				e.preventDefault();
				var formData = new FormData($(this)[0]);
				client.sendRequest(
					"POST",
					"manager/apps",
					formData,
					false,
					{},
					function(data, type){
						console.log(data);
						var selectedAppId = $("#createnewapp_appid").val();
						
						Cookies.set('appid', selectedAppId);
						showMainContent(true);
						//$('#innerheader').before('<div class="alert alert-success"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>New App Created!</div>');

						$("#createnewapp").modal('toggle');

						// Notification
						$.notify("New Application " + selectedAppId + " Created", "success");

						return false;
					},
					function(error) {
					      // this is the error callback
					      console.log(error);
					      					    // Add alert before table
						//$('#appselection').before('<div class="alert alert-danger"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>New App Cannot Be Created</div>');
					}
				);
				return false;
			});
			
			$('#list_global_apps_table').on('click','tbody tr', function(event) {
				//$(this).addClass('active').siblings().removeClass('active');
				//Get Value in appidid
				var selectedAppId = $(this).find("td#appidid")[0].textContent;
				$('#alertglobalapp_text').text('Are you sure you want to open ' + selectedAppId +"?. You will be registered to selected application.");
				$('#alertglobalapp').find('button').attr('id',selectedAppId);
				$("#alertglobalapp").modal('toggle');
			});

			$('#alertglobalapp').find('button.btn').on('click', function(event) {

				Cookies.set('appid',$(this).attr('id'));
				currentAppId = Cookies.get('appid')
				//$('#innerheader').before('<div class="alert alert-success"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>Welcome to '+currentAppId+' !</div>');
				$("#alertglobalapp").modal('toggle');

				// Store user to app
				client.sendRequest("GET",
	    			"manager/apps/"+currentAppId,
	    			"",
	    			"application/json",
	    			{},
	    			function(data,type){
	    				console.log(data);
	    			},
	    			function(error) {
	    		          // this is the error callback
	    		          console.log(error);
	    		        }
	    		);
				showMainContent(true);
			});

			$('#list_registered_apps_table').on('click','tbody tr', function(event) {
				//$(this).addClass('active').siblings().removeClass('active');
				//Get Value in appidid
				var selectedAppId = $(this).find("td#appidid")[0].textContent;
				$('#alertregisteredapp_text').text('Are you sure you want to open ' + selectedAppId +"?");
				$('#alertregisteredapp').find('button').attr('id',selectedAppId);
				$("#alertregisteredapp").modal('toggle');
			});

			$('#alertregisteredapp').find('button.btn').on('click', function(event) {

				Cookies.set('appid',$(this).attr('id'));
				currentAppId = Cookies.get('appid')

				// Notification
				$.notify("Welcome to" + currentAppId + " !", "success");
				//$('#innerheader').before('<div class="alert alert-success"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>Welcome to '+currentAppId+' !</div>');
				$("#alertregisteredapp").modal('toggle');

				showMainContent(true);
			});



			
			// $('#settingbutton').on('click', function(event) {
			// 	client.sendRequest("GET",
	  //   			"manager/apps",
	  //   			"",
	  //   			"application/json",
	  //   			{},
	  //   			function(data,type){
	  //   				$("#registeredappssettingstbody").empty();
			//     		for(var i = 0; i < data.length; i++){
			// 	    		var appData = data[i];
			// 	    		var newRow = "<tr><td id='appidid'>" + appData.id + "</td>";
			// 	    		newRow += "<td id='appnameid'>" + appData.appName + "</td>";
			// 				newRow += "<td id='appcommtypeid'>" + appData.commType + "</td>";
							
										    	
			// 	    		$("#list_global_apps_table tbody").append(newRow);
			// 	    	}

			// 	    	// Stay in Application Selection where there is no specified application selected
			// 	    	currentAppId = Cookies.get('appid');
			// 	    	if(currentAppId == null){
			// 			 	showAppSelection(true);				    		
			// 	    	}
			// 	    	else
			// 	    	{

			// 	    		// Here is the point where user get the main content
			// 	    		showMainContent(true);


			// 	    	}
	  //   			},
	  //   			function(error) {
	  //   		          // this is the error callback
	  //   		          console.log(error);
	  //   		        }
	  //   		);
			// });


			
//--------------------------- Badges -------------------------------//
			// // Buttons in Badge
			// $(".bupdclass").on('click', function(e){
   //          	e.preventDefault();
   //               var id = this.id;

			//      var bidclass = "#"+id+".bidclass";
			//      var bnameclass = "#"+id+".bnameclass";
			//      var bdescclass = "#"+id+".bdescclass";
			//      var bimgclass = "#"+id+".bimgclass";

			     
			//      // console.log(bidclass)
			//      // console.log(bnameclass)
			//      // console.log(bdescclass)
			//      // console.log(bimgclass)

			//      var badge_id = $(bidclass).text();
			//      var badge_name = $(bnameclass).text();
			//      var badge_desc = $(bdescclass).text();
			//      var badge_imgSrc = $(bimgclass).attr("name");


			//      // alert(badge_id);
			//      // alert(badge_name);
			//      // alert(badge_desc);
			//      // alert(badge_imgSrc);
			//      $("#updatebadgediv").find("#badge_id_name").attr("value",badge_id);
			//      $("#updatebadgediv").find("#badge_name").attr("value",badge_name);
			//      $("#updatebadgediv").find("#badge_desc").text(badge_desc);
			//      $("#updatebadgediv").find("#badgeimage").attr("src",badge_imgSrc);
			// });



//-------
		});

		$(document).ready(init());
		