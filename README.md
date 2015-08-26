# jQuery caSocial

> This is a jQuery library generate the social icons then make a callback</a>

## Getting started

Call the dependencies `jQuery`, `Font Awesome`, `Style`, `social.js` in ```<head>```

```html
	
	<link href="//netdna.bootstrapcdn.com/font-awesome/3.2.1/css/font-awesome.css" rel="stylesheet">
	<link href="../src/style.css" rel="stylesheet">
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script>
	<script src="../src/social.js"></script>

```

Locate the buttons

```html

	<div id="ca-social"></div>

```

Let the library do the rest

```js

	//How to use
	$('#ca-social').caSocial({
		"allowYoutube":true,
		"allowEmail":true,
		"website":"YourCompany.com",
	},function(){
		$('#ca-social').show(); //The callback allow you style the buttons the way you want
	});	

```
## It will look like this

![Sample 01](samples/demo.png?raw=true "Sample 01")


