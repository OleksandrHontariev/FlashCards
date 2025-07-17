	function DictionaryCreator () {
		const modal = document.getElementById("create_headers_modal");
		const modalHeader = modal.querySelector(".modal-header");
		const modalBody = modal.querySelector(".modal-body");
		const modalFooter = modal.querySelector(".modal-footer");

		showModal();

		function showModal () {
			createModalHeader();
			createModalBody();
			createModalFooter();
			new bootstrap.Modal(modal).show();
		}

		function hideModal () {
			bootstrap.Modal.getOrCreateInstance(modal).hide();
		}

		function createModalHeader () {
			modalHeader.innerHTML = "";

			let wrapper = document.createElement("div");
			wrapper.classList.add("flex-grow-1");

			let title = document.createElement("h1");
			let input = document.createElement("input");

			title.id = "create_dictionary_title";
			title.classList.add("modal-title", "fs-5", "mb-0");
			title.innerText = "Мой словарь";
			title.addEventListener("click", () => {
				input.value = title.textContent.trim();
				title.classList.add("d-none");
				input.classList.remove("d-none");
				input.focus();
			});

			input.classList.add("form-control", "form-control-sm", "d-none");
			input.type = "text";
			input.addEventListener("blur", saveTitle);
			input.addEventListener("keydown", (e) => {
				if (e.key === "Enter") {
					e.preventDefault();
					saveTitle();
				}
			});

			wrapper.appendChild(title);
			wrapper.appendChild(input);

			modalHeader.appendChild(wrapper);

			let closeBtn = document.createElement("button");
			closeBtn.classList.add("btn-close");
			closeBtn.type = "button";
			closeBtn.setAttribute("data-bs-dismiss", "modal");
			closeBtn.setAttribute("aria-label", "Close");

			modalHeader.appendChild(closeBtn);

			function saveTitle () {
				const newValue = input.value.trim();
				if (newValue)
					title.textContent = newValue;

				input.classList.add("d-none");
				title.classList.remove("d-none");
			}
		}

		function createModalBody () {
			modalBody.innerHTML = "";

			let addColumnBtn = document.createElement("button");
			addColumnBtn.classList.add("btn", "btn-sm", "btn-light");

			let i = document.createElement("i");
			i.classList.add("bi", "bi-plus");

			addColumnBtn.appendChild(i);

			let span = document.createElement("span");
			span.innerText = "Добавить название колонки";
			addColumnBtn.appendChild(span);
			addColumnBtn.addEventListener("click", function () {
				this.classList.add("d-none");
				addColumnInputSection(this);
			});

			modalBody.appendChild(addColumnBtn);
		}

		function addColumnInputSection (mainAddButton) {

			let container = document.createElement("div");
			container.classList.add("column-name-section");

			let formGroup = document.createElement("div");
			formGroup.classList.add("form-group", "mb-2");
			

			let input = document.createElement("input");
			input.classList.add("form-control", "form-control-sm");
			input.addEventListener("blur", function () {
				if (clickedOnButtons) return;
				columnNameHanlder();
			});

			input.addEventListener("keydown", function (e) {
				if (e.key === "Enter") {
					e.preventDefault();
					this.blur();
				}
			});

			let clickedOnButtons = false;

			let buttonAdd = document.createElement("button");
			buttonAdd.type = "button";
			buttonAdd.classList.add("btn", "btn-sm", "btn-primary");
			buttonAdd.innerText = "Добавить";

			buttonAdd.addEventListener("mousedown", () => {
			    clickedOnButtons = true;
			});

			buttonAdd.addEventListener("click", columnNameHanlder);

			let buttonRemove = document.createElement("button");
			buttonRemove.classList.add("btn", "btn-sm", "btn-secondary");
			buttonRemove.innerHTML = "<i class='bi bi-x'></i>";

			buttonRemove.addEventListener("mousedown", () => {
			    clickedOnButtons = true;
			});

			buttonRemove.addEventListener("click", function (e) {
				showMainAddButton();
				container.remove();
			});

			buttonAdd.addEventListener("mouseup", () => {
			    setTimeout(() => clickedOnButtons = false, 0);
			});

			buttonRemove.addEventListener("mouseup", () => {
			    setTimeout(() => clickedOnButtons = false, 0);
			});

			formGroup.appendChild(input);
			container.appendChild(formGroup);
			container.appendChild(buttonAdd);
			container.appendChild(document.createTextNode('\u00A0'));
			container.appendChild(buttonRemove);
			modalBody.appendChild(container);
			input.focus();

			function columnNameHanlder () {
				let value = input.value.trim();
				if (!value) {
					showMainAddButton();
				} else {
					renderColumnNameList(value);
					addColumnInputSection(mainAddButton);					
				}
				container.remove();
			}

			function showMainAddButton () {
				if (modalBody.querySelectorAll(".column-name-section").length === 1) {
					mainAddButton.classList.remove("d-none");
				}
			}

			function renderColumnNameList (columnName) {
				let ul = document.getElementById("columns_list");
				if (ul === null) {
					ul = document.createElement("ul");
					ul.classList.add("list-group", "list-group-flush", "mb-2");
					ul.id = "columns_list";
					modalBody.insertBefore(ul, mainAddButton);
				}
				ul.appendChild(createColumnName(columnName));
			}

			function createColumnName (columnName) {
				let li = document.createElement("li");
				li.classList.add("ps-0", "pe-0", "list-group-item", "d-flex", "justify-content-between", "align-items-center");

				let columnsListTitleInput = document.createElement("div");
				columnsListTitleInput.classList.add("columns-list-title-input", "flex-grow-1");

				let span = document.createElement("span");
				span.classList.add("column-title");
				span.innerText = columnName;

				let input = document.createElement("input");
				input.classList.add("form-control", "form-control-sm", "d-none");
				input.value = columnName;
				input.name = "column_name";

				let button = document.createElement("button");
				button.type = "button";
				button.classList.add("btn", "btn-sm", "btn-light");
				button.innerHTML = "<i class='bi bi-x'></i>";
				button.addEventListener("click", () => li.remove());

				span.addEventListener("click", () => {
					input.value = span.textContent.trim();
					span.classList.add("d-none");
					input.classList.remove("d-none");
					input.focus();
				});

				input.addEventListener("blur", saveColumnName);
				input.addEventListener("keydown", (e) => {
					if (e.key === "Enter") {
						e.preventDefault();
						saveColumnName();
					}
				});

				columnsListTitleInput.appendChild(span);
				columnsListTitleInput.appendChild(input);
				li.appendChild(columnsListTitleInput);
				li.appendChild(button);

				return li;

				function saveColumnName () {
					const newValue = input.value.trim();
					if (newValue)
						span.textContent = newValue;

					input.classList.add("d-none");
					span.classList.remove("d-none");
				}
			}
		}

		function createModalFooter () {
			modalFooter.innerHTML = "";
			modalFooter.appendChild(createCancelButton());
			modalFooter.appendChild(createSaveButton());
		}

		function createCancelButton () {
			let button = document.createElement("button");
			button.type = "button";
			button.classList.add("btn", "btn-secondary", "btn-sm");
			button.setAttribute("data-bs-dismiss", "modal");
			button.innerText = "Отмена";
			return button;
		}

		function createSaveButton () {
			let button = document.createElement("button");
			button.type = "button";
			button.classList.add("btn", "btn-primary", "btn-sm");
			button.addEventListener("click", createDictionary);
			button.innerText = "Сохранить";
			return button;
		}

		function createDictionary () {
			let obj = {};
			Array.from(document.querySelectorAll("#columns_list .column-title")).map(c => {
				obj[c.textContent] = null;
			});

			let dictionaryName = document.getElementById("create_dictionary_title").textContent.trim();
			let dictionary = [obj];
			let dictionaryId = DictionaryStorage.generateDictionaryId();

			let ds = new DictionaryStorage();
			ds.saveDictionary(dictionaryId, dictionary, dictionaryName);
			ds.addDictionaryToSidebar(dictionaryId, dictionaryName);

			hideModal ();
			new DictionaryEditor(dictionaryId, function (dictionaryId) {
				Indicator.removeIndicator(dictionaryId);
				ErrorsIndicator.removeErrorsIndicator(dictionaryId);
			});
		}
	}