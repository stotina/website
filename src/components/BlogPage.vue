<template>
  <div>
    <div class="blog">
      <div class="title">{{ feed.title }}</div>

      <div>
        <div
          class="article theme-br-blog pointer"
          v-on:click="openArticle(i.id)"
          v-for="i in articles || []"
          :key="i.id"
        >
          <div class="article-title">{{ i.title }}</div>
          <div class="article-date">{{ i.date }}</div>
          <div class="article-author">{{ i.author }}</div>
          <div class="article-description" v-html="i.description"></div>
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

const feedDefinitions = require("../assets/feedDefinitions.json");
const feedNames = feedDefinitions.map((i) => i.feedName);

const feed = feedDefinitions[feedNames.indexOf(feedName)];
console.log(feed);
const articles = feed.items.map((id) => {
  const loadedData = require(`../assets/raw-blog/${feed.blogDir}/${id}.json`);
  return { ...loadedData, id };
});

export default {
  name: "BlogPage",
  data() {
    return {
      feedName: feedName,
      feed,
      articles,
    };
  },
  props: {},
  components: {},
  methods: {
    openArticle(id) {
      var url = `/article?${feedName}--${id}`;
      console.log(url);
      this.$router.push(url);
      window.location.reload();
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.title {
  text-align: center;
  font-size: 3rem;
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
