

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
			document.getElementsByClassName('index')[0].getAttributeNode("style").value="display:";
			document.getElementsByClassName('top_author')[0].innerHTML = nnnname;
			updata_by_data(json);
		}
	}
	localStorage.clear();					
}
}




// input author
function authors_proc(author) {
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

// function ISSN_proc(ISSN) {
// 	var issn = ISSN[0];
// 	if(ISSN.length > 1){
// 		for (var i = 1; i < ISSN.length; i++) {
// 			issn = issn.concat('/' + ISSN[i]);
// 		}
// 	}
// 	return issn;
// }


function add_node_by_data(data) {
	var title = data.title[0];
	var author = authors_proc(data.author);
	var doi = data.DOI;
	var references_count = data["reference-count"];
	var journal = data["container-title"][0];
	var year = data.created["date-parts"][0][0];
	var doc_url = SCI_HUB + doi;
	// var issue = data.issue;
	// var volume = data.Volume;
	// var issn = ISSN_proc(data.ISSN);
	// var page = data.page;
	href_attr = document.getElementsByClassName('title')[0];
	href_attr.getAttributeNode("href").value=doc_url;
	var li = document.getElementsByClassName('result_list')[0].cloneNode(true);
	li.getElementsByClassName('title')[0].innerHTML = title;
	li.getElementsByClassName('author')[0].innerHTML = author;
	li.getElementsByClassName('doi')[0].innerHTML = doi;
	li.getElementsByClassName('reference_count').innerHTML = references_count;
	li.getElementsByClassName('journal')[0].innerHTML = journal;
	li.getElementsByClassName("year")[0].innerHTML = year;
	// li.getElementsByClassName('issue')[0].innerHTML = issue;
	// li.getElementsByClassName('volume')[0].innerHTML = volume;
	// 	li.getElementsByClassName('issn')[0].innerHTML = issn;
	// li.getElementsByClassName('page')[0].innerHTML = page;
	li.getAttributeNode("style").value="display:";
	document.getElementsByClassName('cap')[0].appendChild(li);
}


function updata_by_data(data) {
	var items_list = data.message.items;
	for (var i = 0; i < items_list.length; i++) {
		add_node_by_data(items_list[i]);
	}
}

