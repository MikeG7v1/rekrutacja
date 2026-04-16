import { ref } from "vue";

function validateCoordinates(coords) {
 const { pointALat, pointALong, pointBLat, pointBLong } = coords;
 if (
      !coords.pointALat ||
      !coords.pointALong ||
      !coords.pointBLat ||
      !coords.pointBLong
 ) {
  return false;
 }

 return true;
}

export function useDistanceApi() {
  const error = ref(null);
  const isLoading = ref(false);

 const fetchDistance = async (coords) => {
    if (!validateCoordinates(coords)) {
      error.value = "Please fill in all coordinates for both points.";
      return;
    }

    isLoading.value = true;
    error.value = null;

    try {
      const response = await fetch("http://localhost:8000/api.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lat1: coords.pointALat,
          lon1: coords.pointALong,
          lat2: coords.pointBLat,
          lon2: coords.pointBLong,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        return data;
      } else {
        error.value = data.error || "Server returned an error.";
      }
    } catch (err) {
      error.value = err;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    error,
    isLoading,
    fetchDistance,
  };
}
