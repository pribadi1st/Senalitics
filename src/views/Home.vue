<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <div class="d-flex align-center">
        <a href="/" class="home-text">
          Senalitics
        </a>
      </div>

      <v-spacer></v-spacer>
    </v-app-bar>

    <v-main>
      <v-autocomplete
          rounded
          solo
          class="mt-3"
          :items="woeid"
          item-value="woeid"
          item-text="name"
          v-model="selectedCity"
          label="Search city"
        ></v-autocomplete>
      <template v-if="totalTrends > 0">
        <v-card>
          <v-card-title>
            Current Trends {{ locationName }}
            <v-spacer></v-spacer>
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Search"
              single-line
              hide-details
            ></v-text-field>
          </v-card-title>
          <v-data-table
            :headers="headerTable"
            :items="listOfTrends"
            :search="search"
            :loading="isLoadingTrend"
            loading-text="Loading... Please wait"
          >
            <template #item.name="props" >
              <p @click="changePage(props)">{{props.value}}</p>
            </template>
            <template #item.url="{ value }">
                <a :href="value" target="_blank">
                  {{ value }}
                </a>
            </template>
          </v-data-table>
        </v-card>
        
      </template >
      <template v-else>
        <application-info/>
      </template>
    </v-main>
  </v-app>
</template>

<script>
import ApplicationInfo from '../components/HomepageInfo';
import woeid from '../assets/js/codebeautify.json'

export default {
  name: 'App',

  components: {
    ApplicationInfo
  },

  data: () => ({
    woeid,
    selectedCity: '',
    listOfTrends: [],
    locationName: '',
    search: '',
    headerTable: [
      {
        text: 'Trending Name',
        align: 'start',
        value: 'name',
      },
      { text: 'Tweets Volume', value: 'tweet_volume'},
      { text: 'Twitter Url', value: 'url', sortable: false },
    ],
    isLoadingTrend: false
  }),
  computed: {
    totalTrends() {
      return this.listOfTrends.length
    }
  },
  methods:{
    changePage(params){
      this.$router.push({
          name: 'Tweet', 
          params: {
              name: params.item.name, 
              query: params.item.query
          }
      });
    }
  },
  watch: {
    async selectedCity(n){
      this.isLoadingTrend = !this.isLoadingTrend
      const resp = await this.$http.get('http://127.0.0.1:3000/trends?id='+n)
      this.locationName = resp.data[0].locations[0].name
      this.listOfTrends = resp.data[0].trends
      this.isLoadingTrend = !this.isLoadingTrend
    }
  }
};
</script>

<style>
.home-text{
  color: white !important;
  text-decoration: none;
}
</style>