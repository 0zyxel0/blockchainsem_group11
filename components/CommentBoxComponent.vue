<template>
  <div id="comment-box">
    <v-card> 
     <v-card-title>{{comment}}</v-card-title>
     <v-card-text>
       <v-row>
         <v-col>User: {{username}}</v-col>
         <v-col align="right">{{formatDate(timestamp)}}</v-col>
       </v-row>
     </v-card-text>
    </v-card>
  </div>
</template>
<script>
import moment from "moment";
export default {
  props: {
    username: { type: String },
    comment: { type: String },
    timestamp: { type: String}
  },
  methods:{
    formatDate(payload){
      return moment(String(payload)).format("YYYY-MM-DD hh:mm:ss");
    }
  }
};
</script>
