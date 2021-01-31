// constructor
export default class Select {
  constructor(element) {
    this.element = element;
    // get all options
    this.options = getFormattedOptions(element.querySelectorAll("option"));

    // create new custom elements
    this.customElement = document.createElement("div");
    this.labelElement = document.createElement("span");
    this.optionsCustomElement = document.createElement("ul");
    setupCustomElement(this);

    // hide html select
    element.style.display = "none";

    // display custom elements
    element.after(this.customElement);
  }

  /** getters*/
  get selectedOption() {
    return this.options.find((option) => option.selected);
  }

  get selectedOptionIndex() {
    return this.options.indexOf(this.selectedOption);
  }

  // select value
  selectValue(value) {
    const newSelectedOption = this.options.find((option) => {
      return option.value === value;
    });

    const prevSelectedOption = this.selectedOption;
    prevSelectedOption.selected = false;
    prevSelectedOption.element.selected = false;

    newSelectedOption.selected = true;
    newSelectedOption.element.selected = true;

    this.labelElement.innerText = newSelectedOption.label;
    // remove/add selected style from previous selected item when new item is selected
    this.optionsCustomElement
      .querySelector(`[data-value="${prevSelectedOption.value}"]`)
      .classList.remove("selected");

    const newCustomElement = this.optionsCustomElement.querySelector(
      `[data-value="${newSelectedOption.value}"]`
    );
    // .classList.add("selected");
    newCustomElement.classList.add("selected");
    newCustomElement.scrollIntoView({ block: "nearest" });

    // add selected style to the new selected item
    // optionElement.classList.add("selected");
  }
}

// setup
function setupCustomElement(select) {
  select.customElement.classList.add("custom-select-wrapper");
  select.customElement.tabIndex = 0;

  select.labelElement.classList.add("custom-select-value");
  select.labelElement.innerText = select.selectedOption.label;
  select.customElement.append(select.labelElement);

  select.optionsCustomElement.classList.add("custom-select-options");
  select.options.forEach((option) => {
    const optionElement = document.createElement("li");
    optionElement.classList.add("custom-select-option");
    optionElement.classList.toggle("selected", option.selected);
    optionElement.innerText = option.label;
    optionElement.dataset.value = option.value;

    // enable selecting of list items
    optionElement.addEventListener("click", () => {
      select.selectValue(option.value);

      select.optionsCustomElement.classList.remove("show");
    });

    // display list
    select.optionsCustomElement.append(optionElement);
  });
  select.customElement.append(select.optionsCustomElement);

  // display list content on click
  select.labelElement.addEventListener("click", () => {
    select.optionsCustomElement.classList.toggle("show");
  });

  // close list when focus is lost
  select.customElement.addEventListener("blur", () => {
    select.optionsCustomElement.classList.remove("show");
  });

  // set Tomeout
  let debounceTimeout;

  // clear search term after timeout
  let searchTerm = "";

  // add keyboard interactions
  select.customElement.addEventListener("keydown", (e) => {
    switch (e.code) {
      // toggle when Enter key is pressed

      case "Space": {
        select.optionsCustomElement.classList.toggle("show");
        break;
      }

      // toggle when Enter key is pressed
      case "Enter": {
        select.optionsCustomElement.classList.toggle("show");
        break;
      }
      // eph 5:18

      case "ArrowUp": {
        const prevOption = select.options[select.selectedOptionIndex - 1];
        if (prevOption) {
          select.selectValue(prevOption.value);
        }
        break;
      }

      case "ArrowDown": {
        const nextOption = select.options[select.selectedOptionIndex + 1];
        if (nextOption) {
          select.selectValue(nextOption.value);
        }
        break;
      }

      case "Escape": {
        select.optionsCustomElement.classList.remove("show");
        break;
      }

      default: {
        clearTimeout(debounceTimeout);
        searchTerm += e.key;
        debounceTimeout = setTimeout(() => {
          searchTerm = "";
        }, 500);

        const searchedOption = select.options.find((option) => {
          return option.label.toLowerCase().startsWith(searchTerm);
        });
        if (searchedOption) {
          select.selectValue(searchedOption.value);
        }
        break;
      }
    }
  });
}

// get option elements
function getFormattedOptions(optionElements) {
  // convert into array and loop
  return [...optionElements].map((optionElement) => {
    return {
      value: optionElement.value,
      label: optionElement.label,
      selected: optionElement.selected,
      element: optionElement,
    };
  });
}
