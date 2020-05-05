
<template>
  <div>
    <div class="appListBox row">
      <div v-for="app in apps" v-bind:key="app.id" class="col-lg-4 col-md-6">
        <div class="appListItem">
          <div class="appTitleArea">
            <img v-bind:src="app.icon" :alt="app.name" />
            <div class="appTitle">{{app.name}}</div>
          </div>
          <div class="appPhoneBox">
            <div class="appPhoneFrame" :style="`background-image:url('${app.screenImage}')`"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AppListElement",
  data() {
    return {
      apps: [
        {
          id: 1,
          name: "Stotina News",
          icon: "/images/logo-news2.png",
          screenImage:
            "https://docs.microsoft.com/en-us/samples/xamarin/monodroid-samples/android50-appusagestatistics/media/2-view-weekly.png"
        },
        {
          id: 2,
          name: "Stotina News",
          icon: "/images/logo-news2.png",
          screenImage:
            "https://docs.microsoft.com/en-us/samples/xamarin/monodroid-samples/android50-appusagestatistics/media/2-view-weekly.png"
        },
        {
          id: 3,
          name: "Stotina News",
          icon: "/images/logo-news2.png",
          screenImage:
            "https://docs.microsoft.com/en-us/samples/xamarin/monodroid-samples/android50-appusagestatistics/media/2-view-weekly.png"
        }
      ]
    };
  },
  props: {},
  computed: {},
  methods: {}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.appListBox {
  width: 80%;
  margin: auto;
}
.appListItem {
  background: #00aeff42;
  margin-top: 20px;
}

.appTitleArea {
  padding-top: 10px;
  text-align: center;
}
.appTitleArea img {
  display: inline-block;
  width: 90px;
  height: 80px;
  border: 1px solid black;
}
.appTitle {
  font-size: 20px;
}

.appPhoneBox {
  margin-top: 10px;
  height: 270px;
  overflow: hidden;
}

.appPhoneBox .appPhoneFrame {
  width: 200px;
  height: 400px;
  background-size: 100% 100%;
  border: 10px solid black;
  border-top: 30px solid black;
  border-radius: 1em;
  margin: auto;
  margin-top: 20px;
  position: relative;
  transition: transform 0.3s ease-in-out;
}
.appListItem:hover .appPhoneFrame {
  transform: rotate(5deg);
  transition: transform 0.3s ease-in-out;
}
</style>
