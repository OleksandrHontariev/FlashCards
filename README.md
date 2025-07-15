
# FlashCards

**FlashCards** is a lightweight and intuitive web application for learning foreign languages by memorizing words effectively. Designed for learners of all levels, FlashCards allows users to upload their own vocabulary lists from Excel files and start practicing immediately—no installation or downloads required.  

🌍 The app is fully multilingual and currently supports English (default), French, German, Spanish, Ukrainian, and potentially Russian (TBD).  

---

## 🌟 Features

- 🚀 **No installation needed** – works directly in your browser.  
- 📂 **Excel integration** – upload your vocabulary as an Excel file (.xlsx) and start learning instantly.  
- 🌐 **Multilingual interface** – English, French, German, Spanish, Ukrainian (more languages planned).  
- 📖 **Learning mode**:
  - Choose a word from your vocabulary list.
  - Answer multiple-choice questions with **4 options** (1 correct + 3 distractors).
  - Correct answers highlight green ✅; incorrect ones highlight red ❌.
  - Words answered incorrectly are marked for extra practice.
  - Words require **3 consecutive correct answers** to be marked as “learned.”
- 📊 **Progress indicator** – track learned and unlearned words.  
- 📁 **Vocabulary management**:
  - Rename, download (as Excel), edit, or delete vocabulary lists.
  - Stored locally in your browser’s `localStorage`.
- 💾 **Fully client-side** – no server or database; all data stays on your device.  

---

## 📦 How It Works

1. Visit the website (no need to clone or install).  
2. Click **Add Vocabulary** to upload your Excel file.  
3. The app parses your Excel file and saves the vocabulary in `localStorage`.  
4. Select your vocabulary list from the sidebar to start learning.  
5. Practice words with multiple-choice questions and track your progress.  

---

## 📌 Limitations

- Since all data is stored in `localStorage`, vocabularies are **device-specific**.  
  (e.g., a vocabulary added on mobile won’t appear on desktop.)  
- No cloud sync (planned as a future premium feature).  

---

## 🚧 Roadmap

- 🌐 Add more language translations.  
- ☁️ Cross-device synchronization (cloud storage for vocabularies).  
- 📱 Mobile-friendly enhancements.  
- 🏆 Premium features like spaced repetition and advanced statistics.  

---

## 🛠️ Tech Stack

- **Frontend**: Bootstrap 5.3, native JavaScript  
- **Storage**: Browser `localStorage`  
- **Hosting**: Static site (no server-side code)  

---

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## 👤 Author

Created by [Oleksandr Hontariev](https://github.com/OleksandrHontariev)
