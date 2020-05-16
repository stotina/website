<template>
  <div class="appPage">
    <div class="phones">
      <DoublePhone3DElement
        class="phonesElement"
        :showControls="false"
        :imagePath="this.screenshot"
        :width="'300px'"
        :distanceBetweenPhones="150 - 300 * this.x + 'px'"
        :y1="-30 + 60 * this.x"
        :x1="20"
        :s1="1.1"
        :frameColor1="'#535353'"
        :y2="-30 + 60 * this.x"
        :x2="20"
        :s2="0.95"
        :frameColor2="'#cccccc'"
      ></DoublePhone3DElement>
      <input type="range" name="x" v-model="x" min="0" max="1" step="0.001" />
    </div>

    <div class="content">
      <div class="contentTitle titleFont">
        Stotina
        <span class="theme-c-important titleFont">News</span>
      </div>
      <p>
        The Stotina News app will generate a newsfeed by gathering data from
        leading news agencies and providers. It displays recent local and
        international headlines on many topics that help users see exactly
        what's happening around you.
        <br /><br />
        The sources and polling time can be configured to fit your needs.
        <br /><br />
        Stotina News can notify you of important news as soon as information is
        available, or in bulk after a period of time.
      </p>

      <img src="/appData/news/logo-news2.png" alt="News App Logo" />
    </div>
  </div>
</template>

<script>
import DoublePhone3DElement from "./elements/DoublePhone3DElement";

export default {
  name: "AppNewsPage",
  data() {
    return {
      x: 0.1,
      screenshot: "/images/screenshots/idle.jpg",
    };
  },
  computed: {},
  created() {},
  methods: {},
  components: {
    DoublePhone3DElement,
  },
  props: {},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.appPage {
  display: flex;
  flex-direction: row-reverse;
}
.appPage > * {
  border: 2px solid pink;
  width: 49vw;
  display: block;
  margin: auto;
}

.content {
  padding-bottom: 120px;
  padding: 5rem;
  font-size: 1.1rem;
}
.contentTitle {
  font-size: 3rem;
  text-align: center;
  margin: 3rem 0;
}

.content img {
  display: block;
  margin: auto;
  width: 250px;
  max-width: 70%;
}

.phones {
  padding: 5em 0;
  min-height: 800px;
}
.phones > * {
  display: block;
  width: 300px;
  margin: auto;
}
.phonesElement {
  min-height: 700px;
}

@media only screen and (max-width: 700px) {
  .appPage {
    display: block;
  }
  .appPage > * {
    width: 99vw;
  }
}
</style>
