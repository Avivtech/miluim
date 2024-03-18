// Tiny RTX editor initialization
tinymce.init({
  selector: "textarea",
  menubar: false,
  height: 200,
  branding: false,
  directionality: "rtl",
  language: 'he_IL'
  content_langs: [{ title: "Hebrew", code: "he" }],
  plugins: "autolink charmap emoticons link lists searchreplace visualblocks wordcount",
  toolbar: "undo redo | blocks | bold italic underline strikethrough | link | numlist bullist | emoticons charmap | removeformat",
});

// Touch device detection
function isTouchDevice() {
  return "ontouchstart" in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
}

const submit_btn = document.getElementById("submit");
const touchDevice = isTouchDevice();

// Combining arrays and creating elements
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

document.addEventListener("DOMContentLoaded", () => {
  let matchingOptions = 0;
  let matchingOptionsStrict = 0;

  // CMSLoad loaded
  window.fsAttributes = window.fsAttributes || [];
  window.fsAttributes.push([
    "cmsload",
    (listInstances) => {
      const [listInstance] = listInstances;

      listInstance.on("renderitems", (renderedItems) => {});

      // Select inputs
      document.querySelectorAll(".select-group").forEach((group, index) => {
        const option_items = group.querySelectorAll(".option-item");
        const searchInput = group.querySelector(".option-search");
        const clearButton = group.querySelector(".clear-selection");
        const select = document.createElement("select");

        function checkSelectValid() {
          matchingOptions = 0;
          matchingOptionsStrict = 0;

          Array.from(select.options).forEach((option) => {
            if (!option.hidden) matchingOptions++;
            if (!option.hidden && option.value.toLowerCase() === searchInput.value.toLowerCase()) {
              matchingOptionsStrict++;
            }
          });

          if (matchingOptionsStrict === 0) {
            searchInput.classList.add("is-invalid");
            submit_btn.setAttribute("disabled", "disabled");
          } else {
            searchInput.classList.remove("is-invalid");
            submit_btn.removeAttribute("disabled");
          }
        }

        select.setAttribute("class", "select-list");
        select.setAttribute("id", `select-${index}`);

        select.style.zIndex = "3";
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
          otherOption.setAttribute("class", "input-option input-option-other");
          select.appendChild(otherOption);
        }
        searchInput.parentNode.insertBefore(select, searchInput.nextSibling);

        const showAndFilterOptions = () => {
          select.style.display = "block";
          const searchValue = searchInput.value.toLowerCase();

          Array.from(select.options).forEach((option) => {
            const matches = option.value.toLowerCase().includes(searchValue);
            const matchesStrict = option.value.toLowerCase() === searchValue; // Strict matching

            option.hidden = !matches;
            if (matches) matchingOptions++;
            if (matchesStrict) matchingOptionsStrict++;
          });

          checkSelectValid();

          select.size = Math.max(matchingOptions, 1);
          clearButton.style.display = searchInput.value ? "inline-block" : "none";
        };

        searchInput.addEventListener("focus", showAndFilterOptions);
        searchInput.addEventListener("input", showAndFilterOptions);
        searchInput.addEventListener("change", showAndFilterOptions);
        searchInput.addEventListener("blur", showAndFilterOptions);

        document.addEventListener("click", function (event) {
          let isClickInsideOptionSearch = event.target.closest(".option-search") !== null;
          let isClickInsideInput = event.target.closest("input") !== null;
          let isClickInsideButton = event.target.closest("button") !== null;

          if (!isClickInsideOptionSearch && !isClickInsideInput && !isClickInsideButton) {
            document.querySelectorAll(".select-list").forEach((select) => {
              if (!select.contains(event.target)) {
                select.style.display = "none";
                checkSelectValid();
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
          console.log("selected");
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
    },
  ]);

// URL validation
const urlInputs = document.querySelectorAll('input[type="url"]');
const urlPattern = new RegExp("^(https?:\\/\\/www.)?" + "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + "((\\d{1,3}\\.){3}\\d{1,3}))" + "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + "(\\?[;&a-z\\d%_.~+=-]*)?" + "(\\#[-a-z\\d_]*)?$", "i");

urlInputs.forEach((input) => {
  input.addEventListener("change", function () {
    let urlValue = this.value.trim();

    // Add "https://www." if not present and not starting with 'www.'
    if (urlValue && !urlValue.startsWith("http://") && !urlValue.startsWith("https://") && !urlValue.startsWith("www.")) {
      urlValue = "https://www." + urlValue;
      this.value = urlValue; // Update the input field
    }

    // Prepend "https://" if it starts with "www." but doesn't have "https://"
    if (urlValue.startsWith("www.")) {
      urlValue = "https://" + urlValue;
      this.value = urlValue; // Update the input field
    }

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

// selectClicked function
function selectClicked(event) {
  document.querySelectorAll(".select-list").forEach((select) => {
    if (!select.contains(event.target) && !event.target.matches(".option-search")) {
      select.style.display = "none";
    }
  });
}
document.addEventListener("click", selectClicked, true);
