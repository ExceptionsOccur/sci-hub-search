

var search_list = new Array('DOI', 'Title','Author');

function createMenuItem() {
	for (var i = 0; i < search_list.length; i++) {
		browser.menus.create({
	      id: 'by ' + search_list[i],
	      title: 'by ' + search_list[i],
	      contexts: ["selection"]
    	});
	}
}

createMenuItem();


browser.menus.onClicked.addListener((info, tab) => {
		var selected = text_proc(info.selectionText);
		myStorage = localStorage;
		localStorage.setItem('name', selected);
		var test = localStorage.getItem('name');
		switch(info.menuItemId){
			case "by DOI" :
			{
				browser.tabs.create({
					url: 'http://sci-hub.tw/' + selected,
				});
			}break;

			case "by Title" :
			{
				browser.notifications.create({
					"type": "basic",
					"title": "serching",
					"message": "正在搜索中，请稍候"
				});
				var httpRequest = new XMLHttpRequest();
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
			}break;

			case "by Author" :
			{
				
				// browser.runtime.sendMessage({
				// 	"name": selected
				// });
				browser.tabs.create({url: '/author.html'}).then(() => {
					// browser.tabs.insertCSS(
					// 	{file: '/author.css'}
					// );
					browser.tabs.executeScript({
						file: '/content-script.js'
					});
					browser.notifications.create({
						"type": "basic",
						"title": "notification",
						"message": "正在搜索中....请稍候\n注意不要切换页面，以免搜索失败"
					});
				});
			}break;
			default : 
			{
				browser.notifications.create({
						"type": "basic",
						"title": "notification",
						"message": "操作失败，请重试"
					});
			}
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