import axios from 'axios';
import moment from 'moment';

const USD = 'USD';
const period = 10;
const mapCurrency = {
  BTC: 'bitcoin',
  ETH: 'ethereum',
};

export default {
  state: {
    currencies: ['USD', 'BTC', 'ETH'],
    currenciesRates: {},
    exchangeRatesData: {
      labels: null,
      data: null,
    },
  },
  getters: {
    getCurrencies(state) {
      return state.currencies;
    },
    getCurrenciesRates(state) {
      return state.currenciesRates;
    },
    getExchangeRatesData(state) {
      return state.exchangeRatesData;
    },
  },
  mutations: {
    setCurrenciesRates(state, payLoad) {
      state.currenciesRates = {
        BTC: 1,
        USD: payLoad.usd.value,
        ETH: payLoad.eth.value,
      };
    },
    setExchangeRatesData(state, [dates, res, currencyId, isUSD]) {
      state.exchangeRatesData.labels = dates;
      state.exchangeRatesData.data = res.map((el) => {
        if (isUSD) {
          return 1 / el.data.market_data.current_price[currencyId];
        }
        return el.data.market_data.current_price[currencyId];
      });
    },
  },
  actions: {
    fetchCurrenciesRates(context) {
      return axios.get('https://api.coingecko.com/api/v3/exchange_rates').then((res) => {
        context.commit('setCurrenciesRates', res.data.rates);
      });
    },
    fetchExchangeRatesData(context, [firstCurrency, secondCurrency]) {
      const dates = [];
      const promises = [];
      let currencyName = null;
      let currencyId = null;
      let isUSD = false;

      for (let i = 0; i < period; i += 1) {
        const [month, day, year] = moment().subtract(i + 1, 'days').format('L').split('/');
        dates.push(`${day}-${month}-${year}`);
      }
      dates.reverse();

      if (firstCurrency === USD) {
        currencyId = USD.toLowerCase();
        isUSD = true;
        currencyName = mapCurrency[secondCurrency];
      } else {
        currencyName = mapCurrency[firstCurrency];
        currencyId = secondCurrency.toLowerCase();
      }

      for (let i = 0; i < period; i += 1) {
        promises
          .push(axios
            .get(`https://api.coingecko.com/api/v3/coins/${currencyName}/history?date=${dates[i]}`));
      }

      return Promise.all(promises).then((res) => {
        context.commit('setExchangeRatesData', [dates, res, currencyId, isUSD]);
      });
    },
  },
  modules: {
  },
};
