
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
		httpRequest.open('GET', 'https://api.crossref.org/works?query=' + info.selectionText, true);
		httpRequest.send();
		httpRequest.onreadystatechange = function () {
		if (httpRequest.readyState == 4 && httpRequest.status == 200) {
			var text = httpRequest.responseText;
			var json = JSON.parse(text);
			browser.tabs.create({
				url: 'http://sci-hub.tw/' + json.message.items[0].DOI,
    		});
		}
	};
});