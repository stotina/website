<template>
  <div class="appPage">
    <div class="phones">
      <div class="phone phone1">
        <Phone3DElement
          :frameColor="'#535353'"
          :showControls="true"
          :imagePath="this.screenshot"
          :y="-15"
          :x="10"
          :s="1.1"
        ></Phone3DElement>
      </div>
      <div class="phone phone2">
        <Phone3DElement
          :frameColor="'white'"
          :showControls="true"
          :imagePath="this.screenshot"
          :y="-15"
          :x="10"
          :s="1"
        ></Phone3DElement>
      </div>
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
import Phone3DElement from "./elements/Phone3DElement";

export default {
  name: "AppNewsPage",
  data() {
    return {
      screenshot: "/images/screenshots/idle.jpg",
    };
  },
  computed: {},
  created() {},
  methods: {},
  components: {
    Phone3DElement,
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
  width: 50%;
  min-height: max(800px, 60vw);
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
  width: 300px;
  max-width: 70%;
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
