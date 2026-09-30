import { test } from "node:test";
import assert from "node:assert/strict";
import {
  builderReducer,
  initialState,
  configFromIds,
  totalPrice,
  sanitizeSaved,
  templates,
  selectedProducts,
  matchingTemplate,
} from "../src/lib/catalog";

test("a different desk replaces the first without changing accessories", () => {
  let state = builderReducer(initialState, { type: "select", id: "desk-oak" });
  state = builderReducer(state, { type: "select", id: "plant" });
  state = builderReducer(state, { type: "select", id: "desk-walnut" });
  assert.deepEqual(state.config, { desk: "desk-walnut", plant: "plant" });
  assert.equal(totalPrice(state.config, "weekly"), 225000);
});
test("templates replace the whole setup and undo recovers the previous setup", () => {
  const original = {
    ...initialState,
    config: configFromIds(["desk-walnut", "rug"]),
  };
  const state = builderReducer(original, {
    type: "template",
    id: "essentials",
  });
  assert.deepEqual(
    selectedProducts(state.config).map((p) => p.id),
    ["desk-oak", "chair-ergo"],
  );
  assert.deepEqual(
    builderReducer(state, { type: "undo" }).config,
    original.config,
  );
});
test("rental periods use independent explicit rates and dual monitors count as one set", () => {
  const config = configFromIds(["desk-oak", "chair-ergo", "monitor-dual"]);
  assert.equal(totalPrice(config, "weekly"), 575000);
  assert.equal(totalPrice(config, "monthly"), 1955000);
  assert.equal(selectedProducts(config).length, 3);
});
test("untrusted saved state discards mismatched slots and obsolete products", () => {
  assert.deepEqual(
    sanitizeSaved({
      config: {
        desk: "chair-ergo",
        chair: "chair-studio",
        plant: "missing",
        unknown: "plant",
      },
      period: "bad",
    }),
    { config: { chair: "chair-studio" }, period: "weekly" },
  );
  assert.deepEqual(sanitizeSaved(null), { config: {}, period: "weekly" });
});
test("every template contains a desk and chair; customization updates template identity", () => {
  for (const template of templates) {
    const config = configFromIds(template.ids);
    assert.ok(config.desk && config.chair);
    assert.equal(selectedProducts(config).length, template.ids.length);
    assert.equal(matchingTemplate(config)?.id, template.id);
  }
  const state = builderReducer(
    { ...initialState, config: configFromIds(templates[0].ids) },
    { type: "select", id: "plant" },
  );
  assert.equal(matchingTemplate(state.config), undefined);
});
test("removing and resetting leave no stale charges, and reset can be undone", () => {
  const config = configFromIds(["desk-oak", "chair-ergo", "plant"]);
  let state = builderReducer(
    { ...initialState, config },
    { type: "remove", slot: "plant" },
  );
  assert.equal(totalPrice(state.config, "weekly"), 275000);
  state = builderReducer(state, { type: "reset" });
  assert.equal(totalPrice(state.config, "weekly"), 0);
  assert.equal(
    totalPrice(builderReducer(state, { type: "undo" }).config, "weekly"),
    275000,
  );
});
