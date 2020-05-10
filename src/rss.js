const fs = require('fs');
const RSS = require('rss');
const feedDefinitions = require('./assets/feedDefinitions.json');

function initFeed(feedDefinition) {
    var mainUrl = "https://stotina.com";

    var feed = new RSS({
        title: feedDefinition.title,
        feed_url: mainUrl + feedDefinition.path,
        site_url: mainUrl,
        image_url: "https://stotina.com/images/logo-small.png",
        managingEditor: "Aleksandar Dinkov",
        webMaster: "Aleksandar Dinkov",
    });

    feedDefinition.items.forEach(item => {
        feed.item({
            title: item.title,
            description: item.description,
            url: mainUrl + `/#/blog?${feedDefinition.feedName}--${item.id}`,
            categories: item.categories,
            author: item.author,
            date: item.date,
        });
    });

    var fileName = "./public" + feedDefinition.path;
    var fileDir = fileName.substring(0, fileName.lastIndexOf("/") + 1);

    console.log("Generating " + fileName);

    if (!fs.existsSync(fileDir))
        fs.mkdirSync(fileDir);

    var xml = feed.xml();
    fs.writeFileSync(fileName, xml);
}

function initAll() {
    feedDefinitions.forEach(initFeed);
}

initAll();

module.exports = { initAll }