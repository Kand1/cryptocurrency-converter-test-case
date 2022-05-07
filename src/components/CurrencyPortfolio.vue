<template>
  <v-container class="appearAnimation">
    <h2>Portfolio</h2>
    <v-card>
      <v-card-title align="center">
        {{ $store.getters.getUserName }}
      </v-card-title>
      <v-card-subtitle class="mb-5">
        My portfolio in USD: {{ `${costInUSD}$` }}
      </v-card-subtitle>
      <v-card-text>
        <v-row align="center">
          <v-col md="6" cols="12">
            <v-row class="d-flex flex-row align-center justify-center"
            v-for="(currency, i) in $store.getters.getCurrencies.slice(1)"
            v-bind:key="currency"
            >
              <div class="ma-3">
                <h2>
                 My {{ currency }}:
                </h2>
              </div>
              <div class="amount ma-3">
                {{ $store.getters.getUserCurrencies &&
              $store.getters.getUserCurrencies[currency] }}
              </div>
              <div class="d-flex flex-row align-center">
                <div class="ma-3">
                  <v-text-field v-model="currenciesChangeAmount[i]" type="number"/>
                </div>
                <div class="ma-1">
                  <v-btn @click="() => changeUserCurrency('add', currency, i)" small outlined>
                    +
                  </v-btn>
                </div>
                <div class="ma-1">
                  <v-btn @click="() => changeUserCurrency('subtract', currency, i)"
                         small outlined>
                    -
                  </v-btn>
                </div>
              </div>
            </v-row>
          </v-col>
          <v-col md="6" cols="12">
            <LoaderComponent class="loader" v-if="diagramLoading"/>
            <DoughnutDiagram class="appearAnimation mb-7"
                             v-else
                             :height="300"
                             :chart-data="chartData"/>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import { mapMutations } from 'vuex';
import DoughnutDiagram from '@/components/DoughnutDiagram.vue';
import LoaderComponent from '@/components/LoaderComponent.vue';

export default {
  components: {
    DoughnutDiagram,
    LoaderComponent,
  },
  data: () => ({
    chartData: {
      labels: null,
      data: null,
    },
    diagramLoading: true,
    currenciesChangeAmount: [],
  }),
  methods: {
    ...mapMutations(['setUserCurrenciesData', 'setUserCurrencies', 'setUserName', 'setUserCurrency']),
    // изменение какой либо валюты пользователя
    changeUserCurrency(e, currency, i) {
      this.diagramLoading = true;
      if (+this.currenciesChangeAmount[i]) {
        this.setUserCurrency([e, currency, +this.currenciesChangeAmount[i]]);
        this.updateDiagram();
        setTimeout(() => {
          this.diagramLoading = false;
        }, 0);
      }
    },
    updateDiagram() {
      this.setUserCurrenciesData();
      this.chartData = {
        labels: this.$store.getters.getUserCurrenciesData.labels,
        datasets: [{
          fill: false,
          data: this.$store.getters.getUserCurrenciesData.data,
          backgroundColor: ['#DDDDDD', '#666666'],
          borderColor: 'transparent',
        }],
      };
    },
  },
  mounted() {
    this.setUserCurrencies();
    this.setUserName();
    this.updateDiagram();
    this.$store.getters.getCurrencies.slice(1).forEach((el, i) => {
      this.currenciesChangeAmount[i] = 1;
    });
    setTimeout(() => {
      this.diagramLoading = false;
    }, 0);
  },
  computed: {
    costInUSD() {
      let sum = 0;
      const currencies = this.$store.getters.getCurrencies.slice(1);
      const userCurrencies = this.$store.getters.getUserCurrencies;
      if (userCurrencies === null) {
        return 0;
      }
      const rates = this.$store.getters.getCurrenciesRates;
      // апи возращает обмен к BTC, поэтому умножаем на USD
      currencies.forEach((el) => {
        sum += userCurrencies[el] / rates[el];
      });
      return (sum * rates.USD).toFixed(2);
    },
  },
};
</script>

<style>
.appearAnimation{
  animation: 0.5s show ease;
}
.loader {
  height: 352px;
}
.amount {
  display: flex;
  justify-content: start;
  align-items: center;
  overflow-x: auto;
  overflow-y: hidden;
  width: 120px;
  color: white;
  font-size: 1.3rem;
  line-height: 1.3rem;
}
@keyframes show {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>
