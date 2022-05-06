<template>
  <v-container>
    <div class="content">
      <h2>Cryptocurrency converter</h2>
      <v-card class="mt-3">
        <v-card-text>
          <v-row align="center" justify="center">
            <v-col md="3" cols="6">
              <v-text-field v-model="firstCurrencyAmount"
                            type="number"
                            @input="() => onInput(0)"
              />
            </v-col>
            <v-col md="2" cols="6" align="center">
              <v-select v-model="firstCurrency"
                        :items="$store.getters.getCurrencies"
                        @change="selectChanged"
              />
            </v-col>
            <v-col md="2" cols="12" align="center">
              <v-btn outlined @click="exchangeButtonClicked"
              >
                ⇌
              </v-btn>
            </v-col>
            <v-col md="3" cols="6">
              <v-text-field v-model="secondCurrencyAmount"
                            type="number"
                            @input="() => onInput(1)"
              />
            </v-col>
            <v-col md="2" cols="6" align="center">
              <v-select v-model="secondCurrency"
                        :items="$store.getters.getCurrencies"
                        @change="selectChanged"
              />
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
      <h2 class="mt-3">Exhange rate for 14 days</h2>
      <div class="loader" v-if="graphicLoading">
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
      <v-card class="graphic mt-3" v-else>
        <v-card-text>
          <v-row align="center">
            <v-col align="center">
              <LineGraphic :chart-data="chartData"/>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </div>
  </v-container>
</template>

<script>
import { mapActions } from 'vuex';
import LineGraphic from '@/components/LineGraphic.vue';

export default {
  components: {
    LineGraphic,
  },
  data: () => ({
    shouldUpdate: true,
    graphicLoading: true,
    firstCurrency: 'BTC',
    secondCurrency: 'USD',
    firstCurrencyAmount: 0,
    secondCurrencyAmount: 0,
    chartData: { },
  }),
  mounted() {
    this.firstCurrencyAmount = 1;
    this.secondCurrencyAmount = this.$store.getters.getCurrenciesRates.USD;
    this.updateOnCurrenciesChange();
  },
  methods: {
    ...mapActions(['fetchCurrenciesRates', 'fetchExchangeRatesData']),
    // функция для вызова при изменении конвертируемых валют
    updateOnCurrenciesChange() {
      if (this.shouldUpdate) {
        this.shouldUpdate = false;
        this.graphicLoading = true;
        // обновление значения правого поля
        const rates = this.$store.getters.getCurrenciesRates;
        this.secondCurrencyAmount = (this.firstCurrencyAmount * rates[this.secondCurrency])
          / rates[this.firstCurrency];
        // обновление данных для графика
        this.fetchExchangeRatesData([this.firstCurrency, this.secondCurrency]).then(() => {
          this.graphicLoading = false;
          this.chartData = {
            labels: this.$store.getters.getExchangeRatesData.labels,
            datasets: [{
              label: `${this.firstCurrency} to ${this.secondCurrency}`,
              fill: false,
              data: this.$store.getters.getExchangeRatesData.data,
              backgroundColor: '#DDDDDD',
              borderColor: '#DDDDDD',
            }],
          };
        });
      }
    },
    selectChanged() {
      this.shouldUpdate = true;
    },
    exchangeButtonClicked() {
      const temp = this.firstCurrency;
      this.firstCurrency = this.secondCurrency;
      this.secondCurrency = temp;
      this.shouldUpdate = true;
    },
    // изменение значений полей при вводе
    onInput(currencyId) {
      const rates = this.$store.getters.getCurrenciesRates;
      if (currencyId) {
        this.firstCurrencyAmount = (this.secondCurrencyAmount * rates[this.firstCurrency])
          / rates[this.secondCurrency];
      } else {
        this.secondCurrencyAmount = (this.firstCurrencyAmount * rates[this.secondCurrency])
          / rates[this.firstCurrency];
      }
    },
  },
  watch: {
    // обработка ситуации выбора одинаковой валюты в 2х полях
    // и вызов функции для обновления графика
    firstCurrency(newCurrency, oldCurrency) {
      if (newCurrency === this.secondCurrency) {
        this.secondCurrency = oldCurrency;
      }
      this.updateOnCurrenciesChange();
    },
    secondCurrency(newCurrency, oldCurrency) {
      if (newCurrency === this.firstCurrency) {
        this.firstCurrency = oldCurrency;
      }
      this.updateOnCurrenciesChange();
    },
  },
};
</script>

<style>
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
@keyframes lds-dual-ring {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
.content, .graphic {
  animation: 0.5s show ease;
}
@keyframes show {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>
