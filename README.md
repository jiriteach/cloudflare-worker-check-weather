<img src="https://www.cloudflare.com/img/logo-cloudflare.svg" width="150">  

# Cloudflare Worker - Check Weather

Cloudflare Worker designed to retrieve weather information based on location specified through url parameters.

Uses the Weather API from https://www.weatherapi.com/ to retrieve weather information.

## Using a Browser

`"https://cloudflare.worker.url/?" + latitude + "," + longitude + "&timestamp=" + timestamp` returns weather information based on the latitude and longitude specified.

Example request - 

```
https://cloudflare.worker.url/?negative41.217,174.833&timestamp=1718183482615
```

Example response - 
```
{
  "weather": {
    "temperature": 8.1,
    "windSpeed": 6.1,
    "windGust": 16.4,
    "windDirection": "NNE"
  },
  "location": {
    "name": "Lower Hutt",
    "region": "",
    "country": "New Zealand",
    "latitude": -41.22,
    "longitude": 174.83
  }
}
```

Parameters - 
* `latitude` - latitude of location. Can be retrieved using `navigator.geolocation.getCurrentPosition` from the browser. Where latitude contains a negative symbol - this needs to be parsed so use - `let latitude = clientPosition.latitude.toFixed(3).toString().replace("-", "negative");`

* `longitude` - longitude of location. Can be retrieved using `navigator.geolocation.getCurrentPosition` from the browser.  Where longitude contains a negative symbol - this needs to be parsed so use - `let latitude = clientPosition.longitude.toFixed(3).toString().replace("-", "negative");`

* `timestamp` - timestamp which can be generated using `Date.now();` to prevent caching

## Using Curl

Can also called using Curl.

Example request - 

```
jxs@709 ~ % curl -L 'https://cloudflare.worker.url/?negative41.217,174.833&timestamp=1718183482615'
```

Example response - 

```
{
  "weather": {
    "temperature": 8.1,
    "windSpeed": 6.1,
    "windGust": 16.4,
    "windDirection": "NNE"
  },
  "location": {
    "name": "Lower Hutt",
    "region": "",
    "country": "New Zealand",
    "latitude": -41.22,
    "longitude": 174.83
  }
}
```

## Required Environment Variables

This Cloudflare Worker reads environment variables which store configuration information. Setup these environment variables under Settings > Variables of the worker.

* apiDomain - the domain name of the Weather API. Default should be `api.weatherapi.com`

* apiToken - the API token as provided by Weather API.

* apiReferer - the referer that the API token allows. Setup within the IPinfo dashboard. Default should be `cloudflare.worker.url`