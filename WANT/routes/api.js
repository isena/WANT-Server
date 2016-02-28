module.exports = (function() {
	'use strict';

	var request = require('request');
	var watson = require('watson-developer-cloud');
	var htmlToText = require('html-to-text');
	var Cloudant = require('cloudant');
	var guardianKey = "<<REPLACE_IT>>";
	var languageTranslation = watson.language_translation({
		username: '<<REPLACE_IT>>',
		password: '<<REPLACE_IT>>',
		version: 'v2'
	});
	var cloudant = Cloudant({
		account: '<<REPLACE_IT>>',
		password: '<<REPLACE_IT>>'
	});
	var db = cloudant.db.use('want-db');
	var router = require('express').Router();

	router.get("/hello", function(request, response) {
		response.json({
			"Error": false,
			"Message": "Hello World!!!!11!"
		});
	});

	function decodeBase64(base64) {
		var buffer = new Buffer(base64, 'base64');
		return buffer.toString('ascii');
	}

	router.get("/news", function(request, response) {
		var req = require('request');
		var result;
		var success = false;
		var url = 'http://content.guardianapis.com/search?api-key=' + guardianKey;

		req(url, function(error, apiResponse, body) {

			if (error) {
				result = {
					error: error
				}
			} else if (apiResponse.statusCode != 200) {
				result = {
					error: {
						code: apiResponse.statusCode,
						detail: 'The request code wasn\'t 200'
					}
				}
			} else {
				success = true;
				result = JSON.parse(body).response.results;
			}

			response.json({
				"success": success,
				"result": result
			});
		});
	});

	router.get("/news/:articleID", function(request, response) {
		var success = false;
		var result;

		db.get(request.params.articleID, function(err, data) {
			if (err) {
				if (err.statusCode == 404) {
					console.log("article is not in db");

					var articleID = decodeBase64(request.params.articleID);
					var url = 'http://content.guardianapis.com/' + articleID + '?show-fields=body&api-key=' + guardianKey;
					var req = require('request');

					req(url, function(error, apiResponse, body) {
						if (error) {
							result = {
								error: error
							}

							response.json({
								"success": success,
								"result": result
							});
						} else if (apiResponse.statusCode != 200) {
							result = {
								error: {
									code: apiResponse.statusCode,
									detail: 'The request code wasn\'t 200'
								}
							}

							response.json({
								"success": success,
								"result": result
							});
						} else {
							db.insert(JSON.parse(body), request.params.articleID, function(err, dbBody, dbHeader) {
								if (err) {
									console.log('db.insert[err]: ' + err);

									result = {
										error: err
									};
								} else {
									var htmlText = JSON.parse(body).response.content.fields.body;

									var text = htmlToText.fromString(htmlText, {
										wordwrap: false,
										ignoreHref: true
									});

									success = true;
									result = {
										originalText: text
									};
								}

								response.json({
									"success": success,
									"result": result
								});
							});
						}
					});
				} else {
					result = {
						error: err
					}

					response.json({
						"success": success,
						"result": result
					});
				}
			} else {
				console.log("article is in db");

				var htmlText = data.response.content.fields.body;

				var text = htmlToText.fromString(htmlText, {
					wordwrap: false,
					ignoreHref: true
				});

				var translatedText = data.response.content.translatedText;

				success = true;
				result = {
					originalText: text,
					translatedText: translatedText
				};

				response.json({
					"success": success,
					"result": result
				});
			}
		});
	});

	router.get("/translate/:articleID", function(request, response) {
		var success = false;
		var result;

		db.get(request.params.articleID, {
			revs_info: true
		}, function(err, data) {
			if (err) {
				result = {
					error: err
				}

				response.json({
					"success": success,
					"result": result
				});
			} else {
				console.log("article is in db");

				if (typeof data.response.content.translatedText == 'undefined' && data.response.content.translatedText == null) {

					console.log("there is no data.response.content.translatedText");

					var htmlText = data.response.content.fields.body;

					var originalText = htmlToText.fromString(htmlText, {
						wordwrap: false,
						ignoreHref: true
					});

					languageTranslation.translate({
						text: originalText,
						source: "en",
						target: "pt"
					}, function(err, translation) {
						console.log("translating text");

						if (err) {
							result = {
								error: err
							}

							response.json({
								"success": success,
								"result": result
							});
						} else {
							var translatedText = translation.translations[0].translation;

							data.response.content.translatedText = translatedText;

							db.insert(data, request.params.articleID, function(err, dbBody, dbHeader) {
								console.log("inserting translation");

								if (err) {
									console.log('db.insert[err]: ' + err);

									result = {
										error: err
									};
								} else {
									success = true;

									result = {
										translatedText: translatedText
									};
								}

								response.json({
									"success": success,
									"result": result
								});
							});
						}
					});
				} else {
					console.log("there is data.response.content.translatedText")
					success = true;

					response.json({
						"success": success,
						"result": {
							translatedText: data.response.content.translatedText
						}
					});
				}
			}
		});
	});

	return router;
})();