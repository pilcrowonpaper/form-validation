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
  const formDataErrors = await form.validate(formData);
  console.log(formDataErrors);
  const objectErrors1 = await form.validate({
    required: "",
    min: 1,
    minLength: "a",
    max: 6,
    maxLength: "idiuwhdw",
    pattern: "",
  });
  const objectErrors2 = await form.validate({
    required: "1",
    min: 2,
    minLength: "a3",
    max: 5,
    maxLength: "asejf",
    pattern: "a",
  });
  console.log(objectErrors1);
  console.log(objectErrors2);
};

main();
