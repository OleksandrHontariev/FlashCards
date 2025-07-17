		function DictionaryStorage () {

			// constructor
			let indicator = null;
			let self = this;
			let alertRename = document.getElementById("renameDictionary");
			let alertRemove = document.getElementById("removeDictionary");

			alertRename.querySelector(".btn-rename").addEventListener("click", function () {
				let id = alertRename.querySelector(".dictionary-id").value;
				let friendlyName = alertRename.querySelector(".dictionary-name").value;
				self.refreshDictionaryList(id, friendlyName);
				renameDictionaryFromSidebar(id, friendlyName);

				hideModal(alertRename);
			});

			alertRemove.querySelector(".btn-remove").addEventListener("click", function () {
				let id = alertRemove.querySelector(".dictionary-id").value;
				
				DictionaryStorage.removeDictionary(id);
				self.removeDictionaryFromList(id);

				Indicator.removeIndicator(id);
				ErrorsIndicator.removeErrorsIndicator(id);

				document.querySelector(`.item-${id}`).remove();

				if (id === DictionaryStorage.getActiveDictionary()) {
					DictionaryStorage.setActiveDictionary();
					DictionaryStorage.showPleaseSelectDictionary();
				}

				hideModal(alertRemove);
			});

			this.saveDictionary = function (id, dictionary, friendlyName) {
				this.addItemToDictionaryList(id, friendlyName);
				saveDictionary(id, dictionary);
			};

			this.getDictionaryList = function () {
				let data = localStorage.getItem(dictionaryKey);
				if (data === null) {
					return null;
				} else {
					return JSON.parse(data);
				}
			};

			this.addItemToDictionaryList = function (id, name) {
				let data = this.getDictionaryList();
				if (data === null) {
					data = [];	
				}
				data.push({ id: id, friendlyName: name });
				localStorage.setItem(dictionaryKey, JSON.stringify(data));
			}

			this.refreshDictionaryList = function (id, friendlyName) {
				let data = this.getDictionaryList();
				if (data === null) {
					data = [];
				}

				// refresh name
				let found = data.find(item => item.id == id);
				if (found) {
					found.friendlyName = friendlyName;
				} else {
					found = {friendlyName: friendlyName, id: id};
					data.push(found);
				}
				
				try {
					localStorage.setItem(dictionaryKey, JSON.stringify(data));
				} catch (e) {
					if (e.name === "QuotaExceededError") {
						alert("Failed to save data to local storage, data storage size exceeded");
					}
				}
			};

			this.removeDictionaryFromList = function (id) {
				let data = this.getDictionaryList();
				if (data != null) {
					data = data.filter(item => item.id != id);
					if (data.length === 0) {
						localStorage.removeItem(dictionaryKey);
					} else {
						localStorage.setItem(dictionaryKey, JSON.stringify(data));
					}
				}
			}

			this.addDictionaryToSidebar = function (dictionaryId, friendlyName) {
				let ul = document.querySelector(".dict-list");
				let li = createDictionaryListItem(friendlyName, dictionaryId);
				ul.appendChild(li);
			}

			this.printDictionaryList = function (dictionaryId) {
				let data = this.getDictionaryList();
				if (data !== null) {
					data.forEach(function (item) {
						let li = createDictionaryListItem(item.friendlyName, item.id);
						let ul = document.querySelector(".dict-list");
						ul.appendChild(li);
					});
				}

				if (dictionaryId) {
					document.querySelector(`.dict-list .item-${dictionaryId} .sidebar-item`).classList.add("active");
				}
			};

			function renameDictionaryFromSidebar (dictionaryId, friendlyName) {
				let li = document.querySelector(`.item-${dictionaryId}`);
				li.querySelector(".sidebar-item span").innerText = friendlyName;
			}

			function downloadDictionary (id) {
				let dictionary = getDictionary(id);
				let friendlyName = getDictionaryFriendlyName(id);

				const ws = XLSX.utils.json_to_sheet(dictionary);
				const wb = XLSX.utils.book_new();
				XLSX.utils.book_append_sheet(wb, ws, friendlyName);
				XLSX.writeFile(wb, `${id}.xlsx`);
			}

			function getDictionary (id) {
				let data = localStorage.getItem(id);
				if (data === null) return null;
				else {
					return JSON.parse(data);
				} 
			}

			function getDictionaryFriendlyName (id) {
				let list = self.getDictionaryList();
				if (list === null) {
					return null;
				} else {
					let item = list.find(d => d.id == id) ?? null;
					if (item === null) {
						return null;
					} else {
						return item.friendlyName;
					}
				}
			}

			function createDictionaryListItem (dictionaryName, id) {
					let html =
`
					<li class="item-${id}">
						<div data-id="${id}" class="d-flex align-items-center position-relative sidebar-item mb-2">
							<span class="a-text text-truncate flex-grow-1">
								${dictionaryName}
							</span>
							<div class="dropdown">
								<button type="button" class="btn btn-sm sidebar-btn"
								aria-expanded="false"
								data-bs-toggle="dropdown"
								aria-expanded="false">
									<i class="bi bi-three-dots"></i>
								</button>
						      <ul class="dropdown-menu dropdown-menu-end">
						      	<li>
						      		<a data-id="${id}" class="dropdown-item lnk-rename" href="#">
						      			<i class="bi bi-pencil"></i>&nbsp;
						      			Переименовать
						      		</a>
						      	</li>
						        <li>
						        	<a data-id="${id}" class="dropdown-item lnk-edit" href="#">
						        		<i class="bi bi-pencil-square"></i>&nbsp;
						        		Редактировать
						        	</a>
						        </li>
						        <li>
						        	<a data-id="${id}" class="dropdown-item lnk-download" href="#">
						        		<i class="bi bi-download"></i>&nbsp;
						        		Скачать
						        	</a>
						        </li>
						        <li>
						        	<a data-id="${id}" class="dropdown-item lnk-remove" href="#">
						        		<i class="bi bi-trash"></i>&nbsp;
						        		Удалить
						        	</a>
						        </li>
						      </ul>
							</div>
						</div>
					</li>`;

				let parser = new DOMParser();
				let doc = parser.parseFromString(html, "text/html");
				let li = doc.querySelector("li");

				let a = li.querySelector(".sidebar-item");
				a.addEventListener("click", function (e) {
					clearActiveLink();
					this.classList.add("active");
					DictionaryStorage.hidePleaseSelectDictionary();
					let dId = this.dataset.id;
					DictionaryStorage.setActiveDictionary(dId);

					let errorsIndicator = new ErrorsIndicator(dId);

					let indicator = new Indicator({
						dictionaryId: dId,
						errorsIndicator: errorsIndicator
					});

					indicator.printIndicator();
					let cardMaker = new CardMaker({
						dictionaryId: dId,
						questionIndex: 0,
						answerIndex: 1,
						sentenceExampleIndex: 2,
						sentenceTranslationIndex: 3,
						indicator: indicator,
						errorsIndicator: errorsIndicator
					});
				});


				let btn = li.querySelector(".sidebar-btn");
				btn.addEventListener("click", function (e) {
					e.stopPropagation();
					a.classList.add("btn_click_active");
				});

				bootstrap.Dropdown.getOrCreateInstance(btn, {
				  popperConfig: { strategy: 'fixed' }
				});

				let lnkRename = li.querySelector(".lnk-rename");
				lnkRename.addEventListener("click", function (e) {
					e.preventDefault();
					e.stopPropagation();
					let id = this.dataset.id;
					let oldName = this.parentElement
									.parentElement
									.parentElement
									.parentElement
									.querySelector(".a-text").innerText;

					showRenameDictionaryModal(id, oldName);
				});

				let lnkEdit = li.querySelector(".lnk-edit");
				lnkEdit.addEventListener("click", function (e) {
					e.preventDefault();
					e.stopPropagation();
					let dropdown = bootstrap.Dropdown.getOrCreateInstance(this.parentElement.parentElement);
					dropdown.hide();
					new DictionaryEditor(this.dataset.id, dictionarySavedHandler);
				});

				let lnkDownload = li.querySelector(".lnk-download");
				lnkDownload.addEventListener("click", function (e) {
					e.preventDefault();
					e.stopPropagation();

					let data = downloadDictionary (this.dataset.id);
					console.log(data);
				});

				li.querySelector(".lnk-remove").addEventListener("click", function (e) {
					e.preventDefault();
					e.stopPropagation();
					showRemoveDictionaryModal(this.dataset.id);
				});

				return li;
			}

			function clearActiveLink () {
				Array.from(document.querySelectorAll(".sidebar-item")).forEach(function (item) {
					item.classList.remove("active");
				});
			}

			function saveDictionary (id, dictionary) {
				try {
					localStorage.setItem(id, JSON.stringify(dictionary));
				} catch (e) {
					if (e.name === 'QuotaExceededError') {
						alert("Failed to save data to local storage, data storage size exceeded");
					}
				}
			}

			function showRenameDictionaryModal (id, oldName) {

				alertRename.querySelector(".dictionary-name").value = oldName;
				alertRename.querySelector(".dictionary-id").value = id;

				const modalEl = document.getElementById('renameDictionary');
				const modal = new bootstrap.Modal(modalEl);
				modal.show();
			}

			function showRemoveDictionaryModal (id) {
				alertRemove.querySelector(".dictionary-id").value = id;

				const modalEl = document.getElementById('myModal');
				const modal = new bootstrap.Modal(alertRemove);
				modal.show();
			}

			function dictionarySavedHandler (dictionaryId) {
				Indicator.removeIndicator(dictionaryId);
				ErrorsIndicator.removeErrorsIndicator(dictionaryId);

				if (dictionaryId === DictionaryStorage.getActiveDictionary()) {
					DictionaryStorage.initActiveDictionary();
				}
			}

			function hideModal (modal) {
				bootstrap.Modal.getOrCreateInstance(modal).hide();
			}
		}

		// static
		DictionaryStorage.showPleaseSelectDictionary = function () {
			document.querySelector(".app-section").classList.add("d-none");
			document.querySelector(".dictionary-preview").classList.remove("d-none");
		}

		DictionaryStorage.hidePleaseSelectDictionary = function () {
			document.querySelector(".app-section").classList.remove("d-none");
			document.querySelector(".dictionary-preview").classList.add("d-none");
		}

		DictionaryStorage.removeDictionary = function (dictionaryId) {
			localStorage.removeItem(dictionaryId);
		}

		DictionaryStorage.setActiveDictionary = function (dictionaryId) {
			if (dictionaryId) {
				localStorage.setItem(activeKey, dictionaryId);	
			} else {
				localStorage.removeItem(activeKey);
			}
		}

		DictionaryStorage.getActiveDictionary = function () {
			return localStorage.getItem(activeKey);
		}

		DictionaryStorage.initActiveDictionary = function () {
			let id = DictionaryStorage.getActiveDictionary();
			if (id) {
					DictionaryStorage.hidePleaseSelectDictionary();
					let errorsIndicator = new ErrorsIndicator(id);
					indicator = new Indicator({
						dictionaryId: id,
						errorsIndicator: errorsIndicator
					});

					indicator.printIndicator();
					let cardMaker = new CardMaker({
						dictionaryId: id,
						questionIndex: 0,
						answerIndex: 1,
						sentenceExampleIndex: 2,
						sentenceTranslationIndex: 3,
						indicator: indicator,
						errorsIndicator: errorsIndicator
					});
			}
		}

		DictionaryStorage.printLocalStorageSizeUsed = function () {
			let size = getLocalStorageSize();
			document.getElementById("storage_used").innerText = size;

			function getLocalStorageSize() {
			  let total = 0;
			  for (let key in localStorage) {
			    if (localStorage.hasOwnProperty(key)) {
			      let value = localStorage.getItem(key);
			      if (value) {
			      	total += key.length + value.length;
			      }
			    }
			  }
			  return (total / (1024 * 1024)).toFixed(2);
			}
		}

		DictionaryStorage.initLocalStorageHooks = function () {
			  const originalSetItem = localStorage.setItem;
			  const originalRemoveItem = localStorage.removeItem;
			  const originalClear = localStorage.clear;

			  localStorage.setItem = function () {
			    originalSetItem.apply(this, arguments);
			    DictionaryStorage.printLocalStorageSizeUsed();
			  };

			  localStorage.removeItem = function () {
			    originalRemoveItem.apply(this, arguments);
			    DictionaryStorage.printLocalStorageSizeUsed();
			  };

			  localStorage.clear = function () {
			    originalClear.apply(this, arguments);
			    DictionaryStorage.printLocalStorageSizeUsed();
			  };
		}

		DictionaryStorage.generateDictionaryId = function () {
			return 'id-' + Date.now().toString(36) + '-' + Math.random().toString(36).substr(2, 5);	
		}