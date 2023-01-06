import { parse } from "../src/index.js";

const main = async () => {
  const formData = new FormData();
  formData.append("username", "hello");
  formData.append("age", "12"), formData.append("checked", "on");
  formData.append("date", new Date().toString());
  formData.append("topics", "music");
  formData.append("topics", "sports");
  formData.append("ignore", "IGNORE");
  const result = parse(formData, {
    username: "string",
    age: "number",
    checked: "boolean",
    date: "date",
    topics: "array.string",
  });
  console.log(result);
};

main();
