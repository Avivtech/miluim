function isTouchDevice() {
  return "ontouchstart" in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
}

document.addEventListener("DOMContentLoaded", () => {
  const submit_btn = document.getElementById("submit");
  const touchDevice = isTouchDevice();
  
  if (touchDevice) {
    //console.log("Touch device");
  } else {
    //console.log("Non-touch device");
  }

  // Locations array
  const combinedArray = [...part_a, ...part_b];
  const a = document.createElement("div");
  a.setAttribute("class", "hide");

  combinedArray.forEach((optionValue) => {
    const optionElement = document.createElement("div");
    optionElement.textContent = optionValue;
    optionElement.setAttribute("class", "option-item");
    a.appendChild(optionElement);
  });

  document.getElementById("city-wrap")?.appendChild(a);

  // Select inputs
  document.querySelectorAll(".select-group").forEach((group, index) => {
    const option_items = group.querySelectorAll(".option-item");
    const searchInput = group.querySelector(".option-search");
    const clearButton = group.querySelector(".clear-selection");
    const select = document.createElement("select");

    select.setAttribute("class", "select-list");
    select.setAttribute("id", `select-${index}`);

    select.style.zIndex = "2";
    select.style.position = "absolute";
    select.style.display = "none";
    select.style.padding = "6px 12px";
    select.style.width = searchInput.offsetWidth + "px";
    select.size = Math.min(option_items.length, 10) + 1;
    select.setAttribute("direction", "rtl");

    option_items.forEach((item) => {
      const option = document.createElement("option");
      option.value = item.textContent.trim();
      option.textContent = item.textContent.trim();
      option.setAttribute("class", "input-option");
      select.appendChild(option);
    });

    if (index === 0) {
      const otherOption = document.createElement("option");
      otherOption.value = "אחר";
      otherOption.textContent = "לא מצאתם? הוסיפו...";
      otherOption.setAttribute("id", `other-option-${index}`);
      otherOption.setAttribute("class", "input-option");
      select.appendChild(otherOption);
    }
    searchInput.parentNode.insertBefore(select, searchInput.nextSibling);

    const showAndFilterOptions = () => {
      select.style.display = "block";
      const searchValue = searchInput.value.toLowerCase();
      let matchingOptions = 0;
      let matchingOptionsStrict = 0;
      
      Array.from(select.options).forEach((option) => {
        const matches = option.value.toLowerCase().includes(searchValue);
        const matchesStrict = option.value.toLowerCase() === searchValue; // Strict matching
        
        option.hidden = !matches;
        if (matches) matchingOptions++;
        if (matchesStrict) matchingOptionsStrict++;
      });

      if (matchingOptionsStrict === 0) {
        console.log('No match');
        this.classList.add("is-invalid");
        submit_btn.setAttribute("disabled", "disabled");
      } else {
        console.log('Match');
        this.classList.remove("is-invalid");
        submit_btn.removeAttribute("disabled");
      }
      select.size = Math.max(matchingOptions, 1) + 1;
      clearButton.style.display = searchInput.value ? "inline-block" : "none";
    };

    searchInput.addEventListener("focus", showAndFilterOptions);
    searchInput.addEventListener("input", showAndFilterOptions);

    function selectClicked(event) {
      const isClickOutsideSelect = !select.contains(event.target);
      const isClickOutsideSearchInput = !searchInput.contains(event.target);

      if (isClickOutsideSelect || isClickOutsideSearchInput) {
        select.style.display = "none";
        clearButton.style.display = searchInput.value ? "inline-block" : "none";
      }
    }

    document.addEventListener("click", selectClicked(event), true);
    document.addEventListener("click", function (event) {
      let isClickInsideOptionSearch = event.target.closest(".option-search") !== null;

      if (!isClickInsideOptionSearch) {
        document.querySelectorAll(".select-list").forEach((select) => {
          if (!select.contains(event.target)) {
            select.style.display = "none";
          }
        });
      }
    });

    select.addEventListener("change", () => {
      searchInput.value = select.value;
      select.style.display = "none";
      clearButton.style.display = "inline-block";
    });

    clearButton.addEventListener("click", () => {
      searchInput.value = "";
      select.value = "";
      select.style.display = "none";
      clearButton.style.display = "none";
      showAndFilterOptions();
    });
  });

  // Show 'other' if selected
  const all_selects = document.querySelectorAll(".select-list");

  all_selects.forEach(function (select_list) {
    select_list.addEventListener("change", function () {
      let other_wrap = select_list.parentElement.parentElement.nextElementSibling;
      if (other_wrap.querySelector(".input-wrap")) {
        if (this.value === "אחר") {
          other_wrap.querySelector(".input-wrap").classList.remove("hide");
        } else {
          other_wrap.querySelector(".input-wrap").classList.add("hide");
        }
      }
    });
  });

  // URL validation
  const urlInputs = document.querySelectorAll('input[type="url"]');
  const urlPattern = new RegExp("^(https?:\\/\\/)?" + "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + "((\\d{1,3}\\.){3}\\d{1,3}))" + "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + "(\\?[;&a-z\\d%_.~+=-]*)?" + "(\\#[-a-z\\d_]*)?$", "i");

  urlInputs.forEach((input) => {
    input.addEventListener("change", function () {
      const urlValue = this.value.trim();

      if (input.required && !urlValue) {
        console.error("This field is required. Please enter a URL.");
        this.classList.add("is-invalid");
        submit_btn.setAttribute("disabled", "disabled");
        return;
      }

      if (urlValue && !urlPattern.test(urlValue)) {
        this.classList.add("is-invalid");
        submit_btn.setAttribute("disabled", "disabled");
      } else if (urlValue) {
        this.classList.remove("is-invalid");
        submit_btn.removeAttribute("disabled");
      } else {
        this.classList.remove("is-invalid");
        submit_btn.removeAttribute("disabled");
      }
    });
  });

  // Tags
  const input = document.getElementById("tags-input");
  const addedTagsContainer = document.getElementById("added-tags");
  const tagsInput = document.getElementById("tags");
  let tags = [];

  function updateTagsInput() {
    tagsInput.value = tags.join(", ");
  }

  function createTag(label) {
    const div = document.createElement("div");
    div.setAttribute("class", "n-tag");
    const span = document.createElement("span");
    span.innerHTML = label;
    const closeBtn = document.createElement("span");
    closeBtn.innerHTML = "&times;";
    closeBtn.setAttribute("class", "remove-tag");
    closeBtn.onclick = () => {
      div.remove();
      tags = tags.filter((tag) => tag !== label);
      updateTagsInput();
    };
    div.appendChild(span);
    div.appendChild(closeBtn);
    return div;
  }

  function addTag(e) {
    const keyCode = e.which || e.keyCode;
    if (keyCode === 13 || e.key === ",") {
      let tag = input.value.trim().replace(/,/g, "");
      if (tag && !tags.includes(tag)) {
        tags.push(tag);
        const tagElement = createTag(tag);
        addedTagsContainer.appendChild(tagElement);
        updateTagsInput();
      }
      input.value = "";
      e.preventDefault();
    }
  }
  input.addEventListener("keydown", addTag);

  // Spam honeypot
  let advantageInput = document.getElementById("advantage");
  let form = document.getElementById("add-business");

  advantageInput.addEventListener("input", function () {
    if (advantageInput.value.trim() !== "") {
      form.onsubmit = function (event) {
        event.preventDefault();
      };
    } else {
      form.onsubmit = null;
    }
  });

  // Split tags
  function splitAndClassifyTags() {
    const tagLists = document.querySelectorAll(".biz-tags-list");

    tagLists.forEach((tagList) => {
      const tags = tagList.textContent.split(",");
      tagList.textContent = "";

      tags.forEach((tag) => {
        const span = document.createElement("span");
        span.textContent = tag.trim();
        span.classList.add("biz-tag");
        span.setAttribute("fs-cmsfilter-field", "tags");
        tagList.appendChild(span);
      });
    });
  }
  splitAndClassifyTags();

  // Cloudinary Upload
  function createUploadWidget(buttonId) {
    return cloudinary.createUploadWidget(
      {
        cloudName: "djnt3cg7k",
        maxFileSize: "2097152",
        uploadPreset: "xvflc7q5",
        sources: ["local", "url", "camera", "dropbox"],
      },
      function (error, result) {
        if (!error && result && result.event === "success") {
          const btn = document.getElementById(buttonId);
          const sccTxt = btn.parentElement.querySelector(".upload-max");
          let sibling = btn.nextElementSibling;
          let inputElement = null;

          while (sibling && !inputElement) {
            inputElement = sibling.querySelector('[data-role="url"]');
            sibling = sibling.nextElementSibling;
          }
          console.log(inputElement, result.info);
          btn.parentElement.classList.add("upload-success");
          btn.querySelector(".w-inline-block").innerText = result.info.original_filename + "." + result.info.format;
          sccTxt.innerText = "מעולה!";
          inputElement.value = result.info.url;
        }
      }
    );
  }

  const uploadBtns = document.querySelectorAll(".cta.upload");
  uploadBtns.forEach(function (uBtn) {
    uBtn.addEventListener("click", function () {
      createUploadWidget(uBtn.id).open();
    });
  });
});
