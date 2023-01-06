import {
  Form,
  max,
  maxLength,
  min,
  minLength,
  pattern,
  required,
} from "../src/index.js";

// TODO: make an actual test

const main = async () => {
  const form = new Form()
    .field("required", required("required!" as const))
    .field("min", min(2, "min!" as const))
    .field("minLength", minLength(2, "minLength!" as const))
    .field("max", max(5, "max!" as const))
    .field("maxLength", maxLength(5, "maxLength!" as const))
    .field("pattern", pattern(/^a/, "pattern!" as const));
  const formData = new FormData();
  formData.set("required", "");
  formData.set("min", "1");
  formData.set("minLength", "a");
  formData.set("max", "6");
  formData.set("maxLength", "adsj3s");
  formData.set("pattern", "");
  const { data: data1, errors: errors1 } = await form.parse(formData);
  console.log(errors1);
  const { data: data2, errors: errors2 } = await form.parse({
    required: "",
    min: 1,
    minLength: "a",
    max: 6,
    maxLength: "idiuwhdw",
    pattern: "",
  });

  const { data: data3, errors: errors3 } = await form.parse({
    required: "1",
    min: 2,
    minLength: "a3",
    max: 5,
    maxLength: "asejf",
    pattern: "a",
  });
  console.log(errors2);
  console.log(errors3);
};

main();
