<template>
  <div class="distance-calculator-wrapper">
    <v-row gap="8" align="stretch" display="flex">
      <v-col cols="12" md="5">
        <DistanceForm v-model="coords" @calculate="onCalculate" />
      </v-col>
      <v-col cols="12" md="7" display="flex">
        <MapContainer class="grow" v-model="coords" />
      </v-col>
    </v-row>
    <ResultCard :result="result" :error="error" :isLoading="isLoading" />
  </div>
</template>

<script setup>
import { ref } from "vue";
import MapContainer from "./MapContainer.vue";

import DistanceForm from "./DistanceForm.vue";
import ResultCard from "./ResultCard.vue";
import { useDistanceApi } from "../composables/useDistanceApi";

const { error, isLoading, fetchDistance } = useDistanceApi();
const result = ref(null);

const coords = ref({
  pointALat: null,
  pointALong: null,
  pointBLat: null,
  pointBLong: null,
});

const onCalculate = async (coords) => {
  result.value = await fetchDistance(coords);
};
</script>
