<template>
  <div class="appPage">
    <div class="phones">
      <DoublePhone3DElement
        class="phonesElement"
        v-bind:style="
          `width: ${this.phoneWidth}px; height: ${this.phoneWidth * 2 + 50}px;`
        "
        :showControls="this.showControls"
        :imagePath="this.screenshot"
        :width="this.phoneWidth + 'px'"
        :distanceBetweenPhones="(150 - 300 * this.x).toFixed(1) + 'px'"
        :y1="-10 + 20 * this.x"
        :x1="20"
        :s1="0.9 - 0.1 * this.x"
        :frameColor1="'#444444'"
        :y2="-10 + 20 * this.x"
        :x2="20"
        :s2="0.8 + 0.1 * this.x"
        :frameColor2="'#aaaaaa'"
      ></DoublePhone3DElement>
      <div v-bind:style="`width: ${this.phoneWidth}px`">
        <input type="range" name="x" v-model="x" min="0" max="1" step="0.001" />
        <!-- <div>
          <label for="showControlsId">
            <input type="checkbox" v-model="showControls" id="showControlsId" />
            - show controls (debug)
          </label>
        </div> -->
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

      <div class="centerText">
        <a href="/appData/news/privacy.html" target="_blank">Privacy Policy</a>
      </div>
      <div class="centerText">
        <a href="/appData/news/terms.html" target="_blank"
          >Terms and Conditions</a
        >
      </div>
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
      w: document.body.clientWidth,
      showControls: false,
      screenshot: "/images/screenshots/news-dark-animated.gif",
    };
  },
  computed: {
    phoneWidth() {
      return this.w > 700 ? 400 : 200;
    },
    phonesStyle() {
      return `padding: ${this.phoneWidth / 10}px 0;`;
    },
  },
  created() {
    document.addEventListener("mousemove", this.onMouseUpdate, false);
    setInterval(this.updateWidth, 300);
  },
  methods: {
    updateWidth() {
      this.w = document.body.clientWidth;
    },
    onMouseUpdate(e) {
      this.x = e.pageX / this.w;
    },
  },
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
.centerText {
  text-align: center;
}

.content img {
  display: block;
  margin: auto;
  width: 250px;
  max-width: 70%;
}

.phones > * {
  display: block;
  max-width: 90%;
  margin: auto;
  text-align: center;
}

@media only screen and (max-width: 700px) {
  .appPage {
    display: block;
  }
  .appPage > * {
    width: 100%;
  }
  .content {
    padding: 2rem;
  }
}
</style>
