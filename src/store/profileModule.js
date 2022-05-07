export default {
  state: {
    userName: null,
    // объект со значениями валют пользователя
    userCurrencies: null,
    // данные для диаграммы
    userCurrenciesData: {
      labels: null,
      data: null,
    },
  },
  getters: {
    getUserCurrenciesData(state) {
      return state.userCurrenciesData;
    },
    getUserCurrencies(state) {
      return state.userCurrencies;
    },
    getUserName(state) {
      return state.userName;
    },
  },
  mutations: {
    setUserCurrenciesData(state) {
      const newLabels = [];
      const newData = [];
      Object.entries(state.userCurrencies).forEach(([labelEl, dataEl]) => {
        newLabels.push(labelEl);
        newData.push(dataEl);
      });
      state.userCurrenciesData.labels = newLabels;
      state.userCurrenciesData.data = newData;
    },
    setUserCurrencies(state) {
      if (!localStorage.userCurrencies) {
        const newUsersCurrencies = {};
        this.getters.getCurrencies.slice(1).forEach((el) => {
          newUsersCurrencies[el] = 0;
        });
        state.userCurrencies = newUsersCurrencies;
        localStorage.userCurrencies = JSON.stringify(state.userCurrencies);
      } else {
        state.userCurrencies = JSON.parse(localStorage.userCurrencies);
      }
    },
    setUserCurrency(state, [e, currency, amount]) {
      switch (e) {
        case 'add': {
          state.userCurrencies[currency] += amount;
          break;
        }
        case 'subtract': {
          state.userCurrencies[currency] -= amount;
          break;
        }
        default: {
          console.log('Unknown event');
        }
      }
      if (state.userCurrencies[currency] < 0) {
        state.userCurrencies[currency] = 0;
      }
      localStorage.userCurrencies = JSON.stringify(state.userCurrencies);
    },
    setUserName(state) {
      if (!localStorage.userName) {
        state.userName = `User${String(+(new Date())).substr(3, 7)}`;
        localStorage.userName = state.userName;
      } else {
        state.userName = localStorage.userName;
      }
    },
  },
  actions: {

  },

};
