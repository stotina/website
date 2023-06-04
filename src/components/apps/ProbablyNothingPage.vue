<template>
  <div>
    <div class="probablyNothingContainer">
      <h3>Probably Nothing</h3>
      <br />
      <p v-for="description in descriptionLines" :key="description">
        {{ description }}
      </p>

      <div class="input-group">
        <label
          class="input-group-text bg-secondary"
          for="probablyNothingImageInput"
        >
          Select Image File:
        </label>
        <input
          type="file"
          class="form-control"
          name="probablyNothingImageInput"
          id="probablyNothingImageInput"
          accept="image/png, image/jpeg"
          @change="onBackgroundInputChange"
        />
      </div>
      <br />
    </div>
    <div>
      <div id="canvasContainer">
        <canvas id="mainCanvas"></canvas>
        <canvas id="canvasForRotations"></canvas>

        <img
          :src="animatedImage"
          v-if="animatedImage && animatedImage.length"
        />

        <!-- <div v-for="(canvas, index) in frames" :key="index">
          <img :src="canvas.toDataURL()" />
        </div> -->
      </div>
    </div>
    <br />
  </div>
</template>

<script>
// downloaded from https://github.com/eugeneware/gifencoder
import GIFEncoder from "../../assets/js/gif/GIFEncoder";

export default {
  name: "ProbablyNothingPage",
  data() {
    return {
      frames: [],
      animatedImage: "",
      probablyNothingImage: "",
      descriptionLines: [
        "Yeah... this button over here... it's probably nothing.",
        "Don't worry about it!",
      ],
      foo: ["bar", "baz"],
    };
  },
  props: {},
  components: {},
  mounted: async function mounted() {
    // ready
  },
  methods: {
    async onBackgroundInputChange(fileInputEvent) {
      const img = await this.readImageFile(fileInputEvent.target.files[0]);

      const frameData = [
        { addProbablyNothing: false, x: 0, y: 0, degr: 0, scale: 1 },
        { addProbablyNothing: true, x: 0, y: -0.3, degr: 180, scale: 1 },
        { addProbablyNothing: true, x: 0.6, y: 0.5, degr: 0, scale: 0.6 },
        { addProbablyNothing: true, x: 0.3, y: 0.3, degr: -45, scale: 1.2 },
        { addProbablyNothing: true, x: 0, y: 0.6, degr: 45, scale: 0.6 },
        { addProbablyNothing: true, x: -0.2, y: -0.2, degr: 120, scale: 1 },
      ];

      const promises = frameData.map(async (frame) => {
        // const canvas = document.querySelector("#mainCanvas");
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        this.addImage(canvas, img, 0, 0);
        if (frame.addProbablyNothing) {
          await this.addProbablyNothingImage(
            canvas,
            frame.x,
            frame.y,
            frame.degr,
            frame.scale
          );
        }
        console.log("created frame : ", frame);
        return canvas;
      });

      this.frames = await Promise.all(promises);

      await this.constructGif();
    },

    async constructGif() {
      const encoder = new GIFEncoder();
      encoder.setRepeat(0); // 0 = loop forever
      encoder.setDelay(500); // go to next frame every n milliseconds
      encoder.start();
      for (const canvas of this.frames) {
        encoder.addFrame(canvas.getContext("2d"));
      }
      encoder.finish();
      const binary_gif = encoder.stream().getData(); //notice this is different from the as3gif package!
      // eslint-disable-next-line no-undef
      this.animatedImage = "data:image/gif;base64," + btoa(binary_gif);

      console.log("DONE!");
    },

    addImage(canvas, imageToAdd, x, y, rotationDegrees = undefined, scale = 1) {
      const ctx = canvas.getContext("2d");
      ctx.width = canvas.width;
      ctx.height = canvas.height;

      if (rotationDegrees) {
        imageToAdd = this.getRotatedImage(imageToAdd, rotationDegrees);
      }

      ctx.drawImage(
        imageToAdd,
        x,
        y,
        scale * imageToAdd.width,
        scale * imageToAdd.height
      );
    },
    async addProbablyNothingImage(canvas, xPercent, yPercent, deg, scale = 1) {
      const imageToAdd = await this.getProbablyNothingImage();
      await this.addImage(
        canvas,
        imageToAdd,
        canvas.width * xPercent,
        canvas.height * yPercent,
        deg,
        scale
      );
    },
    async getProbablyNothingImage() {
      if (!this.probablyNothingImage) {
        const url = "/images/jokes/probably-nothing-image.png";
        this.probablyNothingImage = await this.getBase64FromImageUrl(url);
      }
      const img = await this.parseBase64ImageUrl(this.probablyNothingImage);
      return img;
    },
    async parseBase64ImageUrl(dataUrl) {
      return new Promise(function(resolve, reject) {
        if (dataUrl == null) return reject();
        const image = new Image();
        image.addEventListener("load", () => resolve(image), false);
        image.src = dataUrl;
      });
    },
    async readImageFile(fileObject) {
      return await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = function(event) {
          const img = new Image();
          img.onload = function() {
            resolve(img);
          };
          img.src = event.target.result;
        };
        reader.readAsDataURL(fileObject);
      });
    },
    getRotatedImage(img, degrees) {
      const canvas = document.querySelector("#canvasForRotations");
      const ctx = canvas.getContext("2d");
      const size = Math.max(img.width, img.height);
      canvas.width = size;
      canvas.height = size;
      ctx.width = size;
      ctx.height = size;
      ctx.clearRect(0, 0, size, size);
      ctx.save();

      ctx.translate(size / 2, size / 2);
      ctx.rotate((degrees * Math.PI) / 180);
      ctx.drawImage(img, -size / 2, -size / 2);

      ctx.restore();

      return canvas;
    },
    async getBase64FromImageUrl(url) {
      return await new Promise((resolve) => {
        var img = new Image();
        img.setAttribute("crossOrigin", "anonymous");
        img.onload = function() {
          var canvas = document.createElement("canvas");
          canvas.width = this.width;
          canvas.height = this.height;
          var ctx = canvas.getContext("2d");
          ctx.drawImage(this, 0, 0);
          var dataURL = canvas.toDataURL("image/png");
          resolve(dataURL);
        };
        img.src = url;
      });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.probablyNothingContainer {
  margin: auto;
  text-align: center;
  width: 90%;
  max-width: 600px;
}
#canvasContainer {
  margin: auto;
  text-align: center;
}
#mainCanvas {
  display: none;
}
#canvasForRotations {
  display: none;
}
</style>
