/* jQuery plugin for Caradvice social button */
$.fn.caSocial = function(settings,callback) {
	var _this = $(this);
	
	//var getUrl = window.location.href;

	var _totalActive = 0;
	var _totalShares = 0;

	var url = 'http://mashable.com/2015/08/25/bring-it-on-anniversary-cheerleaders/';
	var title = 'This is <b>"Johnson"</b>';
	var filteredTitle = encodeURIComponent(title).replace(/<[^>]*>/g, "");

/*
https://www.googleapis.com/youtube/v3/channels?part=statistics&forUsername=caradvice&key={KEY}
*/

	var fbhref = 'http://www.facebook.com/sharer.php?u=' + encodeURIComponent(url) + '&amp;t=' + filteredTitle + '';
	var twhref = 'http://twitter.com/share?text=' + filteredTitle + '&amp;url=' + encodeURIComponent(url);
	var gphref = 'https://plus.google.com/share?url=' + encodeURIComponent(url);

	var template = '\
	<div class="fb social-btn">\
		<a href="' + fbhref + '">\
			<div class="button-icon"><i class="icon-facebook"></i></div>\
			<span class="shared"></span>\
		</a>\
	</div>\
	<div class="tw social-btn">\
		<a href="' + twhref + '">\
			<div class="button-icon"><i class="icon-twitter"></i></div>\
			<span class="shared"></span>\
		</a>\
	</div>\
	<div class="gp social-btn">\
		<a href="' + gphref + '">\
			<div class="button-icon"><i class="icon-google-plus"></i></div>\
			<span class="shared"></span>\
		</a>\
	</div>';

	if (settings.youtube) {
		template += '<div class="yt social-btn">\
		<div class="button-icon"><i class="icon-youtube-play"></i></div>\
		<span class="shared">0</span>\
		</div>';
	}	

	if (settings.email) {
		template += '<div class="email social-btn">\
		<div class="button-icon"><i class="icon-envelope"></i></div>\
		<span class="shared">0</span>\
		</div>';	
	}

	_this.append(template);
	_this.find('.social-btn').each(function(){

		var myBtn = $(this).find('a');
		var href = myBtn.attr('href');

		myBtn.on('click',function(e){
			e.preventDefault();
			window.open(href,'targetWindow','toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=700,height=450');			
		})
		

	})

	/* Call dependencies */
	var script = document.createElement('script');
	script.onload = function() { };
	script.src = "https://apis.google.com/js/plusone.js";
	document.getElementsByTagName('head')[0].appendChild(script);

	var script01 = document.createElement('script');
	script01.onload = function() { };
	script01.src = "https://apis.google.com/js/client:plusone.js";
	document.getElementsByTagName('head')[0].appendChild(script01);

	//Nicer numbers
	function formatNumber(shareNumber) {
		 if (shareNumber >= 1000000000) {
			return (shareNumber / 1000000000).toFixed(1).replace(/\.0$/, '') + 'G';
		 }
		 if (shareNumber >= 1000000) {
			return (shareNumber / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
		 }
		 if (shareNumber >= 1000) {
			return (shareNumber / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
		 }
		 return shareNumber;
	}

	//Run callback when social counts are ready
	function skinMe() {
		_totalActive++;
		if (_totalActive == 3) {
			_this.prepend('<div class="total-shares">Total Shares<br/><div class="shares">' + formatNumber(_totalShares) + '</div></div>');
			callback();
		}
	}

	function checkGapi(callback) {
		if (typeof gapi == 'undefined' || typeof gapi.client != 'object') {
			setTimeout(function(){
				checkGapi(function(){ callback(); });
			},500);
		} else {
			callback();
		}
	}

	/* Gplus params */
	var params = {
		nolog: true,
		id: url,
		source: "widget",
		userId: "@viewer",
		groupId: "@self"
	};

	var shared = {
		getFb: function(){
			$.getJSON('https://graph.facebook.com/?id=' + url, function (fbdata) {
				$('.fb .shared').text(formatNumber(fbdata.shares));
				_totalShares += fbdata.shares;
				skinMe();
			});
		},
		getTw: function() {
			$.getJSON('https://cdn.api.twitter.com/1/urls/count.json?url=' + url + '&callback=?', function (twitdata) {
				$('.tw .shared').text(formatNumber(twitdata.count));
				_totalShares += twitdata.count;
				skinMe();
			});		
		},
		getGp: function(){
			checkGapi(function(){
					gapi.client.setApiKey('AIzaSyCKSbrvQasunBoV16zDH9R33D88CeLr9gQ')
					gapi.client.rpcRequest('pos.plusones.get', 'v1', params).execute(function(resp) {
					var count = resp.result.metadata.globalCounts.count;
					$('.gp .shared').text(formatNumber(count));
					_totalShares += count;
					skinMe();
				});
			});
		}
	}

	shared.getFb();
	shared.getTw();
	shared.getGp();
}

//Temp
$('.ca-share').remove();

$('#ca-social').caSocial({"youtube":true,"email":true},function(){
	$('#ca-social').show();
});	