<template>
  <div>
    <div class="toolListBox row">
      <div v-for="tool in tools" v-bind:key="tool.id" class="col-lg-3 col-md-4">
        <a
          class="toolListItem theme-br-mainFont"
          :class="tool.unfinished ? 'unfinished' : 'finished'"
          v-on:click="$router.push(tool.path)"
          v-bind:href="'/#' + tool.path"
        >
          <div
            class="toolTitleArea"
            v-bind:title="tool.unfinished ? 'Unfinished Tool' : tool.name"
          >
            <div class="toolTitleIconBox theme-bg-mainFont">
              <img v-if="tool.icon" v-bind:src="tool.icon" :alt="tool.name" />
            </div>
            <div class="toolTitle">{{ tool.name }}</div>
          </div>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import tools from "../../assets/tools.json";

export default {
  name: "ToolListElement",
  data() {
    return {
      tools: tools.map((el, id) => ({ ...el, id })),
    };
  },
  props: {},
  computed: {},
  methods: {},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.toolListBox {
  width: 80%;
  margin: auto;
}
.toolListItem {
  display: block;
  color: inherit;
  text-decoration: inherit;

  margin: 25px 0;
  border-width: 4px;
  border-style: solid;
  border-radius: 1rem;
}
.toolTitleArea {
  padding-top: 20px;
  padding-bottom: 10px;
  text-align: center;
}
.toolTitleIconBox {
  display: inline-block;
  width: 60px;
  height: 60px;
  border-radius: 10px;
}
.toolTitleIconBox img {
  width: 90%;
  height: 90%;
  margin: 5% 5%;
}
.toolTitle {
  font-size: 1.2em;
  font-weight: bold;
}

.toolListItem.finished:hover .toolTitleArea {
  transition: color 0.5s;
  color: var(--font-footerLinks) !important;
  transform: scale(1.05);
}

.toolListItem.finished:hover .toolTitleArea .toolTitleIconBox {
  transition: background-color 0.5s, transform 0.3s ease-in-out;
  background-color: var(--font-footerLinks) !important;
  transform: rotate(5deg);
}

.toolListItem.unfinished:hover {
  transition: opacity 0.5s;
  opacity: 30%;
}
</style>
