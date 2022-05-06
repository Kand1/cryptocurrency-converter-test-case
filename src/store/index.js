import Vue from 'vue';
import Vuex from 'vuex';
import currencyConverterModule from '@/store/currencyConverterModule';
import profileModule from '@/store/profileModule';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    currencyConverterModule,
    profileModule,
  },
});
