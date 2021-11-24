<template>
  <v-row class="fill-height">
    <v-col>
      <v-sheet height="64">
        <v-toolbar flat>
          <v-btn outlined class="mr-4" color="grey darken-2" @click="setToday">
            Today
          </v-btn>
          <v-btn fab text small color="grey darken-2" @click="prev">
            <v-icon small> mdi-chevron-left </v-icon>
          </v-btn>
          <v-btn fab text small color="grey darken-2" @click="next">
            <v-icon small> mdi-chevron-right </v-icon>
          </v-btn>
          <v-toolbar-title v-if="$refs.calendar">
            {{ $refs.calendar.title }}
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-menu bottom right>
            <template v-slot:activator="{ on, attrs }">
              <v-btn outlined color="grey darken-2" v-bind="attrs" v-on="on">
                <span>{{ typeToLabel[type] }}</span>
                <v-icon right> mdi-menu-down </v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item @click="type = 'day'">
                <v-list-item-title>Day</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = 'week'">
                <v-list-item-title>Week</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = 'month'">
                <v-list-item-title>Month</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = '4day'">
                <v-list-item-title>4 days</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-toolbar>
      </v-sheet>
      <v-sheet height="600">
        <v-calendar
          ref="calendar"
          v-model="focus"
          color="primary"
          :events="events"
          :event-color="getEventColor"
          :type="type"
          @click:event="showEvent"
          @click:more="viewDay"
          @click:date="viewDay"
          @change="updateRange"
        ></v-calendar>
        <v-menu
          v-model="selectedOpen"
          :close-on-content-click="false"
          :activator="selectedElement"
          offset-x
        >
          <validation-observer ref="observer" v-slot="{ invalid }">
            <form @submit.prevent="submit">
              <v-card color="grey lighten-4" max-width="300px" flat>
                <v-toolbar :color="selectedEvent.color" dark>
                  <v-title> Create Event </v-title>
                  <!-- <v-btn icon>
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-toolbar-title v-html="selectedEvent.name"></v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn icon>
                <v-icon>mdi-heart</v-icon>
              </v-btn>
              <v-btn icon>
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn> -->
                </v-toolbar>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="6" md="6">
                      <validation-provider
                        v-slot="{ errors }"
                        name="tanggal"
                        rules="required"
                      >
                        <v-text-field
                          label="tanggal*"
                          v-model="tanggal"
                          :error-messages="errors"
                          required
                        ></v-text-field>
                      </validation-provider>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                      <validation-provider
                        v-slot="{ errors }"
                        name="title"
                        rules="required"
                      >
                        <v-text-field
                          rows="1"
                          no-resize
                          label="title*"
                          v-model="title"
                          :error-messages="errors"
                          required
                        ></v-text-field>
                      </validation-provider>
                    </v-col>
                    <v-col cols="12">
                      <validation-provider
                        v-slot="{ errors }"
                        name="description"
                        rules="required"
                      >
                        <v-text-field
                          rows="1"
                          no-resize
                          label="description*"
                          v-model="description"
                          :error-messages="errors"
                          required
                        ></v-text-field>
                      </validation-provider>
                    </v-col>
                    <v-col cols="12">
                      <validation-provider
                        v-slot="{ errors }"
                        name="gambar"
                        rules="required"
                      >
                        <v-text-field
                          rows="1"
                          no-resize
                          label="gambar*"
                          v-model="gambar"
                          :error-messages="errors"
                          required
                        ></v-text-field>
                      </validation-provider>
                    </v-col>
                    <v-col cols="12">
                      <validation-provider
                        v-slot="{ errors }"
                        name="video"
                        rules="required"
                      >
                        <v-text-field
                          rows="1"
                          no-resize
                          label="video*"
                          v-model="video"
                          :error-messages="errors"
                          required
                        ></v-text-field>
                      </validation-provider>
                    </v-col>
                  </v-row>

                  <v-card-actions>
                    <v-btn text color="secondary" @click="selectedOpen = false">
                      Cancel
                    </v-btn>
                    <v-btn
                      color="blue darken-1"
                      text
                      type="submit"
                      :disabled="invalid"
                    >
                      Save
                    </v-btn>
                  </v-card-actions>
                </v-container>

                <!-- <v-card-text>
              <span v-html="selectedEvent.details"></span>
            </v-card-text>
            <v-card-actions>
              <v-btn
                text
                color="secondary"
                @click="selectedOpen = false"
              >
                Cancel
              </v-btn>
            </v-card-actions> -->
              </v-card>
            </form>
          </validation-observer>
        </v-menu>
      </v-sheet>
    </v-col>
  </v-row>
</template>

<script>
import { required, regex } from "vee-validate/dist/rules";
import {
  extend,
  ValidationObserver,
  ValidationProvider,
  setInteractionMode,
} from "vee-validate";
import axios from "axios";
setInteractionMode("eager");

// extend('digits', {
//   ...digits,
//   message: '{_field_} needs to be {length} digits. ({_value_})',
// })

extend("required", {
  ...required,
  message: "{_field_} can not be empty",
});

// extend('max', {
//   ...max,
//   message: '{_field_} may not be greater than {length} characters',
// })

extend("regex", {
  ...regex,
  message: "{_field_} {_value_} does not match {regex}",
});

// extend('email', {
//   ...email,
//   message: 'Email must be valid',
// })

export default {
  components: {
    ValidationProvider,
    ValidationObserver,
  },
  data: () => ({
    focus: "",
    type: "month",
    typeToLabel: {
      month: "Month",
      week: "Week",
      day: "Day",
      "4day": "4 Days",
    },
    selectedEvent: {},
    selectedElement: null,
    selectedOpen: false,
    events: [],
    colors: [
      "blue",
      "indigo",
      "deep-purple",
      "cyan",
      "green",
      "orange",
      "grey darken-1",
    ],
    names: [
      "Meeting",
      "Holiday",
      "PTO",
      "Travel",
      "Event",
      "Birthday",
      "Conference",
      "Party",
    ],
    kegiatan: [],
  }),

  mounted() {
    this.$refs.calendar.checkChange();

    // Get Kegiatan
    axios
      .get("http://localhost:8080/kegiatan")
      .then((res) => {
        console.log(res.data);
        // this.kegiatan = res.data.kegiatan;
        // console.log(this.kegiatan);
      })
      .catch((err) => {
        // handle error
        console.log(err);
      });
  },
  methods: {
    viewDay({ date }) {
      this.focus = date;
      this.type = "day";
    },
    getEventColor(event) {
      return event.color;
    },
    setToday() {
      this.focus = "";
    },
    prev() {
      this.$refs.calendar.prev();
    },
    next() {
      this.$refs.calendar.next();
    },
    showEvent({ nativeEvent, event }) {
      const open = () => {
        this.selectedEvent = event;
        this.selectedElement = nativeEvent.target;
        requestAnimationFrame(() =>
          requestAnimationFrame(() => (this.selectedOpen = true))
        );
      };

      if (this.selectedOpen) {
        this.selectedOpen = false;
        requestAnimationFrame(() => requestAnimationFrame(() => open()));
      } else {
        open();
      }

      nativeEvent.stopPropagation();
    },
    updateRange({ start, end }) {
      const events = [];

      const min = new Date(`${start.date}T00:00:00`);
      const max = new Date(`${end.date}T23:59:59`);
      const days = (max.getTime() - min.getTime()) / 86400000;
      const eventCount = this.rnd(days, days + 20);

      for (let i = 0; i < eventCount; i++) {
        const allDay = this.rnd(0, 3) === 0;
        const firstTimestamp = this.rnd(min.getTime(), max.getTime());
        const first = new Date(firstTimestamp - (firstTimestamp % 900000));
        const secondTimestamp = this.rnd(2, allDay ? 288 : 8) * 900000;
        const second = new Date(first.getTime() + secondTimestamp);

        events.push({
          name: this.names[this.rnd(0, this.names.length - 1)],
          start: first,
          end: second,
          color: this.colors[this.rnd(0, this.colors.length - 1)],
          timed: !allDay,
        });
      }

      this.events = events;
    },
    rnd(a, b) {
      return Math.floor((b - a + 1) * Math.random()) + a;
    },
  },
};
</script>