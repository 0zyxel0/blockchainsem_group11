<template>
  <div>
    <nav>
      <!-- Sidebar -->
      <v-navigation-drawer
        v-model="drawer"
        clipped
        :mini-variant="miniVariant"
        floating
        app        
        id="main-sidebar"
      >
        <!-- USer Area -->
        <v-divider class="mb-4"></v-divider>
        <v-list nav>
          <div v-for="(link, i) in linksBasic" :key="i">
            <v-list-item
              v-if="!link.subLinks"
              :to="link.to"
              class="v-list-item"
              active-class="primary--text text--accent-4"
            >
              <v-list-item-icon>
                <v-icon>{{ link.icon }}</v-icon>
              </v-list-item-icon>

              <v-list-item-title v-text="link.text" />
            </v-list-item>
          </div>
        </v-list>

        <template v-slot:append>
          <v-divider></v-divider>
          <div class="pa-2">
            <p class="overline text-center">{{ versionNo }}</p>
          </div>
        </template>
      </v-navigation-drawer>

      <!-- Topbar -->
      <v-app-bar dark app flat color="primary" clipped-left>
        <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
        <v-toolbar-title class="align-center d-flex">
          <span class="title">Blockchain NFTs</span>
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn color="error" @click="logoutUser()">Logout</v-btn>
      </v-app-bar>
    </nav>

    <!-- Settings Button -->
    <v-btn
      bottom
      color="info"
      dark
      fab
      fixed
      right
      @click.stop="rightDrawer = !rightDrawer"
    >
      <v-icon>mdi-cog</v-icon>
    </v-btn>

    <!-- Right bar -->
    <v-navigation-drawer
      v-model="rightDrawer"
      :right="right"
      fixed
      temporary
      id="main-sidebar"
    >
      <v-list>
        <v-list-item>
          <v-list-item-title class="title">
            <v-icon>mdi-cog</v-icon>
            Site Settings</v-list-item-title
          >
        </v-list-item>
        <hr />
        <!-- <v-row class="mt-2">
          <v-col>
            <div class="text-center subtitle-2">LANGUAGE SELECTOR</div>
          </v-col>
        </v-row>
        <v-row>
          <v-col class="mx-6" align="center">
            <v-combobox
              v-model="select"
              :items="items"
              label="Select Language"
              prepend-icon="mdi-earth"
            >
              <template slot="item" slot-scope="data">
                {{ data.item }}
              </template>
            </v-combobox>
          </v-col>
        </v-row> -->
        <v-divider></v-divider>
        <v-row>
          <v-col>
            <div class="text-center subtitle-2">THEME MODE</div>
          </v-col>
        </v-row>
        <v-row no-gutters class="mb-5">
          <v-col cols="12" align="center">
            <v-btn @click="switchTheme">
              <v-icon v-if="this.$vuetify.theme.dark == true"
                >mdi-moon-waxing-crescent</v-icon
              >
              <v-icon v-else>mdi-white-balance-sunny</v-icon>
            </v-btn>
          </v-col>
        </v-row>
        <v-divider></v-divider>
        <v-row no-gutters>
          <v-col cols="12">
            <v-switch
              v-model="miniVariant"
              class="pl-15"
              label="Sidebar Mini"
              primary
            ></v-switch>
          </v-col>
        </v-row>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>
<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      logoutDialog: false,
      drawer: true,
      linksBasic: [
        {
          to: "/profile",
          icon: "mdi-account",
          text: "My Profile",
        },
        {
          to: "/marketplace",
          icon: "mdi-shopping",
          text: "Marketplace",
        },
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      select: ["English"],
      items: ["English", "French", "German"],
      versionNo: this.$config.APP_VERSION,
    };
  },
  computed: {
    ...mapState({
      userTheme: (state) => state.modules.profile.userTheme,
    }),
  },
  created() {
    this.$vuetify.theme.dark = this.userTheme;
  },
  methods: {
    logoutUser() {
      this.$store.dispatch("modules/profile/SIGNOUT_USER_WALLETADDRESS");
    },
    async switchTheme() {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
      this.$store.dispatch("modules/profile/UPDATE_USER_THEME", {
        themeOption: this.$vuetify.theme.dark,
      });
    },
  },
};
</script>

<style scoped lang="scss">
.v-application--is-ltr
  .v-list--dense.v-list--nav
  .v-list-group--no-action
  > .v-list-group__items
  > .v-list-item {
  padding: 0 8px;
  color: #fff;
}
.v-radio {
  color: #fff;
}
.profile-bg {
  background: url("../assets/images/user-info.jpg") no-repeat;
}
.v-avatar {
  padding: 45px 0;
}
@media (min-width: 1025px) {
  .common-left-right {
    .v-navigation-drawer {
      transform: translatex(0%) !important;
    }
  }
  .logo-width {
    min-width: 235px;
  }
}

#main-sidebar {
  box-shadow: 1px 0 20px rgba(0, 0, 0, 0.08);
  -webkit-box-shadow: 1px 0 20px rgba(0, 0, 0, 0.08);
  .v-navigation-drawer__border {
    display: none;
  }
}
</style>
