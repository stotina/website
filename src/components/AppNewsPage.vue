<template>
  <div>
    <div class="phones">
      <div class="phones3d">
        <div class="phones3d-1">
          <Phone3DElement
            :frameColor="'#535353'"
            :showControls="false"
            :positionRight="true"
            :positionSide="150"
            :positionTop="80"
            :imagePath="this.screenshot"
            :y="-15 + this.x * 30"
            :x="10"
            :s="1.1"
          ></Phone3DElement>
        </div>
        <div class="phones3d-2">
          <Phone3DElement
            :frameColor="'white'"
            :showControls="false"
            :positionRight="true"
            :positionSide="300"
            :positionTop="120"
            :imagePath="this.screenshot"
            :y="-15 + this.x * 30"
            :x="10"
            :s="1"
          ></Phone3DElement>
        </div>
      </div>
      <div class="phones2d">
        <PhoneElement
          id="phoneFrame2d"
          :width="'300px'"
          :borderColor="'gray'"
          :imagePath="this.screenshot"
        ></PhoneElement>
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
import PhoneElement from "./elements/PhoneElement";

export default {
  name: "AppNewsPage",
  data() {
    return {
      x: 0.5,
      w: document.body.clientWidth,
      screenshot: "/images/screenshots/idle.jpg",
    };
  },
  computed: {},
  created() {
    document.addEventListener("mousemove", this.onMouseUpdate, false);
  },
  methods: {
    onMouseUpdate(e) {
      this.w = document.body.clientWidth;
      this.x = e.pageX / this.w;
    },
  },
  components: {
    Phone3DElement,
    PhoneElement,
  },
  props: {},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.phones2d {
  position: absolute;
  top: 6vw;
  right: 8vw;
  transform: rotate(5deg);
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

@media only screen and (max-width: 1300px) {
  .phones3d {
    display: none;
  }
}
@media only screen and (min-width: 1300px) {
  .phones2d {
    display: none;
  }
}
@media only screen and (max-width: 850px) {
  .phones3d {
    display: none;
  }
  .phones2d {
    display: block;
    position: initial;
    padding: 50px calc(50% - 150px);
  }
  .content {
    width: 100%;
    padding-top: 0;
  }
}
</style>
