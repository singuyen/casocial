/*!
 * jQuery Social Button
 * http://singuyen.me
 * Version: 1.0
 * 
 * Released under the MIT license
 *
 * Date: 2015-08-25T14:32Z
 */

$.fn.caSocial = function(settings,callback) {
	var _this = $(this);
	
	//Let this run on the live site
	//var url = window.location.href;
	//var title = $('title').text();

	//Temporary sample - Please remove it on the live site
	//var url = 'http://mashable.com/2015/08/25/bring-it-on-anniversary-cheerleaders/';
	var url = 'http://www.caradvice.com.au/397733/the-problem-with-hydrogen-fuel-cell-cars/';
	var title = 'This is sample title';
	//Temporary sample - Please remove it on the live site

	var _totalActive = 0;
	var _totalShares = 0;

	var filteredTitle = encodeURIComponent(title).replace(/<[^>]*>/g, "");
	var ytKey = 'AIzaSyDXyaA-6YLMoWsyfCkotsN26LO34f3XK0Q';

	/* Mail to template */
	var mailSubject = settings.website + ' - ' + filteredTitle;
	var mailContent = 'Hi, I found this article from ' + settings.website + ' that you might be interested in. ' + url;

	/* Prepare the link for each button */
	var fbhref = 'http://www.facebook.com/sharer.php?u=' + encodeURIComponent(url) + '&amp;t=' + filteredTitle + '';
	var twhref = 'http://twitter.com/share?text=' + filteredTitle + '&amp;url=' + encodeURIComponent(url);
	var gphref = 'https://plus.google.com/share?url=' + encodeURIComponent(url);
	var mailhref = 'mailto:?subject=' + encodeURIComponent(mailSubject) + '&amp;body=' + encodeURIComponent(mailContent);

	var template = '\
	<div class="fb social-btn">\
		<a href="' + fbhref + '">\
			<div class="button-icon"><i class="icon-facebook"></i></div>\
			<div class="shared"></div>\
			<div class="call">Share</div>\
		</a>\
	</div>\
	<div class="tw social-btn">\
		<a href="' + twhref + '">\
			<div class="button-icon"><i class="icon-twitter"></i></div>\
			<div class="shared"></div>\
			<div class="call">Share</div>\
		</a>\
	</div>\
	<div class="gp social-btn">\
		<a href="' + gphref + '">\
			<div class="button-icon"><i class="icon-google-plus"></i></div>\
			<div class="shared"></div>\
			<div class="call">Share</div>\
		</a>\
	</div>';

	if (settings.allowYoutube) {
		template += '<div class="yt social-btn">\
		<a href="http://www.youtube.com/user/CarAdvice?sub_confirmation=1">\
		<div class="button-icon"><i class="icon-youtube-play"></i></div>\
		<div class="shared">0</div>\
		<div class="call">Subscribe</div>\
		</a>\
		</div>';
	}	

	if (settings.allowEmail) {
		template += '<div class="email social-btn">\
		<a href="' + mailhref + '">\
		<div class="button-icon"><i class="icon-envelope"></i></div>\
		<div class="shared">0</div>\
		<div class="call">Share</div>\
		</a>\
		</div>';	
	}

	_this.append(template);
	_this.find('.social-btn').each(function(){

		var myBtn = $(this).find('a');
		var href = myBtn.attr('href');

		if (!$(this).hasClass('yt')){
			myBtn.on('click',function(e){
				e.preventDefault();
				window.open(href,'targetWindow','toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=700,height=450');			
			});
		} else { //Open new tab for Youtube subscription
			myBtn.on('click',function(e){
				e.preventDefault();
				window.open(href,'_newBlank');
			});
		}
		

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
			_this.prepend('<div class="total-shares"><div class="shares">' + formatNumber(_totalShares) + '</div>SHARES</div>');
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

	function injectCount(ele,count) {
		ele.find('.shared').text(formatNumber(count));
		ele.find('.shared').show();
		ele.find('.call').hide();
		if (ele.selector != '.yt'){
			_totalShares += count;
		}
		skinMe();
	}


	var shared = {
		getFb: function(){
			$.getJSON('https://graph.facebook.com/?id=' + url, function (fbdata) {
				injectCount($('.fb'),fbdata.shares);
			});
		},
		getTw: function() {
			$.getJSON('https://cdn.api.twitter.com/1/urls/count.json?url=' + url + '&callback=?', function (twitdata) {
				injectCount($('.tw'),twitdata.count);
			});		
		},
		getGp: function(){
			checkGapi(function(){
					gapi.client.setApiKey('AIzaSyCKSbrvQasunBoV16zDH9R33D88CeLr9gQ')
					gapi.client.rpcRequest('pos.plusones.get', 'v1', params).execute(function(resp) {
					var count = resp.result.metadata.globalCounts.count;
					injectCount($('.gp'),count);
				});
			});
		},
		getYt: function(){
			$.getJSON('https://www.googleapis.com/youtube/v3/channels?part=statistics&forUsername=caradvice&key=' + ytKey, function (data) {
				var count = data.items[0].statistics.subscriberCount;
				injectCount($('.yt'),count);
			});		
		}
	}

	shared.getFb();
	shared.getTw();
	shared.getGp();
	shared.getYt();
}


