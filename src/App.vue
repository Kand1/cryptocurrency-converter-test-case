<template>
  <v-app>
    <v-container fluid>
      <v-app-bar
        color="secondary"
      >
        <div class="spacer">
          <v-btn to = '/' color="white" outlined  class="ml-3">
            Converter
          </v-btn>
          <v-btn to = '/portfolio' color="white"  outlined  class="ml-3">
            Portfolio
          </v-btn>
        </div>
      </v-app-bar>
    </v-container>
    <v-main>
      <div class="loader" v-if="loadingCurrenciesRates">
        <v-row class="mt-3" align="center">
          <v-col align="center">
            <h3>Wait Please</h3>
          </v-col>
        </v-row>
        <v-row  align="center">
          <v-col align="center">
            <div class="lds-dual-ring"></div>
          </v-col>
        </v-row>
      </div>
      <router-view v-else/>
    </v-main>
  </v-app>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'App',
  data: () => ({
    loadingCurrenciesRates: true,
  }),
  methods: {
    ...mapActions(['fetchCurrenciesRates']),
  },
  mounted() {
    // загрузка данных о курсах обмена
    this.fetchCurrenciesRates().then(() => {
      this.loadingCurrenciesRates = false;
    });
  },
};
</script>

<style lang="scss">
.spacer {
  display: flex;
  justify-content: flex-end;
  margin-right: 5%;
}
</style>
