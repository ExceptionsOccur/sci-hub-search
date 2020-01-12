

function createMenuItem(engines) {
    browser.menus.create({
      id: 'search',
      title: 'search by sci-hub',
      contexts: ["selection"]
    });
}

browser.search.get().then(createMenuItem);


browser.menus.onClicked.addListener((info, tab) => {
  browser.tabs.create({
            url: 'http://sci-hub.tw/' + info.selectionText,
          });
});