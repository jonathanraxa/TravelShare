/* BOILDERPLATE CODE FOR HASH CODING */

/*
 * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
 * Digest Algorithm, as defined in RFC 1321.
 * Copyright (C) Paul Johnston 1999 - 2000.
 * Updated by Greg Holt 2000 - 2001.
 * See http://pajhome.org.uk/site/legal.html for details.
 */

/*
 * Convert a 32-bit number to a hex string with ls-byte first
 */
var hex_chr = "0123456789abcdef";
function rhex(num)
{
  str = "";
  for(j = 0; j <= 3; j++)
    str += hex_chr.charAt((num >> (j * 8 + 4)) & 0x0F) +
           hex_chr.charAt((num >> (j * 8)) & 0x0F);
  return str;
}

/*
 * Convert a string to a sequence of 16-word blocks, stored as an array.
 * Append padding bits and the length, as described in the MD5 standard.
 */
function str2blks_MD5(str)
{
  nblk = ((str.length + 8) >> 6) + 1;
  blks = new Array(nblk * 16);
  for(i = 0; i < nblk * 16; i++) blks[i] = 0;
  for(i = 0; i < str.length; i++)
    blks[i >> 2] |= str.charCodeAt(i) << ((i % 4) * 8);
  blks[i >> 2] |= 0x80 << ((i % 4) * 8);
  blks[nblk * 16 - 2] = str.length * 8;
  return blks;
}

/*
 * Add integers, wrapping at 2^32. This uses 16-bit operations internally 
 * to work around bugs in some JS interpreters.
 */
function add(x, y)
{
  var lsw = (x & 0xFFFF) + (y & 0xFFFF);
  var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
  return (msw << 16) | (lsw & 0xFFFF);
}

/*
 * Bitwise rotate a 32-bit number to the left
 */
function rol(num, cnt)
{
  return (num << cnt) | (num >>> (32 - cnt));
}

/*
 * These functions implement the basic operation for each round of the
 * algorithm.
 */
function cmn(q, a, b, x, s, t)
{
  return add(rol(add(add(a, q), add(x, t)), s), b);
}
function ff(a, b, c, d, x, s, t)
{
  return cmn((b & c) | ((~b) & d), a, b, x, s, t);
}
function gg(a, b, c, d, x, s, t)
{
  return cmn((b & d) | (c & (~d)), a, b, x, s, t);
}
function hh(a, b, c, d, x, s, t)
{
  return cmn(b ^ c ^ d, a, b, x, s, t);
}
function ii(a, b, c, d, x, s, t)
{
  return cmn(c ^ (b | (~d)), a, b, x, s, t);
}

/*
 * Take a string and return the hex representation of its MD5.
 */
function calcMD5(str)
{
  x = str2blks_MD5(str);
  a =  1732584193;
  b = -271733879;
  c = -1732584194;
  d =  271733878;

  for(i = 0; i < x.length; i += 16)
  {
    olda = a;
    oldb = b;
    oldc = c;
    oldd = d;

    a = ff(a, b, c, d, x[i+ 0], 7 , -680876936);
    d = ff(d, a, b, c, x[i+ 1], 12, -389564586);
    c = ff(c, d, a, b, x[i+ 2], 17,  606105819);
    b = ff(b, c, d, a, x[i+ 3], 22, -1044525330);
    a = ff(a, b, c, d, x[i+ 4], 7 , -176418897);
    d = ff(d, a, b, c, x[i+ 5], 12,  1200080426);
    c = ff(c, d, a, b, x[i+ 6], 17, -1473231341);
    b = ff(b, c, d, a, x[i+ 7], 22, -45705983);
    a = ff(a, b, c, d, x[i+ 8], 7 ,  1770035416);
    d = ff(d, a, b, c, x[i+ 9], 12, -1958414417);
    c = ff(c, d, a, b, x[i+10], 17, -42063);
    b = ff(b, c, d, a, x[i+11], 22, -1990404162);
    a = ff(a, b, c, d, x[i+12], 7 ,  1804603682);
    d = ff(d, a, b, c, x[i+13], 12, -40341101);
    c = ff(c, d, a, b, x[i+14], 17, -1502002290);
    b = ff(b, c, d, a, x[i+15], 22,  1236535329);    

    a = gg(a, b, c, d, x[i+ 1], 5 , -165796510);
    d = gg(d, a, b, c, x[i+ 6], 9 , -1069501632);
    c = gg(c, d, a, b, x[i+11], 14,  643717713);
    b = gg(b, c, d, a, x[i+ 0], 20, -373897302);
    a = gg(a, b, c, d, x[i+ 5], 5 , -701558691);
    d = gg(d, a, b, c, x[i+10], 9 ,  38016083);
    c = gg(c, d, a, b, x[i+15], 14, -660478335);
    b = gg(b, c, d, a, x[i+ 4], 20, -405537848);
    a = gg(a, b, c, d, x[i+ 9], 5 ,  568446438);
    d = gg(d, a, b, c, x[i+14], 9 , -1019803690);
    c = gg(c, d, a, b, x[i+ 3], 14, -187363961);
    b = gg(b, c, d, a, x[i+ 8], 20,  1163531501);
    a = gg(a, b, c, d, x[i+13], 5 , -1444681467);
    d = gg(d, a, b, c, x[i+ 2], 9 , -51403784);
    c = gg(c, d, a, b, x[i+ 7], 14,  1735328473);
    b = gg(b, c, d, a, x[i+12], 20, -1926607734);
    
    a = hh(a, b, c, d, x[i+ 5], 4 , -378558);
    d = hh(d, a, b, c, x[i+ 8], 11, -2022574463);
    c = hh(c, d, a, b, x[i+11], 16,  1839030562);
    b = hh(b, c, d, a, x[i+14], 23, -35309556);
    a = hh(a, b, c, d, x[i+ 1], 4 , -1530992060);
    d = hh(d, a, b, c, x[i+ 4], 11,  1272893353);
    c = hh(c, d, a, b, x[i+ 7], 16, -155497632);
    b = hh(b, c, d, a, x[i+10], 23, -1094730640);
    a = hh(a, b, c, d, x[i+13], 4 ,  681279174);
    d = hh(d, a, b, c, x[i+ 0], 11, -358537222);
    c = hh(c, d, a, b, x[i+ 3], 16, -722521979);
    b = hh(b, c, d, a, x[i+ 6], 23,  76029189);
    a = hh(a, b, c, d, x[i+ 9], 4 , -640364487);
    d = hh(d, a, b, c, x[i+12], 11, -421815835);
    c = hh(c, d, a, b, x[i+15], 16,  530742520);
    b = hh(b, c, d, a, x[i+ 2], 23, -995338651);

    a = ii(a, b, c, d, x[i+ 0], 6 , -198630844);
    d = ii(d, a, b, c, x[i+ 7], 10,  1126891415);
    c = ii(c, d, a, b, x[i+14], 15, -1416354905);
    b = ii(b, c, d, a, x[i+ 5], 21, -57434055);
    a = ii(a, b, c, d, x[i+12], 6 ,  1700485571);
    d = ii(d, a, b, c, x[i+ 3], 10, -1894986606);
    c = ii(c, d, a, b, x[i+10], 15, -1051523);
    b = ii(b, c, d, a, x[i+ 1], 21, -2054922799);
    a = ii(a, b, c, d, x[i+ 8], 6 ,  1873313359);
    d = ii(d, a, b, c, x[i+15], 10, -30611744);
    c = ii(c, d, a, b, x[i+ 6], 15, -1560198380);
    b = ii(b, c, d, a, x[i+13], 21,  1309151649);
    a = ii(a, b, c, d, x[i+ 4], 6 , -145523070);
    d = ii(d, a, b, c, x[i+11], 10, -1120210379);
    c = ii(c, d, a, b, x[i+ 2], 15,  718787259);
    b = ii(b, c, d, a, x[i+ 9], 21, -343485551);

    a = add(a, olda);
    b = add(b, oldb);
    c = add(c, oldc);
    d = add(d, oldd);
  }
  return rhex(a) + rhex(b) + rhex(c) + rhex(d);
}

/* END MD5 */







// http://flickr.com/services/auth/?api_key=0fd24d9d0411ede9c4d33d4c531bbc16&perms=write&api_sig=47ddcd2305b095f3be2bc2230f07396c

// "http://www.flickr.com/services/auth/?api_key=0fd24d9d0411ede9c4d33d4c531bbc16&perms=write&api_sig=c9383302b56102b8"


/* Global variables used across application */
var userID; 
var apiKey = '0fd24d9d0411ede9c4d33d4c531bbc16';
var myString = 'c9383302b56102b8api_key0fd24d9d0411ede9c4d33d4c531bbc16permswrite';
var apiSig = calcMD5(myString); 





/* User Authentication Methods */


/* Takes user to USER LOGIN - if NOT already logged in */
$(document).ready(function(){
	$('#sign_in').click(function(){
		$.getJSON('https://api.flickr.com/services/rest/?method=flickr.test.login&api_key='+apiKey+'&format=json&nojsoncallback=1&api_sig='+apiSig+'',
			function(data){
				console.log(data.stat); 
				if(data.stat == "fail"){
					$.getJSON('http://flickr.com/services/auth/?api_key='+apiKey+'&perms=write&api_sig='+apiSig+'',
						function(data){
							alert("so far so good");
						})
				}
			}) 
	})
})

/* Get Oauth_token if user is LOGGED IN */
$(document).ready(function(){
$("#testUser").click(function(){
	$.getJSON('https://api.flickr.com/services/rest/?method=flickr.auth.oauth.getAccessToken&api_key=800af8ad4d29bc974fd1e2fd1479fd23&format=json&nojsoncallback=1&auth_token=72157652002853196-359a13170ba6cfd3&api_sig=b60ddb0bc75761f924c1fd6f48aa8dff',
		function(data){

		})
})


});



/* Testing USER LOGIN */
$(document).ready(function(){
	$("#testUser").click(function(){
		//$("#sign_in").empty(); // empties all the tags there are inside

		$.getJSON('https://api.flickr.com/services/rest/?method=flickr.test.login&api_key='+apiKey+'&format=json&nojsoncallback=1&auth_token=72157652053303902-5878d3c4131e4235&api_sig=b736b172694a8fab23cb68851c505287',
		function(data){
			alert(data.stat); 
			
		});
	});
});

/* END - User Authentication Methods */






/* Get user ID - Use this to get the user's ID to use for other methods */
$(document).ready(function(){
	$("#getID").click(function(){
		//var apiKey = '0ecf0a0d645ad3b39ec60d137ebb75a5'; 
		userName = prompt("Please enter your user name");

		$.getJSON('https://api.flickr.com/services/rest/?method=flickr.people.findByUsername&api_key='+apiKey+'&username='+userName+'&format=json&nojsoncallback=1&auth_token=72157652029604262-c6b720c6caf27458&api_sig=f50405c8f647bcc90f19e7c6cadb4d53',
			function(data){
				userID = (data.user.id); 
				alert(userID); 
			})
	})
})





/*
	Return the images from the photoset - user has to know the ID of the photoset prior to using
*/
$(document).ready(function(){
	$("#photoset").click(function(){
			jQuery('#a-link').remove();   
	
			//jQuery('<img alt="" />').attr('id', 'loader').attr('src', 'ajax-loader.gif').appendTo('#image-container');
			// var photosetID = prompt("Please Enter PHOTOSET ID", "photoset ID");
			// if(theID != null){
			// 	alert("Valid"); 
			// }
			//var apiKey = '0ecf0a0d645ad3b39ec60d137ebb75a5'; // not my real API key
			//var apiKey = '0fd24d9d0411ede9c4d33d4c531bbc16'
			var userID = '90085976%40N03';
			var photosetID = '72157651980228016';

		$.getJSON('https://api.flickr.com/services/rest/?method=flickr.photosets.getPhotos&api_key='+apiKey+'&photoset_id='+photosetID+'&user_id='+userID+'&format=json&nojsoncallback=1',

		/*
			iterates through the defined photoset and pulls all the images from my account
		*/	
		function(data){
			var i; 
			var aPhoto = [];
			for(i = 0; i < data.photoset.photo.length; i++){

				aPhoto[i] = 'http://farm' + data.photoset.photo[i].farm + '.static.flickr.com/' + data.photoset.photo[i].server + '/' + data.photoset.photo[i].id + '_' + data.photoset.photo[i].secret + '_m.jpg';
			
				jQuery('<a href/>').attr('id','photo').html($('<img/>').attr('src',aPhoto[i])).appendTo('#pics');

			}
		

		});
	
	});
});


/* Uploads one photo so we can comment on it - this will be for testing purposes */
$(document).ready(function(){
	$('#getPhoto').click(function(){

	})
})


/* User makes a comment on the photo */
$(document).ready(function(){
	$("#comment").click(function(){

		var comment = prompt("Please enter your comment"); 
		//var photoID = '17194640325';

		$.post('https://api.flickr.com/services/rest/?method=flickr.photos.comments.addComment&api_key=800af8ad4d29bc974fd1e2fd1479fd23&photo_id=17194640325&comment_text='+comment+'&format=json&nojsoncallback=1&auth_token=72157652053303902-5878d3c4131e4235&api_sig=d945a87a0d901ebd96a80e3474c5b12c',

			function(data){
				alert(data.stat); 
			});
	});
});



// var person = prompt("Please enter your name", "Harry Potter");
// if (person != null) {
//     document.getElementById("demo").innerHTML =
//     "Hello " + person + "! How are you today?";
// }

/*
	Will check if the user signed in, this will 
	be done in the background process.
*/
// $(document).ready(function(){
// 	$("#sign_in").click(function(){
// 			$.getJSON("https://api.flickr.com/services/rest/?method=flickr.test.login&api_key=e8ccf1cc1cbbae254459539e1cbf049c&format=json&nojsoncallback=1&auth_token=72157649673760944-12f9842b056ca8e9&api_sig=cd1a1aaf7895f9ed0e71505c2467d23e",
// 	{
// 		format: "json",
// 		function(data){
// 			alert("data.user.username.content");
// 		}
// 	});
// 	});
// });


// function checkSignin(){
// 	$.getJSON("https://api.flickr.com/services/rest/?method=flickr.test.login&api_key=e8ccf1cc1cbbae254459539e1cbf049c&format=json&nojsoncallback=1&auth_token=72157649673760944-12f9842b056ca8e9&api_sig=cd1a1aaf7895f9ed0e71505c2467d23e",
// 	{
// 		format: "json",
// 		function(data){
// 			alert(data.user.username.content);
// 		}
// 	});
// }


/*
	Checks if the user has signed in or not. If not, then
	the function will ask for credentials and then download the 
	photos from his library. 
*/
// boolean ready = true; 
// $(document).ready(function(){
// 	$("#sign_in").click(function(){

// 		if(ready = false){
// 		var username = prompt("Username", "username");
// 		var password = prompt("Password", "password");
// 		alert("Downloading " + username +"'s"+ " photos");
// 		} else if (ready = true){
// 			checkSignin(); 
// 		}
	
// 	});

// });


	





// $(document).ready(function() {
// SC.get('/tracks/293', function(track) {
//   SC.oEmbed(track.permalink_url, document.getElementById('player'));
// });
// });

// $(document).ready(function(){
// 	$("#button").click(function(){
// 		var xhr = new XMLHttpRequest(); 
// 		xhr.open("GET", 
// 			"https://api.flickr.com/services/rest/?method=flickr.people.getPublicPhotos&api_key=433ad000f6c8f565418ae4bc51864f91&user_id=90085976%40N03&format=json&nojsoncallback=1&auth_token=72157649645806663-ada04bff8c9b8a74&api_sig=2d1630adbfdf333df03789de394db87d", 
// 			false); 

// 		xhr.send(); 

// 		console.log(xhr.status); 
// 		console.log(xhr.statusText + " good, you're logged on!!!"); 

// 		alert()



// 	});
// });




// $(document).ready(function(){
// 	$("#button").click(function(){
// 		var info = $flickr.photos.getInfo("16324929259");
// 		console.log(info); 
// 	})
// })

// $('#button').click(function() {
// 	var string = $('#string').val(); //taking value of string

// 	$.get('./php/reverse.php', { input: string }, function(data) {
// 		$('#feedback').text(data); 
// 	});

// });

// $(function () {
// 	$.ajax({
// 		type: 'GET',
// 		url: '/api/orders',
// 		sucess: function(orders){
// 			$.each(orders, function(i,order){
// 				$orders.append('<li>myorder</li>'); 
// 			});
// 		}
// 	});
// });

// $('#button').click(function(data){

// 	var string = $.getJSON('https://api.flickr.com/services/rest/?method=flickr.photos.getInfo&api_key=7bdc0a857bd273658f68d9dddfd22079&photo_id=16324929259&format=json&nojsoncallback=1&auth_token=72157651529668479-53f7076fcde493ff&api_sig=727174b0132d14d963930ff6882bb6af');

// 	alert($_GET); 
// });


// var demo = '{"pets": { "name": "Jeffrey", "species": "Giraffe"}}';
// var xhr = new XMLHttpRequest();
// xhr.open("GET", "http://www.codecademy.com/", false);
// // Add your code below!
// xhr.send(); 
// alert(xhr.status + " " +xhr.statusText);
// console.log(xhr.statusText); 


// var json = JSON.parse(demo);
// alert(json.name);



// function(data){

// //loop through the results with the following function
// $.each(data.photoset.photo, function(i,item){

//     //build the url of the photo in order to link to it
//    // var photoURL = 'http://farm' + item.farm + '.static.flickr.com/' + item.server + '/' + item.id + '_' + item.secret + '_m.jpg'

//     //turn the photo id into a variable
//     var photoID = item.id;

//     //use another ajax request to get the geo location data for the image
//     $.getJSON('http://api.flickr.com/services/rest/?&amp;method=flickr.photos.geo.getLocation&amp;api_key=' + 0fd24d9d0411ede9c4d33d4c531bbc16 + '&amp;photo_id=' + 16324929259 + '&amp;format=json&amp;jsoncallback=?',
//     function(data){

//         //if the image has a location, build an html snippet containing the data
//         if(data.stat != 'fail') {
//             pLocation = '<a href="http://www.flickr.com/map?fLat=' + data.photo.location.latitude + '&amp;fLon=' + data.photo.location.longitude + '&amp;zl=1" target="_blank">' + data.photo.location.locality._content + ', ' + data.photo.location.region._content + ' (Click for Map)</a>';
//         }

//     });

// }

