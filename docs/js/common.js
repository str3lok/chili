
$(function () {
// Script for browser detect    
var browserDetect;

$(function(){   
		browserDetect = {
				init: function () {
						this.browser = this.searchString(this.dataBrowser) || "Other";
						this.version = this.searchVersion(navigator.userAgent) || this.searchVersion(navigator.appVersion) || "Unknown";
				},
				searchString: function (data) {
						for (var i = 0; i < data.length; i++) {
								var dataString = data[i].string;
								this.versionSearchString = data[i].subString;

								if (dataString.indexOf(data[i].subString) !== -1) {
										return data[i].identity;
								}
						}
				},
				searchVersion: function (dataString) {
						var index = dataString.indexOf(this.versionSearchString);
						if (index === -1) {
								return;
						}

						var rv = dataString.indexOf("rv:");
						if (this.versionSearchString === "Trident" && rv !== -1) {
								return parseFloat(dataString.substring(rv + 3));
						} else {
								return parseFloat(dataString.substring(index + this.versionSearchString.length + 1));
						}
				},

				dataBrowser: [
						{string: navigator.userAgent, subString: "Chrome", identity: "Chrome"},
						{string: navigator.userAgent, subString: "MSIE", identity: "Explorer"},
						{string: navigator.userAgent, subString: "Trident", identity: "Explorer"},
						{string: navigator.userAgent, subString: "Firefox", identity: "Firefox"},
						{string: navigator.userAgent, subString: "Safari", identity: "Safari"},
						{string: navigator.userAgent, subString: "Opera", identity: "Opera"}
				]

		};
		
		browserDetect.init();

		$('body').addClass(browserDetect.browser+' v'+browserDetect.version );
		
		var doc = document.documentElement;
		doc.setAttribute('data-useragent', navigator.userAgent);
});  

// подключаем html5-блоки для старых браузеров
var e = ("article,aside,figcaption,figure,footer,header,hgroup,nav,section,time,main").split(',');
for (var i = 0; i < e.length; i++) {
		document.createElement(e[i]);
};


// Mobile Detect
function isMobile() {
	try{ document.createEvent("TouchEvent"); return true; }
	catch(e){ return false; }
}
		
if (isMobile()) $('body').addClass('mobile');


$('body').on('click', '.tss', function(e){
	e.preventDefault();  
});  

// большой cлайдер на главной
$('.sliderItem').slick({
 slidesToShow: 3,
 slidesToScroll: 1,
 arrows: true,
 dots: false,
 responsive: [
  {
    breakpoint: 768,
    settings: {
      slidesToShow: 2
    }      
  },
  {
    breakpoint: 480,
    settings: {
      slidesToShow: 1
    }      
  }
 ]  
 
});

});

