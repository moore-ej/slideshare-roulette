var apiKey = "I8hah3BH";
var secret = "KuOacjnO";

var go;

$( document ).ready(function() {
	var gridster = $(".dashboard ul").gridster({
		widget_margins: [10, 10],
		widget_base_dimensions: [200, 250],
		max_cols: 4
		
	}).data('gridster');

	for (var idx=0; idx<16; idx++) {
		fetch(gridster);
	}	
});

function fetch(gridster) {
	$.ajax({
		url: '/slideshare', // name of file you want to parse
		dataType: 'xml', // type of file you are trying to read
		method: 'POST',
		success: function(document) {
		  $(document).find("Slideshow").first().each(function(){
			 var title = $(this).find("Title").text();
			 var url = $(this).find("URL").text();
			 var thumbnail = $(this).find("ThumbnailURL").text();
			 var desc = $(this).find("Description").text();
			 
			 gridster.add_widget(
				"<li>" + 
				"<a href=\"" + url + "\">" +
				"<h1>" + title + "</h1>" +
				"<br />" + 				
				"<img src=\"" + thumbnail + "\" alt=\"" + desc + "\" />" +
				"</a>" +
				"</li>");
		  });
			
		},
		error: function(){
			console.log("Bad mojo");
		}
  });	
}