

// browser.runtime.onMessage.addListener(handleMessage);

show_page();

const SCI_HUB = "http://sci-hub.tw/";

function show_page() {
	var nnnname = localStorage.getItem('name');
	var httpRequest = new XMLHttpRequest();
	httpRequest.open('GET', 'https://api.crossref.org/works?query.author='+ nnnname + '&rows=50', true);
	httpRequest.send();
	httpRequest.onreadystatechange = function () {
		if (httpRequest.readyState == 4 && httpRequest.status == 200) {
			var text = httpRequest.responseText;
			var json = JSON.parse(text);
			if(json.message.items.length == 0){
				document.getElementsByClassName('index')[0].getAttributeNode("style").value="display:";
				document.getElementsByClassName('top_author')[0].innerHTML = nnnname + " any journals were found";
			}
			else{
				updata_by_data(json);
				document.getElementsByClassName('index')[0].getAttributeNode("style").value="display:";
				document.getElementsByClassName('top_author')[0].innerHTML = nnnname;
				document.getElementsByClassName('foot')[0].getAttributeNode("style").value="display:";
			}
		}
		localStorage.clear();					
	}
}




// input author
function authors_proc(author) {
	if(author[0]["given"] != null){
		var all_author = author[0].given + ' ' + author[0].family;
		var temp = "";
		if (author.length > 1) {
			for (var i = 1; i < author.length; i++) {
				if (i == 3) {
					all_author = all_author.concat(' et al.');
					return all_author;
				}
				else{
					temp = ', ' + author[i].given + ' ' + author[i].family;
					all_author = all_author.concat(temp);
				}
			}
		}
		return all_author;
	}
	else{
		var all_author = author[0].family;
		var temp = "";
		if (author.length > 1) {
			for (var i = 1; i < author.length; i++) {
				if (i == 3) {
					all_author = all_author.concat(' et al.');
					return all_author;
				}
				else{
					temp = ', ' + ' ' + author[i].family;
					all_author = all_author.concat(temp);
				}
			}
		}
		return all_author;
	}
}


function add_node_by_data(data) {
	var title = "";
	var author = authors_proc(data.author);
	var doi = data.DOI;
	var link = "";
	var journals = "";
	var year = data.created["date-parts"][0][0];
	var doc_url = SCI_HUB + doi;
	if(data.link == null){
		link = data.URL;
	}
	else{
		link = data.link[0].URL;
	}
	if(data["container-title"] == null){
		journals = data.publisher;
	}
	else{
		journals = data["container-title"][0];
	}
	if(data.title == null){
		title = "null";
	}else{
		title = data.title[0];
	}
	href_attr = document.getElementsByClassName('title')[0];
	href_attr.getAttributeNode("href").value = doc_url;
	link_attr = document.getElementsByClassName('link')[0];
	link_attr.getAttributeNode("href").value = link;
	var li = document.getElementsByClassName('result_list')[0].cloneNode(true);
	li.getElementsByClassName('title')[0].innerHTML = title;
	li.getElementsByClassName('author')[0].innerHTML = author;
	li.getElementsByClassName('doi')[0].innerHTML = doi;
	li.getElementsByClassName('journals')[0].innerHTML = journals;
	li.getElementsByClassName("year")[0].innerHTML = year;
	li.getAttributeNode("style").value="display:";
	document.getElementsByClassName('cap')[0].appendChild(li);
}


function updata_by_data(data) {
	var items_list = data.message.items;
	for (var i = 0; i < items_list.length; i++) {
		add_node_by_data(items_list[i]);
	}
}

