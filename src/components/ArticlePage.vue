<template>
  <div>
    <div class="blog">
      <div v-if="!article" class="not-found">Article not found.</div>
      <div v-else class="center">
        <div class="title">{{ article.title }}</div>
        <div class="article-date">{{ article.date }}</div>
        <div class="article-author">{{ article.author }}</div>
        <div class="article theme-br-blog">
          <div class="article-description" v-html="article.content"></div>
        </div>
      </div>
    </div>
    <br />
  </div>
</template>

<script>
const h = window.location.hash;
const i = h.indexOf("?");
const q = h.substr(i < 0 ? h.length : i + 1).split("--");
const feedName = q[0] || "main-feed";
const articleId = q.length > 1 ? q[1] : "";

const feedDefinitions = require("../assets/feedDefinitions.json");
const feedNames = feedDefinitions.map((i) => i.feedName);
const feed = feedDefinitions[feedNames.indexOf(feedName)];
let article = undefined;
try {
  article = require(`../assets/raw-blog/${feed.blogDir}/${articleId}.json`);
} catch (err) {
  //
}

export default {
  name: "ArticlePage",
  data() {
    return {
      articleId: articleId,
      feedName: feedName,
      article: article,
      feed: feed,
    };
  },
  props: {},
  components: {},
  methods: {},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.not-found {
  text-align: center;
  opacity: 0.7;
}
.title {
  display: block;
  margin: auto;
  text-align: center;
  font-size: 3rem;
  width: 90%;
  max-width: 700px;
}
.center {
  display: block;
  margin: auto;
  text-align: center;
}
.article {
  border-width: 1px;
  border-style: solid;
  width: 90%;
  max-width: 700px;
  margin: auto;
  margin-top: 2rem;
}
.article-title {
  text-align: center;
  font-size: 1.5rem;
  margin: 0.5rem;
}
.article-date,
.article-author {
  opacity: 0.6;
  display: inline-block;
  margin: 0 2rem;
}
.article-description {
  margin: 1rem 2rem;
}
</style>
