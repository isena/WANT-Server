
# WANT - WAtson News Translator

WANT is a demo solution to translate news **from English to Portuguese** using [IBM Watson Translation](http://www.ibm.com/smarterplanet/us/en/ibmwatson/developercloud/language-translation.html).

## Backend

The iOS app connects to backend application that was built with [Node.js](https://nodejs.org) and is hosted on [Bluemix](http://www.ibm.com/cloud-computing/bluemix/) and rely on:

* Watson Translation services for translation;
* [Cloudant NoSQL DB](https://cloudant.com/) services for caching;
* [The Guardian APIs](http://open-platform.theguardian.com/) for news content.

##### Dependencies

* [Express](http://expressjs.com/);
* [Body Parser](https://github.com/expressjs/body-parser);
* [HTML to text](https://github.com/werk85/node-html-to-text);
* [Request](https://github.com/request/request#readme);

## Architecture Diagram

![getNews](./resources/architecture-diagram.png)

## REST Endpoints

### Get the latest news

```js
GET /api/news
```

##### Sequence Diagram

![getNews](./resources/SD-getNews.png)

##### Response (example)

```json
{
  "success": true,
  "result": [
    {
      "type": "article",
      "sectionId": "football",
      "webTitle": "Joel Matip’s signing has saved Liverpool millions, claims Jürgen Klopp",
      "webPublicationDate": "2016-02-16T22:30:04Z",
      "id": "football/2016/feb/16/liverpool-joel-matip-jurgen-klopp",
      "webUrl": "http://www.theguardian.com/football/2016/feb/16/liverpool-joel-matip-jurgen-klopp",
      "apiUrl": "http://content.guardianapis.com/football/2016/feb/16/liverpool-joel-matip-jurgen-klopp",
      "sectionName": "Football"
    },
    {
      "type": "liveblog",
      "sectionId": "us-news",
      "webTitle": "Trump gives voice to 'Scalia-was-murdered' conspiracy – campaign live",
      "webPublicationDate": "2016-02-16T22:27:13Z",
      "id": "uk-news/2016/feb/16/tim-newton-rachel-slater-climbers-missing-ben-nevis-mountain",
      "webUrl": "http://www.theguardian.com/us-news/live/2016/feb/16/us-presidential-election-campaign-live-coverage-trump-cruz-clinton-sharpton-george-jeb-bush-south-carolina-primary-nevada-caucus",
      "apiUrl": "http://content.guardianapis.com/us-news/live/2016/feb/16/us-presidential-election-campaign-live-coverage-trump-cruz-clinton-sharpton-george-jeb-bush-south-carolina-primary-nevada-caucus",
      "sectionName": "US news"
    }
  ]
}
```

### Get the article text

```js
GET /api/news/:articleID
```

##### Sequence Diagram

![getArticle](./resources/SD-getArticle.png)

##### Response (example)

```json
{
    "success": true,
    "result": {
        "originalText": "Apple rejects order to unlock gunman's phone..."
    }
}
```

### Get the article translated text

```js
GET /api/translate/:articleID
```

##### Sequence Diagram

![getArticle](./resources/SD-getArticleTranslation.png)


##### Response (example)

```json
{
    "success": true,
    "result": {
        "translatedText": "Apple rejeita pedido para desbloquear o telefone do atirador..."
    }
}
```

## Walkthrough

1. Run the app;
2. Select an article;
3. read the original article;
4. select **translated** and *voilà!*;
5. select **original** to go back to original text.

Simple as that! Do you not believe? See bellow!

![WANTgif](./resources/WANT.gif)

## iOS App

* It was written in Objective C;
* It uses [MVVM](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93viewmodel) as a software [architectural pattern](https://en.wikipedia.org/wiki/Architectural_pattern);
* It uses [AutoLayout](https://developer.apple.com/library/watchos/documentation/UserExperience/Conceptual/AutolayoutPG/Introduction/Introduction.html) for a responsive user interface;
* [Unit Tests](./frontend/WANT/WANTTests);
* [UI Tests](./frontend/WANT/WANTUITests);.

##### Dependencies (cocoapods)

* [Mantle](https://github.com/Mantle/Mantle);
* [SVProgressHUD](https://github.com/SVProgressHUD/SVProgressHUD);
* [VCRURLConnection](https://github.com/dstnbrkr/VCRURLConnection).

##### Support

The app was developed and tested with:

* XCode 7.1.1 and XCode 7.2.1;
* iOS 9 Simulator;
* OS X El Capitan 10.11.1;
* CocoaPods 0.39.0.

[You can take a look at iOS app code here](https://github.com/isena/WANT-iOS).

## TODO

- Improve HTML to plain text parser;
- Support to other languages;
- Local caching.
