$(document).ready(function() {

	$(document).on('click', 'a.spoiler', function (e) {
		e.preventDefault();
		var openText = $(this).data('open');
		var closeText = $(this).data('close');
		var spoilerBody = $(this).closest('div').find('.spoiler-body');
		if (spoilerBody.is(':visible')) {
			$(this).text(openText);
			spoilerBody.fadeOut();
		} else {
			$(this).text(closeText);
			spoilerBody.fadeIn();
		}
	});
	
	if ($(".hours-slider__slider").length) {
		var $amountHoursSlider, $amountDiscountSlider;
		var $amountHoursCalc = $("input.hours-calc__amount-hours-val"),
		$rateCalc = $(".hours-calc__rate-val"),
		$rateCalcMob = $(".hour-mob"),
		$totalCalc = $(".hours-calc__total-val");
		$totalCalcPost = $(".total-val-post");
		var $calcSlider = $(".hours-slider__slider");
		var $amountHoursText = $(".hours-calc__amount-hours-text");
		//var $modalHoursInput = $("#calc-input-hours");
		var $modalHoursInput = $('#API-MF-FIELDS-form10').find('input[name=COUNT_HOURS]:first');
		var maxHours = calculatorPriceHoursList[calculatorPriceHoursList.length - 1].hourEnd;
		var minHours = calculatorPriceHoursList[0].hourStart;
		var startHours = calculatorPriceHoursList[3].hourStart;
		//$('#API-MF-FIELDS-form10').find('input[name=COUNT_HOURS]').attr('id', 'form-calculator-input-hours');

		$calcSlider.slider({
			min: minHours,
			max: maxHours,
			values: [minHours, minHours],
			step: 1,
			range: true,
			start: function(event, ui) {
				if(ui.handle.nextElementSibling != null) 
					event.preventDefault();
			},
			slide: function(event, ui) {
				calculateTarif(ui.values[1]);
				changeHoursAmountText(ui.values[1]);
				$modalHoursInput.val(ui.values[1]);
			},
			create: function (event, ui) {
				$('.ui-slider .ui-slider-handle:last-of-type').append('<div class="amount-hours"><span class="amount-hours-val">'+minHours+'</span> <span class="amount-hours-text">часов</span></div>');
				$('.ui-slider .ui-slider-handle:last-of-type').append('<div class="amount-discount"><span>0</span> скидка</div>');
				$amountHoursSliderVal = $('.amount-hours .amount-hours-val');
				$amountHoursSliderText = $('.amount-hours .amount-hours-text');
				$amountDiscountSlider = $('.amount-discount span');
			}
		});

		$amountHoursCalc.change(function() {
			// if (+$amountHoursCalc.val() > maxHours) {
			// 	$calcSlider.slider("values", 1, maxHours);
			// 	changeHoursAmountText(maxHours);
			// }
			 if (+$amountHoursCalc.val() < minHours) {
				$calcSlider.slider("values", 1, minHours);
				changeHoursAmountText(minHours);
			} else {
				$calcSlider.slider("values", 1, +$amountHoursCalc.val());
				changeHoursAmountText(+$amountHoursCalc.val());
			}
			calculateTarif(+$amountHoursCalc.val());
			$modalHoursInput.val(+$amountHoursCalc.val());
		});

		function calculateTarif(hoursNum) {

			var startPrice = Number($('#start_price_box').data('start'));

			$(calculatorPriceHoursList).each(function(el){

                if(hoursNum >= this.hourStart && hoursNum <= this.hourEnd){
                    $rateCalc.html(formatToMoneySum(String(this.price)));
                    $totalCalc.html(formatToMoneySum(String(hoursNum * this.price)));
                    //Постоплата
                    $totalCalcPost.html(formatToMoneySum(String(hoursNum * startPrice)));

                    // var discount = el ? Math.round(100 - (this.price / calculatorPriceHoursList[0].price * 100)) : 0;
                    var discount = Math.round(100 - (this.price / startPrice * 100));
                    $amountDiscountSlider.html(String(discount) + '%');
                
								}
								if(hoursNum > 100){
                    $rateCalc.html(formatToMoneySum(String(this.price)));
                    $totalCalc.html(formatToMoneySum(String(hoursNum * this.price)));
                    //Постоплата
                    $totalCalcPost.html(formatToMoneySum(String(hoursNum * startPrice)));
								}

			});

		}

		function changeHoursAmountText(hoursNum) {
			$amountHoursSliderVal.html(hoursNum);
			$amountHoursSliderText.html(declOfNum(hoursNum, ['час', 'часа', 'часов']));
			$amountHoursCalc.val(hoursNum);
			$rateCalcMob.text(hoursNum);
			$amountHoursText.html(declOfNum(hoursNum, ['час', 'часа', 'часов']));
		}

		function formatToMoneySum(sum) {
			return sum.replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ');
		}

		//устанавливаю стартовое положение ползунка
        $calcSlider.slider("values", 1, startHours);
        calculateTarif(startHours);
        changeHoursAmountText(startHours);
        $modalHoursInput.val(startHours);
	}

	var $navBlock = $(".main-nav");
	$(".main-nav__close-but").click(function() {
		$navBlock.css({
			"visibility": "hidden"
		});
	});
	$(".nav-open__but").click(function() {
		$navBlock.css({
			"visibility": "visible"
		});
	});

	function declOfNum(number, titles) {  
		cases = [2, 0, 1, 1, 1, 2];  
		return titles[ (number%100>4 && number%100<20)? 2 : cases[(number%10<5)?number%10:5] ];  
	}

	$(".hours-calc__but[data-modal-call]").click(function() {
		var modalName = $(this).data("modal-call");
		$(".modals-overlay").fadeIn(200, function() {
			$(".modal[data-modal-name=" + modalName + "]").fadeIn(200);
		});
	});

	var $modal = $(".modal");

	$(".modal__close").click(function() {
		$(".modals-overlay").fadeOut(200, function() {
			$modal.hide();
		});
	});

	$(".modals-overlay").click(function(ev) {
		if (!$modal.is(ev.target) && $modal.has(ev.target).length == 0) {
			$(this).fadeOut(200, function() {
				$modal.hide();
			});
		}
	});

	//$("input[name=PHONE]").mask("+7 (999) 999-9999");

	/*
	$.fn.show = function(speed, oldCallback) {
		return $(this).each(function() {
			var obj         = $(this),
			newCallback = function() {
				if ($.isFunction(oldCallback)) {
					oldCallback.apply(obj);
				}
				obj.trigger('afterShow');
			};

			obj.trigger('beforeShow');

			_oldShow.apply(obj, [speed, newCallback]);
		});
	}

	$(".modal[data-modal-name=\"calc\"]").bind('afterShow', function() {
      alert('afterShow');
    });
    */

	$('.review__next-but').click(function(){

		var slide = $(this).parent(),
			reviews = slide.parent(),
			next = slide.next('div.review');

        slide.fadeOut('fast', function(){
            if(next.length)
        		next.fadeIn('fast');
            else
                reviews.children('div:eq(0)').fadeIn('fast');
		});

	});

	/*
	$('#calc-form-popup').ajaxForm({
        dataType: 'json',

        beforeSubmit: function(formData, jqForm, options){

            jqForm.find('button:last').attr('disabled', '').html('Отправка...');

		},

        success: function(errors, statusText, xhr, jqForm){

            jqForm.find('button:last').removeAttr('disabled').html('Отправить');

        	if(errors.length)
			{
                alert(errors.join("\r"));
			}
			else
			{
                alert('Форма успешно отправлена.');
                location.reload();
			}
		}
    });
    */


    (function() {

        //сделать фон blockquote на странице новости шириной во весь экран
        var $blockquote = $(".news-article blockquote");
        var blockquoteBgColor = $blockquote.css("background-color");

        $blockquote.append("<div style=\"background-color:"+
            blockquoteBgColor +";\" class=\"bg-100\"></div>");

        //сделать цвет шрифта внутри списков таким же как у body
        var globalFontColor = $("body").css("color");

        $(".news-article ul li, .news-article ol li").wrapInner("<span style=\"color:"+
            globalFontColor+";\"></span>");
    })();


	//Показать блок подробнее на странице тарифы
	$(".ch-btn-more").on('click', function(e){
		e.preventDefault();
		var windowWidth = $(window).outerWidth();
	  var tab = $(this).attr('data-tab');

	  if($(this).hasClass('active')) {
	  	$(this).removeClass('active');

	  	if(windowWidth >= 768) {
	  		$('.ch-tabs.'+tab).slideUp();	  	
	  	}
	  	else {
	  		$('.ch-tab-mob.'+tab).slideUp();	  	
	  	}
	  }
	  else {
	  	$(".ch-btn-more").removeClass('active');
	    $(this).addClass('active');

	  	if(windowWidth >= 768) {
	     $('.ch-tabs:not(.'+tab+')').slideUp();
	     $('.ch-tabs.'+tab).slideDown(); 	
	  	}
	  	else {
	     $('.ch-tab-mob:not(.'+tab+')').slideUp();
	  		$('.ch-tab-mob.'+tab).slideDown();	  			
	  	}


	  }
	}); 

	//закрыть блок подробнее
	$("body").on('click', '.close-tab', function(e){
		e.preventDefault();  
		var windowWidth = $(window).outerWidth();
		$(".ch-btn-more").removeClass('active');

  	if(windowWidth >= 768) {
     $(this).closest('.ch-tabs').slideUp();	
  	}
  	else {
     $(this).closest('.ch-tab-mob').slideUp();	  			
  	}

	}); 

 try {
		setTimeout(function() {
			$('.ch-btn-more').each(function(){
				var tabClass = $(this).data('tab');
				$('.ch-tab-mob.'+tabClass).html($('.ch-tabs.'+tabClass).html());
			});	  
		}, 300);
	} catch (e) {}

	// ## 8526 ##
	$(window).scroll(function() { 
    var top = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
    if (top > 170) { 
      $('.main-content').addClass('contentTopMargin');
      $('.main-header').addClass('headerFix');
    }else{
      $('.main-content').removeClass('contentTopMargin');
      $('.main-header').removeClass('headerFix');
    }
	});  

	function scrollTo(to) {
	    var $obj = jQuery('html, body');
	    var top = 0;
	    var speed = 500;
	    var offsetX = 50;

	    if (typeof to == 'object') {
	        top = to.offset().top;
	    } else if (typeof to == 'string') {
	        top = jQuery(to).offset().top;
	    } else if (typeof to == 'number') {
	        top = to;
	    }

	    if (arguments.length > 1) {
	        if (typeof arguments[0] == 'number' && typeof arguments[1] == 'number') {
	            speed = arguments[1];
	        } else if (typeof arguments[1] == 'string' || typeof arguments[1] == 'object') {
	            if (typeof arguments[1] == 'object') {
	                $obj = arguments[1];
	            } else if (typeof arguments[1] == 'string') {
	                $obj = jQuery(arguments[1]);
	            }
	        }
	        if (typeof arguments[2] == 'number') {
	            speed = arguments[2];
	        }
	    }

	    if (jQuery(window).width() < 1000) {
	        offsetX = 130;
	    }

	    if (speed == 0) {
	        speed = 1;
	    }

	    $obj.animate(
	        {
	            scrollTop: top - offsetX
	        },
	        speed
	    );
	}
	// ## END 8526 ##

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

// main-content

});

function autoFun2() {
	var windowWidth = $(window).width(); 

	try {
		
		if(windowWidth >= 769) {
			$('.main-nav').removeAttr('style'); 
		}
		
		//если блок по тарифу был открыт на пк, открывем его же на мобильном и на оборот
			if(windowWidth <= 767) {
				if($('.ch-tabs.tab1').is(':visible')) {
					$('.ch-tabs.tab1').hide();
					$('.ch-tab-mob.tab1').slideDown();
				}
				if($('.ch-tabs.tab2').is(':visible')) {
					$('.ch-tabs.tab2').hide();
					$('.ch-tab-mob.tab2').slideDown();
				}
				if($('.ch-tabs.tab3').is(':visible')) {
					$('.ch-tabs.tab3').hide();
					$('.ch-tab-mob.tab3').slideDown();
				}
			} /*end 767*/

			if(windowWidth >= 768) {
				if($('.ch-tab-mob.tab1').is(':visible')) {
					$('.ch-tab-mob.tab1').hide();
					$('.ch-tabs.tab1').show();
				}
				if($('.ch-tab-mob.tab2').is(':visible')) {
					$('.ch-tab-mob.tab2').hide();
					$('.ch-tabs.tab2').show();
				}
				if($('.ch-tab-mob.tab3').is(':visible')) {
					$('.ch-tab-mob.tab3').hide();
					$('.ch-tabs.tab3').show();
				}
			} /*end 767*/


	} catch (e) {}

}
window.addEventListener("load", autoFun2);
window.addEventListener("resize", autoFun2);