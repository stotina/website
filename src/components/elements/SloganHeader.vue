<template>
  <div>
    <div
      id="appsPageHeader"
      :title="this.backgroundAttribution"
      :style="this.backgroundStyle"
    >
      <div
        id="appsPageHeaderContent"
        class="theme-bg-nav"
        :style="this.contentStyle"
      >
        <div class="title titleFont">{{ this.title }}</div>
        <p class="slogan">{{ this.description }}</p>
      </div>
      <PhoneElement
        :style="phone1Style"
        id="appsPageHeaderPhone"
        :imagePath="'/images/screenshots/news-light_2.jpg'"
        :width="'15rem'"
      ></PhoneElement>
      <PhoneElement
        :style="phone2Style"
        id="appsPageHeaderPhone2"
        :imagePath="'/images/screenshots/news-dark_2.jpg'"
        :width="'18rem'"
      ></PhoneElement>
    </div>
  </div>
</template>

<script>
import PhoneElement from "./PhoneElement";

export default {
  name: "SloganHeader",
  data() {
    return {};
  },
  props: {
    title: {
      type: String,
      default: "STOTINA",
    },
    description: {
      type: String,
      default: "Make the amazing simple.",
    },
    contentLeft: { type: Boolean, default: true },
    phone1Rotate: { type: Number, default: 40 },
    phone1PositionLeftPercent: { type: Number, default: 65 },
    phone1PositionTopPercent: { type: Number, default: 5 },
    phone2Rotate: { type: Number, default: 50 },
    phone2PositionLeftPercent: { type: Number, default: 75 },
    phone2PositionTopPercent: { type: Number, default: 5 },

    backgroundLeft: { type: Boolean, default: true },
    background: {
      type: String,
      default: "/images/john-adams-1xIN4FMR78A-unsplash.jpg",
    },
    backgroundAttribution: {
      type: String,
      default: "Photo by John Adams on Unsplash",
    },
    backgroundWidth: {
      type: String,
      default: "160%",
    },
  },
  components: {
    PhoneElement,
  },
  computed: {
    backgroundStyle() {
      return [
        `background-image:url('${this.background}')`,
        `background-size: ${this.backgroundWidth} 100%`,
        `background-position: top ${this.backgroundLeft ? "left" : "right"}`,
      ].join(";");
    },
    phone1Style() {
      return (
        [
          `transform: rotate(${this.phone1Rotate}deg)`,
          `position: absolute`,
          `left: ${this.phone1PositionLeftPercent}%`,
          `top: ${this.phone1PositionTopPercent}%`,
        ].join("; ") + ";"
      );
    },
    phone2Style() {
      return (
        [
          `transform: rotate(${this.phone2Rotate}deg)`,
          `position: absolute`,
          `left: ${this.phone2PositionLeftPercent}%`,
          `top: ${this.phone2PositionTopPercent}%`,
        ].join("; ") + ";"
      );
    },
    contentStyle() {
      return (
        "position: relative; top: 10%;" +
        (this.contentLeft ? "left: 5%" : "left: 65%")
      );
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#appsPageHeader {
  height: 500px;
  max-height: 70vw;
  overflow: hidden;
  transition: 1s ease;
}

#appsPageHeaderContent {
  display: inline-block;
  max-width: calc(100vw - 100px);
  z-index: 2;
  padding: 40px 25px;
  border-radius: 50px;
  font-weight: bold;
}

#appsPageHeaderContent .title {
  font-weight: bold;
  font-size: 2.4rem;
}
#appsPageHeaderContent .slogan {
  font-weight: bold;
  font-size: 1.2rem;
}

#appsPageHeaderPhone {
  transition: 1s ease-in-out;
  z-index: 1;
}
#appsPageHeaderPhone2 {
  transition: 1s ease-in-out;
  z-index: 1;
}
@media only screen and (max-width: 700px) {
  #appsPageHeaderPhone,
  #appsPageHeaderPhone2 {
    display: none;
  }
}
</style>
