import colors from 'vuetify/es5/util/colors'

const lightTheme = {
  primary: "#005cb9", // change header color from here || "#1e88e6", "#21c1d6", "#fc4b6c", "#563dea", "#9C27b0", "#ff9800"
  info: "#21c1d6",
  success: "#93d500",
  accent: "#fc4b6c",
  warning: "#ffb22a",
  default: "#563dea",
  background: "EEF5F9",
};
const darkTheme = {
  primary: "#005cb9", // change header color from here || "#1e88e6", "#21c1d6", "#fc4b6c", "#563dea", "#9C27b0", "#ff9800"
  info: "#21c1d6",
  success: "#93d500",
  accent: "#fc4b6c",
  warning: "#ffb22a",
  default: "#563dea",
};

export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: '%s - Group 14',
    title: 'Blockchain Seminar App',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
  ],
  // Turn Server Side Rendering OFF
  ssr: false,
  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: ['@nuxtjs/axios'],

  // To Connect the API Layer to VUE UI
  serverMiddleware: ["~/api/index.js"],

  publicRuntimeConfig: {
    // baseURL: process.env.BASE_URL || 'https://nuxtjs.org'
    nftTokenKey: process.env.NFT_API_TOKEN || ""
  },
  // Vuetify module configuration (https://go.nuxtjs.dev/config-vuetify)
  vuetify: {
    customVariables: ["~/assets/variables.scss"],
    treeShake: true,
    theme: {
      options: {
        customProperties: true,
      },
      themes: {
        dark: darkTheme,
        light: lightTheme,
      },
      dark: false, // If you want to set dark theme then dark:true else set to false
    },
    defaultAssets: {
      font: {
        family: "Roboto",
      },
    },
    rtl: false, // If you want to set rtl theme then rtl:true else set to false
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
  }
}
