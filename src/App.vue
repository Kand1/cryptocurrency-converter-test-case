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
      <v-container v-if="apiLimit">
        <v-card align="center" class="pa-8">
          Api that i use has a limit of 50 requests per minute, and the request for 2 weeks history
          requires 14 api requests. So wait a bit please and then refresh the page :)
          <LoaderComponent/>
        </v-card>
      </v-container>
      <div v-else>
        <LoaderComponent v-if="loadingCurrenciesRates"/>
        <router-view v-else/>
      </div>
    </v-main>
  </v-app>
</template>

<script>
import { mapActions } from 'vuex';
import LoaderComponent from '@/components/LoaderComponent.vue';

export default {
  name: 'App',
  components: { LoaderComponent },
  data: () => ({
    loadingCurrenciesRates: true,
    apiLimit: false,
  }),
  methods: {
    ...mapActions(['fetchCurrenciesRates']),
  },
  mounted() {
    // загрузка данных о курсах обмена
    this.fetchCurrenciesRates().then(() => {
      this.loadingCurrenciesRates = false;
    }).catch(() => {
      this.apiLimit = true;
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
