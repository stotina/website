
<template>
  <div>
    <div class="appListBox row">
      <div v-for="app in apps" v-bind:key="app.id" class="col-lg-4 col-md-6">
        <div
          class="appListItem"
          :style="'background-color:'+ app.background + '; color:'+ app.textColor"
        >
          <div class="appTitleArea">
            <div class="appTitleIconBox" :style="'background-color:'+ app.iconBackground">
              <img v-bind:src="app.icon" :alt="app.name" />
            </div>
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
          iconBackground: "black",
          icon: "/images/logo-news2.png",
          background: "#0080bb",
          textColor: "black",
          screenImage:
            "https://docs.microsoft.com/en-us/samples/xamarin/monodroid-samples/android50-appusagestatistics/media/2-view-weekly.png"
        },
        {
          id: 2,
          name: "Stotina News",
          iconBackground: "#b68c00",
          icon: "/images/logo-news2.png",
          background: "#cdd656",
          textColor: "black",
          screenImage:
            "https://docs.microsoft.com/en-us/samples/xamarin/monodroid-samples/android50-appusagestatistics/media/2-view-weekly.png"
        },
        {
          id: 3,
          name: "Stotina News",
          iconBackground: "black",
          icon: "/images/logo-news2.png",
          background: "#02c262",
          textColor: "black",
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
  color: #b68c00;
}
.appListItem {
  margin-top: 20px;
}

.appTitleArea {
  padding-top: 10px;
  text-align: center;
}
.appTitleIconBox {
  display: inline-block;
  width: 90px;
  height: 80px;
  border-radius: 10px;
}
.appTitleIconBox img {
  width: 90%;
  height: 90%;
  margin: 5% 5%;
}
.appTitle {
  font-size: 20px;
  font-weight: bold;
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
