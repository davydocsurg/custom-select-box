import Select from "./select.js";

const selectElements = document.querySelectorAll("[custom-data]");

selectElements.forEach((selectElement) => {
  new Select(selectElement);
});
