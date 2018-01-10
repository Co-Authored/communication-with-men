(function($) {

	'use strict';

	var ww = window.innerWidth,
		wh = window.innerHeight,
		page_loaded = false,
		ajaxFirstLoad = false,
		ajaxLoading = false,
		ajaxLocation = '';


	first_load();
	set_hover();
	heros();
	ajax();
	shortcodes();


	$(window).on('load', function() {
		$('body').waitForImages({
			finished: function() {
				setTimeout(function() {
					$('.fade').addClass('hide');

					page_loaded = true;

					reveals();
				}, 500);
			},
			waitForAll: true
		});
	});

	$(window).on('resize', function() {
		ww = window.innerWidth;
		wh = window.innerHeight;

		heros();
	});



	// first load
	// ==================================================

	function first_load() {
		$('html, body').animate({
			scrollTop: 0
		}, 1);

		// rand previews
		var total = $('.preview').length,
			rand = Math.floor(Math.random() * total);

		$($('.projects-list li a')[rand]).addClass('active');
		$($('.preview')[rand]).addClass('active');
	}


	// set hover
	// ==================================================

	function set_hover() {
		$('.projects-list li a').on('mouseenter', function() {
			var ref = $(this).data('ref'),
				preview = $('.preview[data-ref="' + ref + '"]');

			$('.projects-list li a').removeClass('active');
			$(this).addClass('active');

			$('.preview').removeClass('active');
			preview.addClass('active');
		});
	}


	// heros
	// ==================================================

	function heros() {
		$('.hero').each(function() {
			$(this).css('position', 'relative');

			if ($(this).hasClass('small')) {
				$(this).css('height', window.innerHeight * 0.7 + 'px');
			} else {
				$(this).css('height', window.innerHeight + 'px');
			}
		});
	}


	// ajax
	// ==================================================

	function ajax() {
		$('body').on('click', '.ajax-link', function(event) {
			event.preventDefault();

			var page = $(this).data('url');

			if (!ajaxLoading)
				load_content(page, true);

			ajaxFirstLoad = true;
		});

		$(window).on('popstate', function() {
			if (ajaxFirstLoad) {
				var newPageArray = location.pathname.split('/'),
					newPage = newPageArray[newPageArray.length - 1];

				if (!ajaxLoading && ajaxLocation != newPage)
					load_content(newPage, false);
			}

			ajaxFirstLoad = true;
		});

		function load_content(page, bool) {
			ajaxLoading = true;
			ajaxLocation = page;

			page_loaded = false;

			$('.fade').removeClass('hide');

			setTimeout(function() {
				$('#main').load(page + ' #main-content', function(data) {
					var page_title = data.match(/<title>(.*?)<\/title>/);
					document.title = page_title[1];

					// functions
					first_load();
					set_hover();
					heros();
					shortcodes();

					$('html, body').animate({
						scrollTop: 0
					}, 1);

					$('#main-content').waitForImages({
						finished: function() {
							setTimeout(function() {
								$('.fade').addClass('hide');

								page_loaded = true;
								ajaxLoading = false;

								reveals();

								if (page != window.location && bool) {
									window.history.pushState({
										path: page
									}, '', page);
								}
							}, 500);
						},
						waitForAll: true
					});
				});
			}, 1000);
		}
	}


	// reveals
	// ==================================================

	function reveals() {
		$(window).on('scroll', function() {
			if (page_loaded) {
				setTimeout(function() {
					$('.reveal').each(function(i) {
						var el_top = $(this).offset().top,
							win_bottom = wh + $(window).scrollTop();

						if (el_top < win_bottom) {
							$(this).delay(i * 100).queue(function() {
								$(this).addClass('reveal-in');
							});
						}
					});
				}, 500);
			}
		}).scroll();
	}


	// shortcodes
	// ==================================================

	function shortcodes() {
		// magnific popup
		$('a.image-link').magnificPopup({
			type: 'image',
			mainClass: 'mfp-with-zoom',
			gallery: {
				enabled: true
			},
			zoom: {
				enabled: true,
				duration: 300,
				easing: 'ease-in-out',
				opener: function(openerElement) {
					return openerElement.is('img') ? openerElement : openerElement.find('img');
				}
			}
		});

		// sliders
		$('.slider').each(function() {
			var slider = $(this),
				dots = slider.data('dots') == true ? 1 : 0,
				arrows = slider.data('arrows') == true ? 1 : 0;

			slider.owlCarousel({
				autoplay: true,
				items: 1,
				loop: true,
				nav: arrows,
				dots: dots,
				navText: ['', '']
			});
		});

		// background image
		$('[data-bg]').each(function() {
			var bg = $(this).data('bg');

			$(this).css({
				'background-image': 'url(' + bg + ')',
				'background-size': 'cover',
				'background-position': 'center center'
			});
		});

		// background color
		$('[data-bg-color]').each(function() {
			var bg = $(this).data('bg-color');

			$(this).css('background-color', bg);
		});

		// alternate colors
		$(window).on('scroll', function() {
			for (var i = 0; i < $('.light-section').length; i++) {
				var sec_top = $($('.light-section')[i]).offset().top,
					sec_height = $($('.light-section')[i]).height(),
					sec_bottom = sec_top + sec_height,
					opt = $('#project .close-project'),
					opt_top = opt.offset().top,
					opt_height = opt.height();

				if ((opt_top + opt_height) >= sec_top && (opt_top + opt_height) <= sec_bottom) {
					opt.addClass('light');

					break;
				} else {
					opt.removeClass('light');

					continue;
				}
			};
		}).scroll();
	}

})(jQuery);
