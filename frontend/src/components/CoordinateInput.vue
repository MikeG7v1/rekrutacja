<template>
  <v-text-field
    v-model="internalValue"
    clearable
    :label="label"
    variant="outlined"
    :rules="validationRules"
    @input="onInput"
    @blur="onBlur"
    @click:clear="onClear"
    type="number"
  ></v-text-field>
</template>
<script setup>
import { ref, watch, computed } from "vue";

const props = defineProps({
  label: {
    type: String,
    default: "Label",
    validator: (value) => value.includes("Lat") || value.includes("Long"),
  },
  modelValue: {
    type: [String, Number],
    default: "",
  },
});

const limits = computed(() => {
  if (props.label.includes("Lat")) {
    return { min: -90, max: 90 };
  } else if (props.label.includes("Long")) {
    return { min: -180, max: 180 };
  }
  return { min: null, max: null };
});

const internalValue = ref("");
const emit = defineEmits(["update:modelValue"]);

const validationRules = [
  (v) => !!v || "This field is required",
  (v) => !isNaN(Number(v)) || "Value must be a number",
  (v) =>
    (Number(v) >= limits.value.min && Number(v) <= limits.value.max) ||
    `Value must be between ${limits.value.min} and ${limits.value.max}`,
];

watch(
  () => props.modelValue,
  (newVal) => {
    internalValue.value = newVal ?? "";
  },
  { immediate: true }
);

function onInput() {
  const val = internalValue.value;
  const isValid = validationRules.every((rule) => {
    const result = rule(val);
    return result === true;
  });
  if (isValid) {
    emit("update:modelValue", Number(val));
  } else {
    emit("update:modelValue", null);
  }
}

function onClear() {
  internalValue.value = "";
  emit("update:modelValue", null);
}

// Formatting to 5 decimal places for coordinates
// provides around 1 meter of precision
function onBlur() {
  const val = internalValue.value;

  if (val && !isNaN(Number(val))) {
    const formatted = Number(val).toFixed(5);
    internalValue.value = formatted;

    emit("update:modelValue", Number(formatted));
  }
}
</script>
