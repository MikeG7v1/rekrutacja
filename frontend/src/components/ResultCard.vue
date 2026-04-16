<template>
  <v-card variant="outlined" class="result-card mt-4" :loading="isLoading">
    <v-card-title class="d-flex align-center">
      <v-icon start icon="mdi-map-marker-distance"></v-icon>
      Distance Result
    </v-card-title>
    <v-divider></v-divider>

    <v-card-text class="pa-6">
      <div v-if="isLoading" class="text-center py-4">
        <v-progress-circular indeterminate></v-progress-circular>
        <p class="mt-2 text-grey">Calculating distance...</p>
      </div>

      <v-alert
        v-else-if="error"
        type="error"
        variant="tonal"
        icon="mdi-alert-circle"
        class="mb-0"
      >
        {{ error }}
      </v-alert>
      <div v-else-if="result">
        <v-row gap="240">
          <div>
            <span>Kilometers</span>
            <div>{{ result.distance_kilometers }}km</div>
          </div>
          <div>
            <span>Meters</span>
            <div>{{ result.distance_meters }}m</div>
          </div>
          <div>
            <span>Miles (mi)</span>
            <div>{{ result.distance_miles }}mi</div>
          </div>
        </v-row>
      </div>
      <div v-else>Enter coordinates and click "Calculate" to see the distance.</div>
    </v-card-text>
  </v-card>
</template>

<script setup>
defineProps({
  result: {
    type: Object,
    default: null,
  },
  error: {
    type: String,
    default: null,
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
});
</script>
