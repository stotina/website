<template>
  <div>
    <div class="home">
      <div class="row">
        <div class="col-lg-5">
          <IntroTextElement></IntroTextElement>
          <InteractiveLogo
            style="max-width:200px; margin:auto; padding:1rem;"
          ></InteractiveLogo>
        </div>
        <div class="col-lg-7 descriptionArea">
          <div>
            <h3>PRACTICAL BITCOIN CONSULTING</h3>
            <div>
              Curious if Bitcoin can help your business? <br />
              Want to accept bitcoin payments, or use the blockchain? <br />
              That is why I am here.
            </div>
          </div>
          <br />
          <div class="row">
            <div class="col-sm-12 col-lg-6 col-xl-4">
              <h4>Bitcoin as Money</h4>
              <div>Here are some areas where I could be of use to you.</div>
              <br />
              <ul>
                <li>Managing Bitcoin Payments</li>
                <li>Converting Bitcoin to FIAT</li>
                <li>Storing Bitcoin Securely</li>
                <li>Monitoring the Blockchain</li>
                <li>Making Automated Bitcoin Payments</li>
                <li>Integratihg with an Exchange</li>
                <li>Bitcoin Micropayments</li>
                <li>Bitcoin Remittance</li>
                <li>Bitcoin Wallet Security</li>
                <li>Managing Many Payments at the same time</li>
                <li>Creating Non-Standard Payments</li>
                <li>Bitcoin focused Projects</li>
              </ul>
            </div>
            <div class="col-sm-12 col-lg-6 col-xl-4">
              <h4>Bitcoin as Data Ledger</h4>
              <div>
                Bitcoin is much more than money. It is the first ever truly
                immutable data ledger. Depending on what your business does, the
                Data Ledger might help you for:
              </div>
              <br />
              <ul>
                <li>Proving the Authenticity of Documents and Events</li>
                <li>Tightening the Security of your Systems</li>
                <li>Sharing Documents with Users or Businesses</li>
                <li>Keeping a Backup of Critical Data</li>
                <li>Designing Protocols for OnChain Communication</li>
              </ul>
            </div>
          </div>
          <div class="col-sm-12 col-md-11 col-lg-10">
            <h4>The Trap of Trends</h4>
            <div>
              Bitcoin is already more than a decade old, yet few people actually
              understand what it is, and how it works. Even within the
              communities dedicated to Bitcoin, people still disagree on what
              Bitcoin actually is. When this confusion is combined with the
              euphoria birthed from sudden increases of cryptocurrency prices,
              some truly absurd ideas get see the light of day.
              <br />
              As a consultant, my task is not only to guide you to the good ways
              to use Bitcoin but also to help you stay clear of the bad ones.
              <br />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import IntroTextElement from "./elements/IntroTextElement";
import InteractiveLogo from "./elements/InteractiveLogo";
export default {
  name: "HomePage",
  data() {
    return {};
  },
  props: {},
  components: { IntroTextElement, InteractiveLogo },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.descriptionArea {
  padding: 1em 2em;
}
</style>
