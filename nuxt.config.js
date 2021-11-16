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
  modules: ['@nuxtjs/axios', '@nuxtjs/axios',

    ["vue-toastification/nuxt", {
      timeout: 1500,
      draggable: false
    }]
  ],

  // To Connect the API Layer to the Frontend
  serverMiddleware: ["~/api/index.js"],

  publicRuntimeConfig: {
    axios: {
      baseURL: process.env.APIBASE_URL || "http://localhost:8899",
    },
    APP_VERSION: process.env.APP_VERSION || "no version",
    NTF_IPFS_TOKEN: process.env.NTF_IPFS_TOKEN || "",
    NFT_MINTING_CONTRACT: process.env.NFT_MINTING_CONTRACT || "",
    NFT_AUCTION_CONTRACT: process.env.NFT_AUCTION_CONTRACT || "",
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
  },

  // Toast Config

  toast: {
    position: 'top-right',
    register: [ // Register custom toasts
      {
        name: 'my-error',
        message: 'Oops...Something went wrong',
        options: {
          type: 'error'
        }
      }
    ]
  }
}
