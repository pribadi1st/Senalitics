<template>
    <v-alert
      text
      color="info"
    >
      <h3 class="text-h5">
        Notification
      </h3>
      <div>
          This application is a master thesis program of IU Student written by Pribadi Ridwan Mulyono
      </div>

      <v-divider
        class="my-4 info"
        style="opacity: 0.22"
      ></v-divider>

      <v-row
        align="center"
        no-gutters
      >
        <v-col class="grow">
          To continue please choose the desired location first
        </v-col>
        <v-spacer></v-spacer>
        <!-- <v-col class="shrink">
          <v-btn
            color="info"
            outlined
          >
            Okay
          </v-btn>
        </v-col> -->
      </v-row>
    </v-alert>
</template>

<script>
export default {
    name: 'ApplicationInfo'
}
</script>