
var doi = '';
function createMenuItem() {
    browser.menus.create({
      id: 'search',
      title: 'search by sci-hub',
      contexts: ["selection"]
    });
}

browser.search.get().then(createMenuItem);


browser.menus.onClicked.addListener((info, tab) => {
		var httpRequest = new XMLHttpRequest();
		var selected = text_proc(info.selectionText);
		if(selected[0] == '1'){
			browser.tabs.create({
				url: 'http://sci-hub.tw/' + selected,
			});
		}
		else{
			httpRequest.open('GET', 'https://api.crossref.org/works?query.bibliographic=' + selected, true);
			httpRequest.send();
			httpRequest.onreadystatechange = function () {
				if (httpRequest.readyState == 4 && httpRequest.status == 200) {
					var text = httpRequest.responseText;
					var json = JSON.parse(text);
					if(json.message.items.length == 0 || selected != json.message.items[0].title[0]){
						browser.notifications.create({
    						"type": "basic",
    						"title": "search by sci-hub",
    						"message": selected + '\n' + "its DOI is not found"
    					});
					}
					else
						browser.tabs.create({
							url: 'http://sci-hub.tw/' + json.message.items[0].DOI,
			    		});
				}
			};
		}
});



function text_proc(text) {
	if(text[0] == ' '){
		text = text.substr(1,text.length);
	}
	if(text[text.length - 1] == ' '){
		text = text.substr(0,text.length - 1);
	}
	return text.replace(/\s+/g,' ');
}