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
        </v-app-bar>

        <v-main>
          <br>
          <v-card>
            <v-card-title>
              Tweet list of {{ param.name }}
              <v-spacer></v-spacer>
              <v-text-field 
                v-if="!isLoadingTweets"
                v-model="searchTweet"
                append-icon="mdi-magnify"
                label="Search"
                single-line
                hide-details
              ></v-text-field>
            </v-card-title>
            <v-data-table
              :headers="headerTable"
              :items="listOfTweets"
              :search="searchTweet"
              :loading="isLoadingTweets"
              loading-text="Loading... Please wait"
            >
              <template v-slot:item="props">
                <tr>
                  <td class='text-start'>
                    {{props.item.id_str}}
                  </td>
                  <td class='text-start'>
                    <a :href="statusLink(props.item)" target="_blank">
                      {{props.item.full_text}}
                    </a>
                  </td>
                  <td class='text-start'>
                    {{props.item.user.screen_name}}
                  </td>
                  <td class='text-start'>
                    {{ showDate(props.item.created_at) }}
                  </td>
                  <td class='text-start' :class="{'error': props.item.category == 'Negative', 'success': props.item.category == 'Positive', 'warning': props.item.category == 'Neutral'}">
                    <p class="mb-0 text-white">
                      {{ props.item.category || ''}}
                    </p>
                  </td>
                </tr>
              </template>

            </v-data-table>
          </v-card>
          <v-btn
            depressed
            :disabled="isGenerate"
            color="primary"
            class="mt-5"
            @click="generate()"
            v-if="valueResult == ''"
          >
            <p v-if="!isGenerate" class="mb-0">Generate</p>
            <v-progress-circular
              :size="25"
              color="primary"
              v-else
              indeterminate
            ></v-progress-circular>
            
          </v-btn>

          <div class="mx-5 mt-5 d-flex" v-else>
            <v-progress-linear
              v-model="valueResult.val"
              disabled
              color="blue-grey"
              height="25"
              class="f-2"
            >
              <template v-slot:default="{ value }">
                <strong>{{ value }}</strong>
              </template>
            </v-progress-linear>

            <div class="f-1 ml-2" :class="{'error': valueResult.cat == 'Negative', 'success': valueResult.cat == 'Positive', 'warning': valueResult.cat == 'Neutral'}">
              <p class="mb-0 white--text ">{{ valueResult.cat }}</p>  
            </div>
            
          </div>
        </v-main>
    </v-app>
</template>

<script>
import moment from 'moment'
// const fs = require("fs");

export default {
    name: 'Tweets',
    async created(){
      const {data: {statuses}} = await this.$http.get('http://127.0.0.1:3000/tweets?q='+this.param.query)
      this.listOfTweets = statuses
      this.isLoadingTweets = !this.isLoadingTweets
    },
    data(){
      return {
        listOfTweets: [],
        param: this.$route.params,
        searchTweet: '',
        isLoadingTweets:true,
        isGenerate: false,
        valueResult:'',
        result: '',
        headerTable: [
          {
            text: 'Tweets ID'
          },
          {
            text: 'Tweets',
            align: 'start',
            value: 'full_text',
          },
          // { text: 'id', value: 'id'},
          { text: 'User', value: 'user.name'},
          { text: 'Created at', value: 'created_at', sortable: false },
          { text: 'Category', value: 'category', sortable:false}
        ],
      }
    },
    methods: {
      statusLink(param){
        return `https://twitter.com/${param.user.screen_name}/status/${param.id_str}`
      },
      showDate(value){
        return moment(value).format("MMM Do YY")
      },
      calculateResult(arr){
        var res = [ 
          {cat : 'Negative', val: 0},
          {cat : 'Positive', val: 0},
          {cat : 'Neutral', val: 0}
        ]
        arr.forEach(obj => {
          if(obj.category == 'Negative') res[0].val += 1
          else if(obj.category == 'Positive') res[1].val += 1
          else res[2].val += 1
        });
        
        res.sort((a, b) => (a.val < b.val) ? 1 : -1)
        console.log(res)
        return res[0]
      },
      async generate(){
        this.isGenerate = !this.isGenerate
        const resp = await this.$http.post('http://127.0.0.1:3000/generate',
        {
          param: this.param
        })
        const {result_data} = resp.data
        this.valueResult = this.calculateResult(result_data)
        this.listOfTweets = result_data
        this.isGenerate = !this.isGenerate
      }
    }
}
</script>

<style>

.home-text{
  color: white !important;
  text-decoration: none;
}

.f-1{
  flex:1
}

.f-2{
  flex: 2;
}
</style>