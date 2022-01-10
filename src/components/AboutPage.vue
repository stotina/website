<template>
  <div>
    <div class="about">
      <div class="row">
        <div class="col-lg-6" style="padding:0 2rem;">
          <InteractiveLogo
            style="max-width:200px; margin:auto; padding:1rem;"
          ></InteractiveLogo>

          <div class="text-center">
            <h5>About Stotina:</h5>
            <div>
              Stotina is a Software Consultancy & Development company based in
              Bulgaria.
            </div>
          </div>
          <br />
        </div>
        <div class="col-lg-6 border theme-br-blog">
          <br />
          <h5>Contact Information:</h5>
          <br />
          <ul class="list-group list-group-flush">
            <li class="list-group-item">
              <i class="fas fa-user-circle"></i> :
              <span>Aleksandar Dinkov</span>
            </li>
            <li class="list-group-item">
              <i class="fas fa-envelope-open-text"></i> :
              <a href="mailto:aleks@stotina.com">aleks@stotina.com</a>
            </li>
            <li class="list-group-item">
              <i class="fas fa-phone"></i> :
              <span>+359883332088</span>
            </li>
            <li class="list-group-item">
              <i class="fab fa-google-play"></i> :
              <span>Not yet...</span>
            </li>
            <li class="list-group-item">
              <i class="fab fa-twitter"></i> :
              <a href="https://twitter.com/BitcoinSofia">@BitcoinSofia</a>
            </li>
          </ul>
          <br />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import InteractiveLogo from "./elements/InteractiveLogo";

export default {
  name: "AboutPage",
  data() {
    return {};
  },
  props: {},
  components: { InteractiveLogo },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.about {
  padding: 3rem;
}
</style>
