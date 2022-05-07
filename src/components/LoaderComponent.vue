<template>
  <v-row  align="center">
    <v-col align="center">
      <h3 class="mt-10">Wait Please</h3>
      <div class="lds-dual-ring"></div>
    </v-col>
  </v-row>
</template>

<script>
export default {

};
</script>

<style scoped>
.lds-dual-ring {
  display: inline-block;
  width: 80px;
  height: 80px;
}
.lds-dual-ring:after {
  content: " ";
  display: block;
  width: 64px;
  height: 64px;
  margin: 8px;
  border-radius: 50%;
  border: 6px solid #fff;
  border-color: #fff transparent #fff transparent;
  animation: lds-dual-ring 1.2s linear infinite;
}
</style>
