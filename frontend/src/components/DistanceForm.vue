<template>
  <div>
    <v-card variant="outlined" class="distance-form-wrapper">
      <v-card-title>Calculate the distance between two points</v-card-title>
      <v-card class="distance-form-card">
        <v-card-title>Point A</v-card-title>
        <v-divider></v-divider>
        <div class="distance-form-inputs-wrapper">
          <CoordinateInput label="Latitude" v-model="internalCoords.pointALat" />
          <CoordinateInput label="Longitude" v-model="internalCoords.pointALong" />
        </div>
      </v-card>
      <v-card class="distance-form-card">
        <v-card-title>Point B</v-card-title>
        <v-divider></v-divider>
        <div class="distance-form-inputs-wrapper">
          <CoordinateInput label="Latitude" v-model="internalCoords.pointBLat" />
          <CoordinateInput label="Longitude" v-model="internalCoords.pointBLong" />
        </div>
      </v-card>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn variant="outlined" @click="onCalculate"> Calculate </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>
<script setup>
import { ref, computed } from "vue";

import CoordinateInput from "./CoordinateInput.vue";

const props = defineProps({
  modelValue: {
    type: Object,
    required: true,
  },
});

const internalCoords = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

const emit = defineEmits(["calculate", "update:modelValue"]);

function onCalculate() {
  emit("calculate", {
    pointALat: internalCoords.value.pointALat,
    pointALong: internalCoords.value.pointALong,
    pointBLat: internalCoords.value.pointBLat,
    pointBLong: internalCoords.value.pointBLong,
  });
}
</script>
