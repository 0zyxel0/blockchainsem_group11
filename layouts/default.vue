<template>
  <v-app dark>
    <v-main>
      <v-container>
        <Nuxt />
      </v-container>
    </v-main>    
    <v-footer
      :absolute="!fixed"
      app
    >
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  data () {
    return {
      fixed: false,
      title: 'Blockchain Seminar : Minting NFTs'
    }
  }
}
</script>
