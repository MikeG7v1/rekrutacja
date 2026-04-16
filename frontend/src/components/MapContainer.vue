<template>
  <v-card variant="outlined" class="map-container">
    <v-toolbar density="compact" color="surface" flat>
      <v-btn-toggle v-model="activePoint" mandatory variant="tonal" class="ml-2 gap-4">
        <v-btn value="A" size="small">Punkt A</v-btn>
        <v-btn value="B" size="small">Punkt B</v-btn>
      </v-btn-toggle>
      <v-spacer> </v-spacer>
      <v-btn @click="onRemoveMarkers"> Remove markers</v-btn>
    </v-toolbar>
    <div id="map" ref="mapElement" />
  </v-card>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from "vue";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const activePoint = ref("A");

const props = defineProps({
  modelValue: {
    type: Object,
    required: true,
  },
});
const emit = defineEmits(["update:modelValue"]);

const mapElement = ref(null);
let map = null;
let markerA = null;
let markerB = null;

onMounted(() => {
  map = L.map("map").setView([52.237, 21.017], 6);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors",
  }).addTo(map);

  const DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });
  L.Marker.prototype.options.icon = DefaultIcon;

  map.on("click", (e) => {
    const { lat, lng } = e.latlng;
    const newCoords = { ...props.modelValue };

    if (activePoint.value === "A") {
      newCoords.pointALat = lat.toFixed(5);
      newCoords.pointALong = lng.toFixed(5);
    } else {
      newCoords.pointBLat = lat.toFixed(5);
      newCoords.pointBLong = lng.toFixed(5);
    }

    emit("update:modelValue", newCoords);
  });
});

watch(
  () => props.modelValue,
  (newVal) => {
    if (!map) return;

    if (newVal.pointALat && newVal.pointALong) {
      const posA = [newVal.pointALat, newVal.pointALong];
      if (markerA) {
        markerA.setLatLng(posA);
      } else {
        markerA = L.marker(posA, { draggable: "true" }).addTo(map).bindPopup("Point A");

        markerA.on("dragend", (e) => {
          const { lat, lng } = e.target.getLatLng();
          emit("update:modelValue", {
            ...props.modelValue,
            pointALat: lat.toFixed(5),
            pointALong: lng.toFixed(5),
          });
        });
      }
    }

    if (newVal.pointBLat && newVal.pointBLong) {
      const posB = [newVal.pointBLat, newVal.pointBLong];
      if (markerB) {
        markerB.setLatLng(posB);
      } else {
        markerB = L.marker(posB, { draggable: "true" }).addTo(map).bindPopup("Point B");

        markerB.on("dragend", (e) => {
          const { lat, lng } = e.target.getLatLng();
          emit("update:modelValue", {
            ...props.modelValue,
            pointBLat: lat.toFixed(5),
            pointBLong: lng.toFixed(5),
          });
        });
      }
    }

    if (markerA && markerB) {
      const group = new L.featureGroup([markerA, markerB]);
      map.fitBounds(group.getBounds().pad(0.2));
    }
  },
  { deep: true, immediate: true } // 'deep' jest kluczowy dla obiektów!
);

watch(
  () => props.modelValue,
  (newVal) => {
    if (!map) {
      return;
    }
  },
  { deep: true }
);

const onRemoveMarkers = () => {
  emit("update:modelValue", {
    pointALat: null,
    pointALong: null,
    pointBLat: null,
    pointBLong: null,
  });
  if (markerA) {
    map.removeLayer(markerA);
    markerA = null;
  }
  if (markerB) {
    map.removeLayer(markerB);
    markerB = null;
  }
};
</script>

<style scoped>
.map-container {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

#map {
  flex-grow: 1;
  width: 100%;
  height: 100%;
  z-index: 1;
}
</style>
