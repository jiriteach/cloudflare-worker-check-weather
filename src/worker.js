addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request));
})

async function handleRequest(request) {

    console.log("Debug - Referer - " + request.headers.get('referer'));

	// if (request.headers.get('referer') != "https://" + apiReferer) {
	// 	return new Response("Error 500 - Invalid Access!", {
	// 		status: 500,
	// 		});
	// }

    let headers = new Headers({
		'Access-Control-Allow-Origin': 'https://' + apiReferer,
		'Access-Control-Allow-Methods': 'GET, HEAD, POST, OPTIONS',
		'Access-Control-Allow-Headers': '*'
	});

	const url = request.url.split('/');
    console.log("Debug - url = " + request.url);

    urlSegment = url[url.length-1].replace("?", "");
    console.log("Debug - urlSegment = " + urlSegment);

	if (urlSegment === "") {
		return new Response("Worker Error 500 - Invalid URL Structure!", {
			status: 500,
			});
	}	

	const urlArray = urlSegment.replace("negative", "-").split(',');

	const latitude = urlArray[urlArray.length-2];
	console.log("Debug - latitude =" + latitude);

	const longitude = urlArray[urlArray.length-1]
	console.log("Debug - longitude =" + longitude);

	const weatherUrl = "https://" + apiDomain + "/v1/current.json?key=" + apiToken + "&q=" + latitude + "," + longitude + "&aqi=no";

	const providerResponse = await fetch(weatherUrl);
	const processedResults = await processResponse(providerResponse);

	return new Response(processedResults, {
		status: 200,
		headers: headers
	});
}

async function processResponse(providerResponse) {

    const { headers } = providerResponse;
    const contentType = headers.get("content-type") || "";

    if (contentType.includes("application/json")) {

      const jsonResponse = await providerResponse.json();
      const jsonStructure = {
        weather: {
            temperature: jsonResponse.current.temp_c,
            windSpeed: jsonResponse.current.wind_kph,
			windGust: jsonResponse.current.gust_kph,
			windDirection: jsonResponse.current.wind_dir
        },
        location: {
			name: jsonResponse.location.name,
			region: jsonResponse.location.region,
			country: jsonResponse.location.country,
			latitude: jsonResponse.location.lat, 
			longitude: jsonResponse.location.lon
		}
      };

      const valuesToReturn = JSON.stringify(jsonStructure, null, 2)
      console.log("Debug - valuesToReturn = " + valuesToReturn);

      return valuesToReturn
      
    }

    return providerResponse.text();
}