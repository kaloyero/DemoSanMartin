angular.module('starter.controllers', [])

.controller('AppCtrl', function ($scope, $rootScope, EventsService) {

	// With the new view caching in Ionic, Controllers are only called
	// when they are recreated or on app start, instead of every page change.
	// To listen for when this page is active (for example, to refresh data),
	// listen for the $ionicView.enter event:
	$scope.$on('$ionicView.enter', function(e) {
		EventsService.get().then(function(evs) {
			$rootScope.nbSurveys = evs.length;
		});
	});

})

.controller('JingleCtrl', function ($scope, $state, $ionicPlatform, LocalStorage) {	
	// après lecture de la vidéo : redirige vers home ou login selon si l'utilisateur a déjà un compte
	var timeoutNext;
	
	$scope.next = function() {
		clearTimeout(timeoutNext);
		if (!LocalStorage.getObject('subscribed', false)) {
			$state.go('delegation');
		} else {
			$state.go('app.home');
		}
	}
	
	$scope.$on('$ionicView.enter', function(e) {
		$(".jingle-video-gif").attr("src", "data/jingle.gif");
		timeoutNext = setTimeout($scope.next, 2800);
	});
})

.controller('HomeCtrl', function ($scope, $ionicHistory, AnalyticsService) {
	$scope.$on('$ionicView.enter', function(e) {
		AnalyticsService.trackView('Home');
	});
	
	$ionicHistory.clearHistory();

})

.controller('CreateAccountCtrl', function ($rootScope, $scope, $ionicHistory, $state, LocalStorage, $ionicPopup, AnalyticsService, NotifService) {
	$scope.$on('$ionicView.enter', function(e) {
		AnalyticsService.trackView('Choose Delegation');
	});
	$ionicHistory.clearHistory();
	
	$scope.delegations = $rootScope.delegations1.concat($rootScope.delegations2).sort();
	
	$scope.user = LocalStorage.getObject('user', null);
	if($scope.user == null) {
		$scope.user = {delegation: ''};
	}
	$scope.submit = function () {
		if (validateForm($scope.user)) {
			var day = ($rootScope.delegations1.indexOf($scope.user.delegation) > -1) ? 15 : 16;
			NotifService.initDelegation(day);
			$scope.user.day = day;
			LocalStorage.setObject('user', $scope.user);
			LocalStorage.setObject('subscribed', true);
			$state.go('app.home');
		}
		else {
			$ionicPopup.alert({
				title: 'Please choose your delegation.',
				okType: 'button-dark'
			});
		}
	}

	var validateForm = function (user) {
		return (user.delegation && user.delegation != '');
	}
})

//
// ******************************************************************************************************

// ******************************************************************************************************
// Program

.controller('ProgramCtrl', function ($scope, $ionicScrollDelegate, $location, AnalyticsService) {
	$scope.$on('$ionicView.enter', function(e) {
		AnalyticsService.trackView('Program');
	});
	
	$scope.toggleProgram = function (day) {
		$location.hash('bt-program-day' + day);
		$('#program-day' + day).slideToggle({
			done: function () {
				if ($(this).css('display') == 'none') {
					$('#bt-program-day' + day + '>i').removeClass('ion-chevron-up').addClass('ion-chevron-down');
					$ionicScrollDelegate.scrollTop(true);
				} else {
					$('#bt-program-day' + day + '>i').removeClass('ion-chevron-down').addClass('ion-chevron-up');
					$ionicScrollDelegate.anchorScroll(true);
				}
			}
		});
	}
})

//
// ******************************************************************************************************

// ******************************************************************************************************
// Performers

.controller('PerformersCtrl', function ($scope, PerformersService, AnalyticsService) {
	$scope.$on('$ionicView.enter', function(e) {
		AnalyticsService.trackView('Performers');
	});
	
	PerformersService.get(function (performers) {
		$scope.performers = performers.performers;
	});
})

.controller('PerformerCtrl', function ($scope, $stateParams, PerformersService, AnalyticsService) {
	$scope.$on('$ionicView.enter', function(e) {
		AnalyticsService.trackView('Performer');
	});
	
	var findPerformer = function (performers) {
		if (performers) {
			for (var i = 0; i < performers.length; i++) {
				if (performers[i].performerId && $stateParams.perfId == performers[i].performerId) {
					return performers[i];
				}
			}
		}
	}

	PerformersService.get(function (performers) {
		$scope.perf = findPerformer(performers.performers);
	});
})

//
// ******************************************************************************************************

// ******************************************************************************************************
// PHOTOS & VIDEOS

.controller('PhotosVideosCtrl', function ($scope, PhotosService, VideosService, $ionicPlatform, $ionicModal, $ionicSlideBoxDelegate, AnalyticsService) {
	$scope.$on('$ionicView.enter', function(e) {
		AnalyticsService.trackView('Photos');
	});
	$scope.onTabSelected = function(tab) {
		AnalyticsService.trackView(tab);
	}
	
	// **************************************************************************************
	// photos
	
	PhotosService.get(function (json) {
		$scope.photos = json.day1.concat(json.day2, json.day3);
	});

	var carIndex = 0;
	var modal;
	var modalShown = false;

	$ionicModal.fromTemplateUrl('templates/image-modal.html', {
		scope: $scope,
		animation: 'fade'
	}).then(function (mod) {
		modal = mod;
	});

	function openModal() {
		modal.show();
		if (ionic.Platform.isWebView()) {
			StatusBar.hide();
		}
	}

	$scope.closeModal = function () {
		modal.hide();
	};
	$scope.$on('modal.hidden', function () {
		if (ionic.Platform.isWebView() && (ionic.Platform.isAndroid() || ionic.Platform.isIOS())) {
			StatusBar.show();
		}
		modalShown = false;
	});

	$scope.$on('modal.shown', function () {
		modalShown = true;
		resizeCarousel();
		setTimeout(function() {
			$ionicSlideBoxDelegate.slide(carIndex);
		}, 10);
	});

	window.onresize = function () {
		if (modalShown) {
			resizeCarousel();
		}
	};

	var resizeCarousel = function () {
		document.getElementById('carousel-modal').style.height = document.documentElement.clientHeight + "px";
		document.getElementById('carousel-modal').style.lineHeight = document.documentElement.clientHeight + "px";
	}

	$scope.showFullScreenImage = function (index) {
		carIndex = index;
		openModal();
	};
	
	// **************************************************************************************
	// videos
	$scope.showIframe = !ionic.Platform.isAndroid();
	
	VideosService.get(function (json) {
		$scope.videos = json.videos;
	});
	
	$scope.share = function(url) {
		if(typeof window.plugins.socialsharing !== 'undefined') {
			$ionicPlatform.ready(function () {
				if(url != null) {
					window.plugins.socialsharing.share(null, null, null, url);
				}
				else {
					window.plugins.socialsharing.share(null, null, $scope.photos[$ionicSlideBoxDelegate.currentIndex()].url);
				}
			});
		}
	}
})

//
// ******************************************************************************************************

// ******************************************************************************************************
// POIs

.controller('GuideCtrl', function ($scope, $ionicScrollDelegate, PoiService, AnalyticsService) {
	$scope.$on('$ionicView.enter', function(e) {
		AnalyticsService.trackView('City Guide');
	});
	
	$scope.pois = PoiService.get();
	
	$scope.$on('$ionicView.enter', function(e) {
		$ionicScrollDelegate.anchorScroll(true);
	});
})

.controller('PoisCtrl', function ($scope, $ionicScrollDelegate, PoiService, AnalyticsService) {
	$scope.$on('$ionicView.enter', function(e) {
		AnalyticsService.trackView('Information');
	});
	
	$scope.pois = PoiService.get();

	var slideUpDone = function (elem) {
		elem.children('.icon').removeClass('ion-chevron-up').addClass('ion-chevron-down');
	}

	$('.poi-category-bt').click(function () {
		var bt = $(this);
		var list = bt.next('.poi-category-list');

		if (list.css('display') == 'none') {
			list.slideDown({
				done: function () {
					bt.children('.icon').removeClass('ion-chevron-down').addClass('ion-chevron-up');
				}
			});
			list.siblings('.poi-category-list').slideUp({
				done: slideUpDone(bt.siblings('.poi-category-bt'))
			});
		} else {
			list.slideUp({
				done: slideUpDone(bt)
			});
		}
		$ionicScrollDelegate.scrollTop(true);
	});

})

.controller('PoiCtrl', function ($scope, $stateParams, PoiService, Utils, AnalyticsService) {
	$scope.$on('$ionicView.enter', function(e) {
		AnalyticsService.trackView('Information detail');
	});

	var findPoi = function (pois) {
		if (pois) {
			for (var i = 0; i < pois.length; i++) {
				if (pois[i].id && $stateParams.poiId == pois[i].id) {
					return pois[i];
				}
			}
		}
	}

	PoiService.get(function (pois) {
		$scope.poi =
			findPoi(pois.hotels) ||
			findPoi(pois.restaurants) ||
			findPoi(pois.bars) ||
			findPoi(pois.clubs) ||
			findPoi(pois.practical);

		Utils.isImage('data/pois/' + $scope.poi.id + '.jpg').then(function (result) {
			$scope.showImage = result;
		});
	});

})

.controller('MapCtrl', function ($scope, $stateParams, PoiService, AnalyticsService, Utils) {
	$scope.$on('$ionicView.enter', function(e) {
		AnalyticsService.trackView('Map');
	});
	
	$scope.poiId = $stateParams.poiId || '';

	var initMap = function () {
		var startPoint = L.latLng(-34.577095, -58.538101);
		var startZoom = 15;

		var map = L.map('map' + $scope.poiId, {
			zooms: [13, 14, 15, 16, 17, 18]
		}).setView(startPoint, startZoom);

		// offline maps
		L.tileLayer('./maps/{z}/{x}/{y}.png', {
			attribution: '',
			minZoom: 15,
			maxZoom: 18
		}).addTo(map);

		// online maps
		L.tileLayer('http://a.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			attribution: '&copy; <a href="http://openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
			minZoom: 13,
			maxZoom: 18
		}).addTo(map);

		//********************************************************
		// MY LOCATION

		var myPosIcon = L.icon({
			iconUrl: 'img/marker-loc.png',
			iconSize: [37, 45],
			iconAnchor: [10, 45]
		});

		var markerMyLoc = L.marker([0, 0], {
			icon: myPosIcon
		}).addTo(map);

		navigator.geolocation.watchPosition(function (pos) {
			markerMyLoc.setLatLng([pos.coords.latitude, pos.coords.longitude]);
		}, null, {
			enableHighAccuracy: true
		});

		//********************************************************
		// POIS

		var poisLayer = L.layerGroup()
			.addTo(map);

		var showPois = function (pois, markerNum) {
			if (pois) {
				for (var i = 0; i < pois.length; i++) {
					if (pois[i].lat && pois[i].lon) {
						var marker = new L.Marker([pois[i].lat, pois[i].lon], {
							icon: new L.Icon({
								iconUrl: 'img/marker' + markerNum + '.png',
								iconSize: new L.Point(25, 41),
								iconAnchor: new L.Point(12, 41),
								shadowUrl: 'img/marker-shadow.png',
								shadowSize: [41, 41],
								shadowAnchor: [12, 41],
								popupAnchor: new L.Point(0, -33)
							})
						}).addTo(poisLayer);

						Utils.poiImageExists(pois[i], marker, markerNum).then(function (result) {
							var popup = "";
							if(result.showImage) {
								popup += "<p class=\"center\"><img src=\"data/pois/" + result.poi.id + ".jpg\" alt=\"" + result.poi.name + "\"/>";
								if(result.poi.copyright != undefined) {
									popup += "<br /><span>" + result.poi.copyright + "</span>";
								}
								popup += "</p>";
							}
							
							// hotels
							if (result.markerNum == 1) {
								popup += "<span>" + result.poi.name + "</span>";
							}
							// city guide
							else if (result.markerNum == 5) {
								popup += "<a href='#/app/cityguide#" + result.poi.id + "'>" + result.poi.name + "</a>";
							}
							// autres
							else {
								popup += "<a href='#/app/infodetail/" + result.poi.id + "'>" + result.poi.name + "</a>";
							}
							result.marker.bindPopup(popup);
						});

						if (pois[i].id && $scope.poiId == pois[i].id) {
							startPoint = L.latLng(pois[i].lat, pois[i].lon);
							startZoom = 19;
							map.setView(startPoint, startZoom);
						}
					}
				}
			}
		}

		$scope.pois = PoiService.get(function (pois) {
			showPois($scope.pois.hotels, 1);
			showPois($scope.pois.restaurants, 2);
			showPois($scope.pois.bars, 3);
			showPois($scope.pois.clubs, 4);
			showPois($scope.pois.cityGuide, 5);
			showPois($scope.pois.practical, 6);
		});
	}

	ionic.DomUtil.ready(function () {
		initMap();
	});
})

//
// ******************************************************************************************************


// ******************************************************************************************************
// autre

.controller('WeatherCtrl', function ($scope, AnalyticsService, WeatherService) {
	$scope.$on('$ionicView.enter', function(e) {
		AnalyticsService.trackView('Weather');
	});
	
	var weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
	
	var icons = {
			"01d": "ion-ios-sunny-outline",
			"02d": "ion-ios-partlysunny-outline",
			"03d": "ion-ios-cloudy-outline",
			"04d": "ion-ios-cloudy-outline",
			"09d": "ion-ios-rainy-outline",
			"10d": "ion-ios-rainy-outline",
			"11d": "ion-ios-thunderstorm-outline",
			"13d": "ion-ios-snowy",
			"50d": "ion-ios-cloudy-outline"
		};
	
	function daysBetween(first, second) {
		var date1 = Date.UTC(first.getFullYear(), first.getMonth(), first.getDate());
		var date2 = Date.UTC(second.getFullYear(), second.getMonth(), second.getDate());
		var ms = date1-date2;
		return Math.round(ms/1000/60/60/24);
	}
	
	$scope.day1 = {
		"day": "Today",
		"icon": "ion-ios-sunny-outline",
		"min": 0,
		"max": 0,
		"weather": "",
		"first": true
	};
	$scope.day2 = {
		"day": "",
		"icon": "ion-ios-sunny-outline",
		"min": 0,
		"max": 0,
		"weather": "",
		"first": true
	};
	$scope.day3 = {
		"day": "",
		"icon": "ion-ios-sunny-outline",
		"min": 0,
		"max": 0,
		"weather": "",
		"first": true
	};
	
	WeatherService.get(function(meteo) {		
		var now = new Date();
		
		meteo.list.forEach(function(day) {
			var dt = new Date(day.dt*1000);
			var diff = daysBetween(dt, now);
			var currentDay;
			
			if(diff < 3) {
				if(diff == 0) {
					currentDay = $scope.day1;
				}
				else if(diff == 1) {
					currentDay = $scope.day2;
					currentDay.day = weekDays[dt.getDay()];
				}
				else if(diff == 2) {
					currentDay = $scope.day3;
					currentDay.day = weekDays[dt.getDay()];
				}

				// weather
				if(diff == 0 && currentDay.first && dt.getUTCHours() > 15) {
					currentDay.weather = day.weather[0].description;
					currentDay.icon = icons[day.weather[0].icon];
				}
				else if(dt.getUTCHours() == 15) {
					currentDay.weather = day.weather[0].description;
					currentDay.icon = icons[day.weather[0].icon];
				}
				
				// temps
				if(currentDay.first) {
					currentDay.min = day.main.temp_min;
					currentDay.max = day.main.temp_max;
				}
				else {
					if(day.main.temp_min < currentDay.min) {
						currentDay.min = day.main.temp_min;
					}
					if(day.main.temp_max > currentDay.max) {
						currentDay.max = day.main.temp_max;
					}
				}
				
				currentDay.first = false;
			}
		});
		$scope.day1.min = Math.round($scope.day1.min);
		$scope.day1.max = Math.round($scope.day1.max);
		$scope.day2.min = Math.round($scope.day2.min);
		$scope.day2.max = Math.round($scope.day2.max);
		$scope.day3.min = Math.round($scope.day3.min);
		$scope.day3.max = Math.round($scope.day3.max);
	});
})

.controller('ConnectCtrl', function ($scope, TwitterREST, AnalyticsService, Instagram) {
	var hashtags = ['lorealpro',
					'profiber',
					'glamteam',
					'infinium',
					'lbf2015',
					'lpbf2015',
					'lpbf',
					'lbfcannes',
					'businessforum',
					'lpbfcannes'
					];
	$scope.typeTwitter = 1;
	$scope.typeInstagram = 2;
	
	var refreshFeed = function() {
		$scope.feedLoaded = false;
		
		var twitterOK = false;
		var instagramsOK = 0;
		
		var allFeedsOK = function() {
			return (instagramsOK == hashtags.length && twitterOK);
		}
		
		/* *************************************************** */
		/* twitter */
		
		var tweets = [];
		
		TwitterREST.sync(hashtags).then(function (res) {
			if(res.statuses) {
				for(var i=0; i<res.statuses.length; i++) {
					tweets.push({
						id: res.statuses[i].id_str,
						link : 'https://twitter.com/' + res.statuses[i].user.screen_name + '/status/' + res.statuses[i].id_str,
						text : res.statuses[i].text,
						created : new Date(res.statuses[i].created_at).getTime(),
						user : {
							pseudo : res.statuses[i].user.screen_name,
							name : res.statuses[i].user.name,
							picture : res.statuses[i].user.profile_image_url
						},
						type : $scope.typeTwitter
					});
				}
			}
			
			twitterOK = true;
			if(allFeedsOK()) {
				mix();
			}
		});
		
		/* *************************************************** */
		/* instagram */
		
		var instagrams = [];
		
		var instagramSuccess = function(res) {
			if (res.meta.code == 200 && res.data.length > 0) {
				var inst = [];
				for(var i=0; i<res.data.length; i++) {
					inst.push({
						id : res.data[i].id,
						link : res.data[i].link,
						image : res.data[i].images.standard_resolution.url,
						created : res.data[i].created_time*1000,
						user : {
							pseudo : res.data[i].user.username,
							name : res.data[i].user.full_name,
							picture : res.data[i].user.profile_picture
						},
						type : $scope.typeInstagram
					});
				}
				instagrams = instagrams.concat(inst);
			}
			
			instagramsOK++;
			if(allFeedsOK()) {
				mix();
			}
		};

		for (var i = 0; i < hashtags.length; i++) {
			Instagram.get(5, hashtags[i])
				.success(function (response) {
					instagramSuccess(response);
				})
				.error(function() {
					instagramsOK++;
					if (allFeedsOK()) {
						mix();
					}
				});
		}
		
		/* ********************************************************* */
		/* mix twitter and instagram */
		
		var mix = function() {
			var feed = tweets.concat(instagrams);
			feed.sort(function(a, b) {
				return b.created - a.created;
			});
			$scope.feed = feed;
			$scope.feedLoaded = true;
		}
	}
	
	$scope.$on('$ionicView.enter', function(e) {
		AnalyticsService.trackView('#Connect');
		
		refreshFeed();		
	});
})

// ******************************************************************************************************
// SURVEY

.controller('SurveyCtrl', function ($state, $scope, AnalyticsService, EventsService, LocalStorage) {
	$scope.$on('$ionicView.enter', function(e) {
		AnalyticsService.trackView('Live Feedbacks');
		
		EventsService.get().then(function(evs) {
			$scope.events = evs;
		});
		
	});
	
	$scope.submit = function() {
		for(var i=0; i<$scope.events.length; i++) {
			var ev = $scope.events[i];
			if(typeof ev.note !== 'undefined') {
				LocalStorage.setObject("survey" + ev.eventId, ev);
			}
		}
		EventsService.post();
		$state.go('app.home');
	}
})

// ******************************************************************************************************
// KITS

.controller('KitCtrl', function ($scope, AnalyticsService, KitsService, LocalStorage, $ionicPopup, $http) {
	$scope.$on('$ionicView.enter', function(e) {
		AnalyticsService.trackView('My kit');
	});
	
	var dateShowKits = new Date(2015, 8, 20).getTime(); // month starts at 0, 8 = septembre
	var now = Date.now();
//	now = new Date(2015, 8, 21);

	$scope.showKits = now > dateShowKits;
	
	if($scope.showKits) {
		$scope.user = LocalStorage.getObject('user', {email: ''});
		
		$scope.sendEmail = function(id) {
			var myPopup = $ionicPopup.show({
				template: '<input type="email" ng-model="user.email">',
				title: 'Please enter your e-mail address',
				scope: $scope,
				buttons: [
					{
						text: 'Cancel',
						type: 'button-outline button-light',
					},
					{
						text: 'Send',
						type: 'button-outline button-light',
						onTap: function (e) {
							if (!$scope.user.email) {
								e.preventDefault();
							} else {
								LocalStorage.setObject('user', $scope.user);
								var url = 'http://tatin.phonpix.com/LPBF/WSKits/send?email=' + $scope.user.email + '&kitId=' + id;
								$http.post(url);
							}
						}
					  }
					]
			});
		}
		
		KitsService.get(function(res) {
			$scope.kits = res.kits;
		});
	}
})

// ******************************************************************************************************
// analytics restant

.controller('CityLifeCtrl', function ($scope, AnalyticsService) {
	$scope.$on('$ionicView.enter', function(e) {
		AnalyticsService.trackView('City Life');
	});
})

.controller('SanMartinCtrl', function ($scope, AnalyticsService) {
	$scope.$on('$ionicView.enter', function(e) {
		AnalyticsService.trackView('San Martin');
	});
})

.controller('InscripcionCtrl', function ($scope, AnalyticsService) {
	$scope.$on('$ionicView.enter', function(e) {
		AnalyticsService.trackView('San Martin');
	});
})

.controller('SpeakFrenchCtrl', function ($scope, AnalyticsService) {
	$scope.$on('$ionicView.enter', function(e) {
		AnalyticsService.trackView('Speak French');
	});
})

;