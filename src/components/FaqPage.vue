<template>
  <div>
    <div class="faq">
      <h3>FAQ</h3>

      <br />
      <FaqItem v-for="q in faqData" :key="q" :question="q.q" :answer="q.a">
      </FaqItem>
      <br />
    </div>
  </div>
</template>

<script>
import FaqItem from "./elements/FaqItem";

export default {
  name: "FaqPage",
  data() {
    return {
      faqData: [
        {
          q: "Question 1",
          a: "Answer 1",
        },
        {
          q: "Question 2",
          a: "Answer 2",
        },
        {
          q: "Question 3",
          a: "Answer 3",
        },
      ],
    };
  },
  props: {},
  components: { FaqItem },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.faq {
  margin: auto;
  text-align: center;
  width: 90%;
  max-width: 600px;
}
</style>
