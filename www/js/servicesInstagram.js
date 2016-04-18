angular.module('instagramFeed.services', [])

.factory('Instagram', function($http) {
	var base = "https://api.instagram.com/v1";
	
	var clientId = 'fa79bb3f6f3b4390a4f72993d0143ea3';
	return {
		'get': function(count, hashtag) {
			var request = '/tags/' + hashtag + '/media/recent';
			var url = base + request;
			var config = {
				'params': {
					'client_id': clientId,
					'count': count
//					,'callback': 'JSON_CALLBACK'
				}
			};
//			return $http.jsonp(url, config);
			return $http.get(url, config);
		}
	};
});