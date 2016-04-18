// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', [
	'ionic',
	'starter.services',
	'starter.controllers',
	'twitterFeed.services',
	'twitterFeed.filters',
	'instagramFeed.services',
	'angular.filter'
])

.run(function ($ionicPlatform, $state, $ionicHistory, $rootScope, AnalyticsService, NotifService, EventsService, PushService) {
	$rootScope.delegations1 = ['France','Belgium','Switzerland fr','Switzerland ger','Germany','Nigeria','Djibouti','Ethiopie','Madagascar','Mauritius','Reunion island','Tunisia','Algeria','Canada','Nouvelle Caledonie','Russia','Ukraine','Baltic States','Poland','Bulgaria','Czech Republic','Serbia','Austria','Kazakhstan','Romania','Dubai','Egypt','Lebanon'];

	$rootScope.delegations2 = ['China','Singapore','Korea','Australia','Thailand','Iran','Argentina','Panama','Colombia','Mexico','Peru','Portugal','Philippines','Turkey','Italy','Denmark','Norway','Pakistan','South Africa','Sweden','Netherlands','Libye','Japan'];
	
	// *********************************
	// CLICK IN HTML NEW WIDOW
	window.onclick = clickEvent;
	function clickEvent(e) {
		e = e || window.event;
		var t = e.target || e.srcElement;
		if (t.name || t.href) {
			if (typeof t.href == "string" && t.href.substr(0, 4) == 'http') {
				if (t.attributes.href.value.substr(0, 1) != "#") {
					window.open(t.href, '_system', 'location=yes');
				}
				return false; // no further action for this click
			}
		}
		return true; // process click as normal
	}
	//
	// *********************************
	
	// *******************************************************
	// remplace l'action du bouton précédent pour revenir en arrière vers la home au lieu de quitter direct (priorité = 101)
	$ionicPlatform.registerBackButtonAction(function () {
		if (!$ionicHistory.backView() && $ionicHistory.currentStateName() != 'app.home') {
			$ionicHistory.nextViewOptions({
				disableAnimate: true,
				disableBack: true,
				historyRoot: true
			});
			$state.go('app.home');
		}
		else if ($ionicHistory.backView()) {
			$ionicHistory.goBack();
		}
		else {
			ionic.Platform.exitApp()
		}
	}, 101);

	$ionicPlatform.ready(function () {
		if(typeof navigator.splashscreen !== 'undefined') {
			navigator.splashscreen.hide();
		}
		
		$rootScope.openExternal = function (url) {
			window.open(url, '_system');
		};
		
		PushService.initialize();
		AnalyticsService.init();
		NotifService.init();
		EventsService.post(); // try to post live feedbacks if didn't work earlier
	});
})

.config(function ($stateProvider, $urlRouterProvider, $httpProvider, $sceDelegateProvider) {
	$stateProvider
	
	.state('jingle', {
		url: "/jingle",
		templateUrl: "templates/jingle-intro.html",
		controller: 'JingleCtrl'
	})
	
	.state('delegation', {
		url: "/delegation",
		templateUrl: "templates/delegation.html",
		controller: 'CreateAccountCtrl'
	})

	.state('app', {
		url: "/app",
		abstract: true,
		templateUrl: "templates/menu.html",
		controller: 'AppCtrl'
	})

	.state('app.home', {
		url: "/home",
		views: {
			'menuContent': {
				templateUrl: "templates/home.html",
				controller: 'HomeCtrl'
			}
		}
	})

	.state('app.program', {
		url: "/program",
		views: {
			'menuContent': {
				templateUrl: "templates/program.html",
				controller: 'ProgramCtrl'
			}
		}
	})

	.state('app.mykit', {
		url: "/mykit",
		views: {
			'menuContent': {
				templateUrl: "templates/mykit.html",
				controller: 'KitCtrl'
			}
		}
	})

	.state('app.performers', {
		url: "/performers",
		views: {
			'menuContent': {
				templateUrl: "templates/performers.html",
				controller: 'PerformersCtrl'
			}
		}
	})

	.state('app.performer', {
		url: "/performer/:perfId",
		views: {
			'menuContent': {
				templateUrl: "templates/performer.html",
				controller: 'PerformerCtrl'
			}
		}
	})

	.state('app.photosvideos', {
		url: "/photosvideos",
		views: {
			'menuContent': {
				templateUrl: "templates/photosvideos.html",
				controller: 'PhotosVideosCtrl'
			}
		}
	})

	// **********************************************************************
		//SAN MARTIN
	
	.state('app.inscripcion', {
		url: "/inscripcion",
		views: {
			'menuContent': {
				templateUrl: "templates/inscripcion.html",
				controller: 'InscripcionCtrl'
			}
		}
	})
	//SAN MARTIN
	
	.state('app.sanmartin', {
		url: "/sanmartin",
		views: {
			'menuContent': {
				templateUrl: "templates/sanMartin.html",
				controller: 'SanMartinCtrl'
			}
		}
	})
	
	// CITY LIFE
	
	.state('app.citylife', {
		url: "/citylife",
		views: {
			'menuContent': {
				templateUrl: "templates/citylife.html",
				controller: 'CityLifeCtrl'
			}
		}
	})

	.state('app.cityguide', {
		url: "/cityguide",
		views: {
			'menuContent': {
				templateUrl: "templates/cityguide.html",
				controller: 'GuideCtrl'
			}
		}
	})

	.state('app.weather', {
		url: "/weather",
		views: {
			'menuContent': {
				templateUrl: "templates/weather.html",
				controller: 'WeatherCtrl'
			}
		}
	})

	.state('app.map', {
		url: "/map",
		views: {
			'menuContent': {
				templateUrl: "templates/map.html",
				controller: 'MapCtrl'
			}
		}
	})

	.state('app.mappoi', {
		url: '/map/:poiId',
		views: {
			'menuContent': {
				templateUrl: 'templates/map.html',
				controller: 'MapCtrl'
			}
		}
	})

	.state('app.information', {
		url: "/information",
		views: {
			'menuContent': {
				templateUrl: "templates/information.html",
				controller: 'PoisCtrl'
			}
		}
	})

	.state('app.infodetail', {
		url: "/infodetail/:poiId",
		views: {
			'menuContent': {
				templateUrl: "templates/infodetail.html",
				controller: 'PoiCtrl'
			}
		}
	})
	
	.state('app.speakfrench', {
		url: "/speakfrench",
		views: {
			'menuContent': {
				templateUrl: "templates/speakfrench.html",
				controller: 'SpeakFrenchCtrl'
			}
		}
	})
	
	// **********************************************************************

	.state('app.connect', {
		url: "/connect",
		views: {
			'menuContent': {
				templateUrl: "templates/connect.html",
				controller: 'ConnectCtrl'
			}
		}
	})
	
	.state('app.survey', {
		url: "/survey",
		views: {
			'menuContent': {
				templateUrl: "templates/survey.html",
				controller: 'SurveyCtrl'
			}
		}
	})
    ;
	
	// if none of the above states are matched, use this as the fallback
	$urlRouterProvider.otherwise('/jingle');
	
	$sceDelegateProvider.resourceUrlWhitelist(['self', 'https://www.youtube.com/embed/**']);
	
	//Enable cross domain calls
	$httpProvider.defaults.useXDomain = true;
	//Remove the header used to identify ajax call  that would prevent CORS from working
	delete $httpProvider.defaults.headers.common['X-Requested-With'];
});
