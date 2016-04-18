angular.module('starter.services', ['ngResource'])

//********************************************************************************
// LOCAL STORAGE

.factory('LocalStorage', function ($window) {
	return {
		set: function (key, value) {
			$window.localStorage[key] = value;
		},
		get: function (key, defaultValue) {
			return $window.localStorage[key] || defaultValue;
		},
		setObject: function (key, value) {
			$window.localStorage[key] = JSON.stringify(value);
		},
		getObject: function (key, defaultValue) {
			if ($window.localStorage[key]) {
				return JSON.parse($window.localStorage[key]);
			} else {
				return defaultValue;
			}
		}
	}
})

//
//********************************************************************************

//********************************************************************************
// NOTIF

.factory('NotifService', function ($rootScope, LocalStorage, $state, $ionicPopup) {
	var notifIdHome = 100;
	var notifIdProg = 200;
	var notifIdPhot = 300;
	var notifIdKits = 400;
	var notifIdSurv = 500;
	var now = Date.now();
	
	var schedule = function(notifId, notifTime, text) {
		if(now - notifTime.getTime() < 0) {
			cordova.plugins.notification.local.schedule({
				id: notifId,
				text: text,
				smallIcon: 'res://smallicon',
				at: notifTime
			});
		}
	}
	
	return {
		init: function() {
			if (ionic.Platform.isWebView()) {
				
				// **********************************************************************************
				// events
				
				var goto = function(notificationId) {
					if(notificationId - notifIdSurv > 0) {
						$state.go('app.survey');
					}
					else if(notificationId - notifIdKits > 0) {
						$state.go('app.mykit');
					}
					else if(notificationId - notifIdPhot > 0) {
						$state.go('app.photosvideos');
					}
					else if(notificationId - notifIdProg > 0) {
						$state.go('app.program');
					}
					else {
						$state.go('app.home');
					}
				}
				
				cordova.plugins.notification.local.on("click", function (notification, state) {
					goto(notification.id);
				}, this);
				
				cordova.plugins.notification.local.on("trigger", function (notification, state) {
					var notifCat = notifIdHome;
					if(notification.id - notifIdSurv > 0) {
						notifCat = notifIdSurv;
					}
					else if(notification.id - notifIdKits > 0) {
						notifCat = notifIdKits;
					}
					else if(notification.id - notifIdPhot > 0) {
						notifCat = notifIdPhot;
					}
					else if(notification.id - notifIdProg > 0) {
						notifCat = notifIdProg;
					}
					
					for(var i = notifCat+1; i < notifCat+11; i++) {
						if(i != notification.id) {
							cordova.plugins.notification.local.clear(i);
						}
					}
					
					if(state == "foreground" && ionic.Platform.isIOS()) {
						var confirmPopup = $ionicPopup.confirm({
							template: notification.text,
							okType: 'button-dark',
							cancelType: 'button-dark'
						});
						confirmPopup.then(function (res) {
							if (res) {
								goto(notification.id);
							}
						});
					}
					
				}, this);

				// **********************************************************************************
				// schedule
				
				if (!LocalStorage.getObject('notifScheduled', false)) {
					schedule(notifIdProg + 1, new Date(2015, 8, 14, 13, 0), 'Hello! Don\'t forget to check today\'s program!');
					schedule(notifIdProg + 2, new Date(2015, 8, 15, 13, 0), 'Hello! Don\'t forget to check today\'s program! Tonight\'s dress code is: Coachella.');
					schedule(notifIdProg + 3, new Date(2015, 8, 16, 13, 0), 'Hello! Don\'t forget to check today\'s program! Tonight\'s dress code is: Red Carpet.');
					
					schedule(notifIdHome + 1, new Date(2015, 8, 17, 8, 0), 'Goodbye! Please connect your phone to Internet before leaving so that we can collect your feedbacks.');
					schedule(notifIdHome + 2, new Date(2015, 8, 14, 10, 0), 'Dear Attendee, Welcome to the L’Oréal Professionnel Business Forum!');
					
					schedule(notifIdKits + 1, new Date(2015, 8, 20, 10, 0), 'They\'re here! Download your L\'Oréal Professionnel educational kits.');
					
					schedule(notifIdPhot + 1, new Date(2015, 8, 15, 13, 0), 'Your daily photos & videos are now available!');
					schedule(notifIdPhot + 2, new Date(2015, 8, 16, 13, 0), 'Your daily photos & videos are now available!');
					schedule(notifIdPhot + 3, new Date(2015, 8, 17, 13, 0), 'Your daily photos & videos are now available!');
					
					schedule(notifIdSurv + 1, new Date(2015, 8, 14, 19, 45), 'Give us you feedback on the L\'Oréal Business Forum!');
					schedule(notifIdSurv + 2, new Date(2015, 8, 14, 20, 15), 'Give us you feedback on the L\'Oréal Business Forum!');
					schedule(notifIdSurv + 3, new Date(2015, 8, 15, 19, 30), 'Give us you feedback on the L\'Oréal Business Forum!');
					schedule(notifIdSurv + 4, new Date(2015, 8, 15, 20, 0), 'Give us you feedback on the L\'Oréal Business Forum!');
					schedule(notifIdSurv + 5, new Date(2015, 8, 15, 20, 30), 'Give us you feedback on the L\'Oréal Business Forum!');
					schedule(notifIdSurv + 6, new Date(2015, 8, 16, 19, 0), 'Give us you feedback on the L\'Oréal Business Forum!');
					schedule(notifIdSurv + 7, new Date(2015, 8, 16, 19, 30), 'Give us you feedback on the L\'Oréal Business Forum!');
					schedule(notifIdSurv + 8, new Date(2015, 8, 16, 20, 30), 'Give us you feedback on the L\'Oréal Business Forum!');

					LocalStorage.setObject('notifScheduled', true);
				}
			}
		},
		initDelegation: function(day) {
			if (ionic.Platform.isWebView() && !LocalStorage.getObject('notifScheduledDe', false)) {
				schedule(notifIdProg + 4, new Date(2015, 8, day, 9, 0), 'Good morning! Don\'t forget today\'s morning masterclass! For more information, check out the program.');
				schedule(notifIdSurv + 9, new Date(2015, 8, day, 13, 0), 'Give us you feedback on the L\'Oréal Business Forum!');
				
				LocalStorage.setObject('notifScheduledDe', true);
			}
		}
	}
})
//
//********************************************************************************

//********************************************************************************
// DATA

.factory('PhotosService', function ($resource) {
	return $resource('http://tatin.phonpix.com/LPBF/WSPhotos');
})

.factory('VideosService', function ($resource) {
	return $resource('http://tatin.phonpix.com/LPBF/WSVideos');
})

.factory('PoiService', function ($resource) {
	return $resource('data/pois.json');
})

.factory('PerformersService', function ($resource) {
	return $resource('data/performers.json');
})

.factory('KitsService', function ($resource) {
	return $resource('http://tatin.phonpix.com/LPBF/WSKits');
})

.factory('WeatherService', function ($resource) {
	return $resource('http://api.openweathermap.org/data/2.5/forecast?id=3028808&units=metric');
})

.factory('EventsService', function ($resource, LocalStorage, $http, $q) {
	
	var postEvent = function(eventId, delegation) {
		var evStored = LocalStorage.getObject("survey" + eventId, null);
		
		if(evStored != null && (typeof evStored.sent=='undefined' || !evStored.sent)) {
			/*$http.post('http://tatin.phonpix.com/LPBF/WSSurvey/create?delegation=' + delegation + '&eventId=' + evStored.eventId + '&note=' + evStored.note).
			success(function (data, status, headers, config) {*/
				evStored.sent = true;
				LocalStorage.setObject("survey" + eventId, evStored);
			//}	);
		}
	}
	
	return {
		events: function() {
			return $resource('data/events.json');
		},
		get: function() {
			var deferred = $q.defer();
			
			var events = [];
			var user = LocalStorage.getObject('user', null);
			if(user != null) {
				if(typeof user.day == 'undefined') {
					user.day = 16;
				}
				this.events().get(function(res) {
					var now = new Date();
					
					for(var i=0; i<res.events.length; i++) {
						var ev = res.events[i];
						var date;
						if(ev.eventId == 3 || ev.eventId == 4 || ev.eventId == 5) {
							date = new Date(2015, 8, user.day, 12, 45);
						}
						else {
							date = new Date(ev.date);
							date.setHours(ev.endH, ev.endM);
						}

						var evStored = LocalStorage.getObject("survey" + ev.eventId, null);
						if(evStored == null && now.getTime() > date.getTime()) {
							events.push(ev);
						}
					}
					deferred.resolve(events);
				});
			}
			return deferred.promise;
		},
		post: function() {
			this.events().get(function(res) {
				
				var delegation = LocalStorage.getObject('user', {delegation: 'unknown'}).delegation;
				
				for(var i=0; i<res.events.length; i++) {
					var ev = res.events[i];
					postEvent(ev.eventId, delegation);
				}
			});
		}
	}
})



//
//********************************************************************************
.factory('AnalyticsService', function () {
	return {
		init: function() {
			if (typeof analytics !== 'undefined'){
				analytics.startTrackerWithId('UA-65448673-1');
				analytics.setUserId(device.uuid);
				analytics.trackView('start app');
			}
		},
		trackView: function (view) {
			if (typeof analytics !== 'undefined'){
				analytics.trackView(view);
			}
		}
	};
})

.factory('Utils', function ($q) {
	return {
		isImage: function (src) {
			var deferred = $q.defer();

			var image = new Image();
			image.onerror = function () {
				deferred.resolve(false);
			};
			image.onload = function () {
				deferred.resolve(true);
			};
			image.src = src;

			return deferred.promise;
		},
		poiImageExists: function (poi, marker, markerNum) {
			var deferred = $q.defer();

			var image = new Image();
			image.onerror = function () {
				deferred.resolve({poi: poi, showImage: false, marker: marker, markerNum: markerNum});
			};
			image.onload = function () {
				deferred.resolve({poi: poi, showImage: true, marker: marker, markerNum: markerNum});
			};
			image.src = 'data/pois/' + poi.id + '.jpg';

			return deferred.promise;
		}
	};
})


//********************************************************************************
// PUSH REGISTER

.factory('PushService', function ($http, LocalStorage) {

	var notifServerURL = 'http://m.abphone.com/notifications';
	
	function initPush() {
		if (ionic.Platform.isWebView()) {
			var pushNotification = window.plugins.pushNotification;

			if (ionic.Platform.isAndroid()) {
				console.log('Registering with GCM server');
				pushNotification.register(
					gcmSuccessHandler,
					errorHandler, {
						"senderID": "475815711625",
						"ecb": "onNotificationGCM"
					});
			} else if (ionic.Platform.isIOS()) {
				console.log('Registering with APN service');
				pushNotification.register(
					apnTokenHandler,
					errorHandler, {
						"badge": "true",
						"sound": "false",
						"alert": "true",
						"ecb": "onNotificationAPN"
					});
				console.log('Registering with APN service af');
			}
		}
	}

	function gcmSuccessHandler(result) {
		console.log('NOTIFY  pushNotification.register succeeded.  Result = ' + result);
	}

	function apnTokenHandler(result) {
		console.log('NOTIFY  pushNotification.register succeeded.  Result = ' + result);
		registerToServer(result);
	}

	function errorHandler(error) {
		console.log('push register error :  ' + error);
	}

	function registerToServer(id) {
		if(!LocalStorage.getObject('pushRegistered', false)) {
			console.log('register id to server');
			
			var newId = "";
			var savedId = LocalStorage.get("deviceId", "");

			if (typeof id != 'undefined') { // called from registering at startup
				newId = id;
				LocalStorage.set("deviceId", newId);
			} else { // called from settings page
				newId = savedId;
			}

			if (newId != "") {
				var deviceType = '';
				if (ionic.Platform.isAndroid()) {
					deviceType = 'Android-';
				}

				$http({
					method: 'GET',
					url: notifServerURL + '/register.jsp',
					headers: {'app-name': deviceType + 'lpbf', 'action': 'add', 'device-token': newId}
				})
				.success(function() {
					console.log('register id to server success');
					LocalStorage.setObject('pushRegistered', true);
				});
			}
		}
	}

	return {
		initialize: function () {
			initPush();
		},
		register: function (id) {
			console.log('register');
			if (ionic.Platform.isWebView()) {
				registerToServer(id);
			}
		},
		unregister: function () {
			var push = window.plugins.pushNotification;
			if (push) {
				push.unregister(function () {
					console.log('unregister success');
				});
			}
		},
		resetBadge: function() {
			// not used => event pause not working properly on ios => reset badge in Objective-C
			var savedId = LocalStorage.get("deviceId", "");
			if (savedId != "") {
				var deviceType = '';
				if (ionic.Platform.isAndroid()) {
					deviceType = 'Android-';
				}

				$http({
					method: 'GET',
					url: notifServerURL + '/resetBadge.jsp',
					headers: {'app-name': deviceType + 'lpbf', 'action': 'resetBadge', 'device-token': savedId}
				});
			}
		}
	}
})
//
//********************************************************************************

;
// **********************************************************************
// receive notif
function onNotificationGCM(e) {
	console.log("LPBF PUSH notif");

	switch (e.event) {
		case 'registered':
			if (e.regid.length > 0) {
				console.log('REGISTERED with GCM Server -> REGID:' + e.regid);
				var elem = angular.element(document.querySelector('[ng-app]'));
				var injector = elem.injector();
				var myService = injector.get('PushService');
				myService.register(e.regid);
			}
			break;

		case 'message':
			console.log('LPBF PUSH message : ' + e.msg);
			break;

		case 'error':
			console.log('LPBF PUSH ERROR :' + e.msg);
			break;

		default:
			break;
	}
}

function onNotificationAPN(event) {
	cordova.plugins.notification.local.schedule({
		id: 1,
		text: event.alert
	});
}
//
// *****************************************************************************************
