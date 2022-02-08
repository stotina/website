<template>
  <div>
    <h1 class="text-center">RPC Dashboard</h1>
    <div class="config"></div>
    <div id="actions" class="row">
      <div class="col-lg-4 col-md-12 getTx action-item"> 
        <h2>Get Tx</h2>
        <div class="action-content" >
          AAAAAAA
        </div>
        
      </div>
      <div class="col-lg-4 col-md-12 mineBlock action-item"> 
        <h2>Mine Block</h2>
        <div class="action-content" >
          AAAAAAA
        </div>
        
      </div>
      <div class="col-lg-4 col-md-12 submitTx action-item"> 
        <h2>Submit Tx</h2>
        <div class="action-content" >
          AAAAAAA
        </div>
        
      </div>
    </div>
    <div class="accordion" id="infoOptions">
      <div class="accordion-item">
        <h3 class="accordion-header" id="info_title_blockchain">
          <div class="accordion-button collapsed">
            Blockchain info
          </div>
        </h3>
        <div class="accordion-collapse collapse show">
          AAAAAAAAAA
        </div>
      </div>
      <div class="accordion-item">
        <h3 class="accordion-header" id="info_title_mempool">
          <div class="accordion-button collapsed">
            Mempool info
          </div>
        </h3>
        <div class="accordion-collapse collapse">
          AAAAAAAAAA
        </div>
      </div>
      <div class="accordion-item">
        <h3 class="accordion-header" id="info_title_rpc">
          <div class="accordion-button collapsed">
            RPC info
          </div>
        </h3>
        <div class="accordion-collapse collapse">
          AAAAAAAAAA
        </div>
      </div>
      <div class="accordion-item">
        <h3 class="accordion-header" id="info_title_mining">
          <div class="accordion-button collapsed">
            Mining info
          </div>
        </h3>
        <div class="accordion-collapse collapse">
          AAAAAAAAAA
        </div>
      </div>
      <div class="accordion-item">
        <h3 class="accordion-header" id="info_title_utxo">
          <div class="accordion-button collapsed">
            UTXO info
          </div>
        </h3>
        <div class="accordion-collapse collapse">
          AAAAAAAAAA
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import $ from "jquery";

export default {
  name: "RPC-Dashboard",
  data() {
    return {};
  },
  mounted() {
    
    $("#infoOptions .accordion-button").on("click", (ev) => {
      const target = ev.target;
      $("#infoOptions .accordion-collapse").removeClass("show");
      $(target)
        .parent()
        .parent()
        .find(".accordion-collapse")
        .addClass("show");
    });
  },
  props: {},
  components: {},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.action-item {
  padding: 1rem;
}
.action-item h2 {
  border: 2px solid black;
  border-bottom: 1px solid #000000;
  margin-bottom: 0;
}
.action-item .action-content {
  border: 2px solid black;
  border-top:none;
  margin-top: 0;
  padding: 0.4rem;
}

#infoOptions div.accordion-button {
  display: block;
  width: 100%;
  margin: auto;
  padding: 5px 20px;
  /* background-color: #525252; */
  background: linear-gradient(0deg, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0) 100%);
}

#infoOptions .accordion-header {
  margin-bottom: 0;
}

#infoOptions div.accordion-collapse {
  border: 2px solid black;
  border-top: none;
  margin-bottom: 1rem;
  padding: 1rem;
}
</style>
