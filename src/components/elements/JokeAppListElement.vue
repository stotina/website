<template>
  <div>
    <div class="jokeAppListBox row">
      <div v-for="jokeApp in jokeApps" v-bind:key="jokeApp.id" class="col-lg-4 col-md-6">
        <a
          class="jokeAppListItem theme-br-mainFont"
          :class="jokeApp.path ? 'pointer animate' : 'empty'"
          v-on:click="$router.push(jokeApp.path)"
          v-bind:href="'/#' + jokeApp.path"
        >
          <div class="jokeAppTitleArea">
            <div class="jokeAppTitleIconBox">
              <img v-if="jokeApp.icon" v-bind:src="jokeApp.icon" :alt="jokeApp.name" />
            </div>
            <div class="jokeAppTitle">{{ jokeApp.name }}</div>
          </div>
          <div class="jokeAppPhoneBox">
            <div
              class="jokeAppPhoneFrame theme-br-mainFont"
              :style="`background-image:url('${jokeApp.screenImage}')`"
            ></div>
          </div>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import jokeApps from "../../assets/jokeApps.json";

export default {
  name: "JokeAppListElement",
  data() {
    return {
      jokeApps: jokeApps.map((el, id)=>({...el, id})),
    };
  },
  props: {},
  computed: {},
  methods: {
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.jokeAppListBox {
  width: 80%;
  margin: auto;
}
.jokeAppListItem {
  display: block;
  color: inherit;
  text-decoration: inherit;

  margin-top: 20px;
  margin-bottom: 20px;
  border-width: 4px;
  border-style: solid;
  border-radius: 1rem;
}

.jokeAppTitleArea {
  padding-top: 20px;
  text-align: center;
}
.jokeAppTitleIconBox {
  display: inline-block;
  width: 90px;
  height: 80px;
  border-radius: 10px;
  background-color: var(--bg-color-mainFont) !important;
}
.jokeAppTitleIconBox img {
  width: 90%;
  height: 90%;
  margin: 5% 5%;
}
.jokeAppTitle {
  font-size: 1.7em;
  font-weight: bold;
}

.jokeAppPhoneBox {
  margin-top: 10px;
  height: 270px;
  overflow: hidden;
}

.jokeAppPhoneBox .jokeAppPhoneFrame {
  width: 200px;
  height: 400px;
  background-size: 100% auto;
  background-repeat: no-repeat;
  border-width: 10px;
  border-top-width: 30px;
  border-style: solid;
  border-radius: 1em;
  margin: auto;
  margin-top: 20px;
  position: relative;
  transition: transform 0.3s ease-in-out;
}

.jokeAppListItem.animate:hover .jokeAppPhoneFrame {
  transform: rotate(5deg);
  transition: transform 0.3s ease-in-out;
}
.jokeAppListItem.empty:hover .jokeAppPhoneFrame {
  border: 10px solid #ffffff44 !important;
  border-top: 30px solid #ffffff44 !important;
  transition: 0.5s ease-in-out;
}

.jokeAppListItem:hover .jokeAppTitleArea {
  transition: color 0.5s;
  color: var(--font-footerLinks) !important;
  transform: scale(1.05);
}

.jokeAppListItem:hover .jokeAppTitleArea .jokeAppTitleIconBox {
  transition: background-color 0.5s;
  background-color: var(--font-footerLinks) !important;
}
</style>
