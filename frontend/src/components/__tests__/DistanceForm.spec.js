import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import { createVuetify } from "vuetify";
import DistanceForm from "../DistanceForm.vue";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

const vuetify = createVuetify({
  components,
  directives,
});

global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

describe("DistanceForm.vue", () => {
  const modelValue = {
    pointALat: 52.22,
    pointALong: 21.01,
    pointBLat: 50.06,
    pointBLong: 19.94,
  };

  it('Emits "calculate" event with correct data after form submission', async () => {
    const wrapper = mount(DistanceForm, {
      props: { modelValue },
      global: { plugins: [vuetify] },
    });

    const button = wrapper.find("button");
    expect(button.exists()).toBe(true);

    await button.trigger("click");
    expect(wrapper.emitted()).toHaveProperty("calculate");
    expect(wrapper.emitted().calculate[0][0]).toEqual(modelValue);
  });
});
