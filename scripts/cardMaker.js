		function CardMaker ({
			dictionaryId,
			questionIndex,
			answerIndex,
			sentenceExampleIndex,
			sentenceTranslationIndex,
			indicator,
			errorsIndicator
		}) {
			let dictionary = getDictionary();
			let dictionaryKeys = Object.keys(dictionary[0]);

			let questionColumn = dictionaryKeys[questionIndex];
			let answerColumn = dictionaryKeys[answerIndex];
			let sentenceExampleColumn = dictionaryKeys[sentenceExampleIndex];
			let sentenceTranslationColumn = dictionaryKeys[sentenceTranslationIndex];

			createNavigation();
			document.getElementById("show-hint").addEventListener("click", function () {
				let current = indicator.getIndicatorData().current;
				let hint = dictionary[current][sentenceExampleColumn];

				let hintModal = document.getElementById("hintModal");
				hintModal.querySelector(".hint-text").innerText = hint;
				
				const modal = new bootstrap.Modal(hintModal);
				modal.show();
			});

			errorsIndicator.setCurrentWord(indicator.getIndicatorData().current);
			setCard(indicator.getIndicatorData().current);

			function nextHandler () {
				indicator.incrementCurrent();
				errorsIndicator.reviewVisualizer();
				errorsIndicator.setCurrentWord(indicator.getIndicatorData().current);
				setCard(indicator.getIndicatorData().current);
			}

			function prevHandler () {
				indicator.decrementCurrent();
				errorsIndicator.reviewVisualizer();
				errorsIndicator.setCurrentWord(indicator.getIndicatorData().current);
				setCard(indicator.getIndicatorData().current);
			}

			function setCard (current) {
				let answers = generateAnswers(current);
				document.querySelector(".app-title .txt").innerText = dictionary[answers.answerIndex][questionColumn];
				document.querySelector(".app-title").dataset.id = current;
				printAnswers();

				answers.answers.forEach(function (item, index) {
					let btn = document.getElementById(`btn_${index + 1}`);
					btn.dataset.id = item;
					btn.classList.add(`answer-index-${item}`);
					btn.addEventListener("click", function () {
						let answer = +this.dataset.id;
						checkAnswer(answers.answerIndex, answer);
					});
					btn.innerText = dictionary[item][answerColumn];
				});
			}

			function checkAnswer(answerIndex, answer) {
				removeAnswerBtnClasses();

				let current = indicator.getIndicatorData().current;
				let btn_answer_index = document.querySelector(`.answer-index-${answerIndex}`);
				let btn_answer = document.querySelector(`.answer-index-${answer}`);

				if (answerIndex === answer) {
					errorsIndicator.indicate(current, true);
					btn_answer_index.classList.remove("btn-light");
					btn_answer_index.classList.add("btn-success");
				} else {
					btn_answer_index.classList.remove("btn-light");
					btn_answer_index.classList.add("btn-success");
					btn_answer.classList.remove("btn-light");
					btn_answer.classList.add("btn-danger");
					errorsIndicator.indicate(current, false);
				}
			}

			function removeAnswerBtnClasses () {
				Array.from(document.querySelectorAll(".btn-wrapper button")).forEach(function (item) {
					item.classList.remove("btn-success");
					item.classList.remove("btn-danger");
					item.classList.add("btn-light");
				});
			}

			function printAnswers () {
				let target = document.getElementById("app_variants");
				target.innerHTML = "";
				let parser = new DOMParser();
				let doc = parser.parseFromString(answerBtnsHtml, "text/html");
				Array.from(doc.querySelectorAll(".row")).forEach(row => target.appendChild(row));
			}

			function generateAnswers (answerIndex) {
				let exclude = [];
				let generated = [];
				exclude.push(answerIndex);

				for (let i = 0; i < 4; i++) {
					let gen = getRandomIntExcluding(dictionary.length, exclude);
					generated.push(gen);
					exclude.push(gen);
				}

				let currentIndex = getRandomIntExcluding(4, []);
				generated[currentIndex] = answerIndex;

				return {
					answerIndex: answerIndex,
					answers: generated
				}

				function getRandomIntExcluding(max, exclude = []) {
				    if (max <= 0) {
				        throw new Error("max должно быть больше 0");
				    }

				    // Генерируем массив всех возможных чисел
				    let possible = [];
				    for (let i = 0; i < max; i++) {
				        if (!exclude.includes(i)) {
				            possible.push(i);
				        }
				    }

				    if (possible.length === 0) {
				        throw new Error("Нет доступных чисел для генерации");
				    }

				    // Выбираем случайное число из оставшихся
				    const randomIndex = Math.floor(Math.random() * possible.length);
				    return possible[randomIndex];
				}
			}

			function getDictionary () {
				let data = localStorage.getItem(dictionaryId);
				if (data === null) {
					return null;
				} else {
					return JSON.parse(data);
				}
			}

			function createNavigation () {
				let prevNavPlace = document.getElementById("prev_nav");
				let nextNavPlace = document.getElementById("next_nav");

				// clear old button
				prevNavPlace.innerHTML = "";
				nextNavPlace.innerHTML = "";

				// next button
				let nextBtn = createNavigationButton(
					"next_btn",
					["btn", "btn-large", "bg-transparent", "next-btn"],
					["bi", "bi-arrow-right-circle"],
					nextHandler);
				nextNavPlace.appendChild(nextBtn);

				// prev button
				let prevBtn = createNavigationButton(
					"prev_btn",
					["btn", "btn-large", "bg-transparent", "prev-btn"],
					["bi", "bi-arrow-left-circle"],
					prevHandler);

				prevNavPlace.appendChild(prevBtn);
			}

			function createNavigationButton (id, btnClasses, iClasses, handler) {
				let button = document.createElement("button");
				button.id = id;
				button.type = "button";
				if (btnClasses && btnClasses.length > 0) {
					button.classList.add(...btnClasses);	
				}

				let i = document.createElement("i");
				if (iClasses && iClasses.length > 0) {
					i.classList.add(...iClasses);
				}
				button.appendChild(i);
				button.addEventListener("click", handler);

				return button;
			}
		}