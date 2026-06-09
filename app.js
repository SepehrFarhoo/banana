

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";

import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithRedirect,

  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/12.14.0/firebase-auth.js";
console.log("APP STARTED");


const firebaseConfig = {
  apiKey: "AIzaSyCX-0tvD8yl0SCNZ7gwPk88d9vg1DJEt90",
  authDomain: "banana-calorie-tracker.firebaseapp.com",
  projectId: "banana-calorie-tracker",
  storageBucket: "banana-calorie-tracker.firebasestorage.app",
  messagingSenderId: "1057838315587",
  appId: "1:1057838315587:web:0e712d0fa0663fa4ff7cf6"
};

const app = initializeApp(firebaseConfig);

console.log("FIREBASE OK");

const db = getFirestore(app);

const auth = getAuth(app);
auth.useDeviceLanguage();
let currentUid = null;

const provider = new GoogleAuthProvider();



async function login() {
  try {
    await signInWithRedirect(auth, provider);
  } catch (error) {
    console.log(error);
  }
}

async function logout() {
  await signOut(auth);
localStorage.clear();
  daily = {
    date: "",
    entries: [],
  };

  customFoods = {};
  customExercises = {};
  weightHistory = [];

  foods = { ...defaultFoods };
  exercises = { ...defaultExercises };
selectedFood = null;
  updateUI();
  renderCustomFoods();
  renderCustomExercises();
  renderWeightChart();
  loadExercises();

 
}

onAuthStateChanged(auth, async (user) => {
  if (user) {
    currentUid = user.uid;
document.getElementById("loginOverlay") = "none";
    console.log("LOGGED IN:", user.email);

    authArea.innerHTML = `
      <span style="margin-right:10px;">
        Logged in as ${user.email}
      </span>

      <button onclick="logout()" class="danger">
        Logout
      </button>
    `;

    await loadCloudData();
  } else {
    currentUid = null;
  document.getElementById("loginOverlay") = "flex";
    console.log("NOT LOGGED IN");

    authArea.innerHTML = `
      <button onclick="login()" class="primary">
        Login
      </button>
    `;
  }
});

/* DARK MODE */

      function applyDarkMode() {
        const dark = localStorage.getItem("darkMode") === "true";
        document.body.classList.toggle("dark", dark);
        updateToggleIcon();
      }

      function toggleDark() {
        const newState = !document.body.classList.contains("dark");
        localStorage.setItem("darkMode", newState);
        applyDarkMode();
      }

      function updateToggleIcon() {
        toggleCircle.textContent = document.body.classList.contains("dark")
          ? "🌙"
          : "☀️";
      }

      /* DATA */

      const defaultFoods = {
        "Egg Boiled": { cal: 80, unit: "1 large" },
        "Egg Fried": { cal: 120, unit: "1 large" },

        Banana: { cal: 130, unit: "1 large" },
        Apple: { cal: 110, unit: "1 large" },
        Orange: { cal: 90, unit: "1 large" },
        Tomato: { cal: 35, unit: "1 large" },

        Latte: { cal: 180, unit: "1 medium" },
        Cortado: { cal: 100, unit: "1 medium" },
        "Black Coffee": { cal: 5, unit: "1 cup" },
        Tea: { cal: 0, unit: "1 cup" },

        "Sugar Cube": { cal: 20, unit: "1 cube" },

        Milk: { cal: 170, unit: "1 glass" },
        Doogh: { cal: 120, unit: "1 glass" },

        "Rice Persian": { cal: 350, unit: "5 tbsp" },
        "Restaurant Rice": { cal: 500, unit: "1 plate" },

        "Sangak Bread": { cal: 100, unit: "1 piece" },
        "Barbari Bread": { cal: 120, unit: "1 piece" },
        "Toast Bread": { cal: 90, unit: "1 slice" },

        Gheyme: { cal: 250, unit: "5 tbsp" },
        "Ghorme Sabzi": { cal: 220, unit: "5 tbsp" },

        "Jooje Kebab": { cal: 420, unit: "1 skewer" },
        Koobideh: { cal: 350, unit: "1 skewer" },

        "Burger Double": { cal: 950, unit: "1 burger" },

        "Chicken Breast": { cal: 350, unit: "1 large" },
        "Chicken Thigh": { cal: 280, unit: "1 large" },

        "Fish Fried": { cal: 450, unit: "half fish" },

        "Pizza Slice": { cal: 450, unit: "1 slice" },

        "French Fries": { cal: 120, unit: "10 fries" },

        Chips: { cal: 250, unit: "1 small bag" },

        Popcorn: { cal: 180, unit: "1 bowl" },
        "Potato Baked": { cal: 250, unit: "1 large" },
        "Ice Cream": { cal: 150, unit: "1 stick" },

        "Dark Chocolate": { cal: 40, unit: "1 piece" },
        "Milk Chocolate": { cal: 50, unit: "1 piece" },

        Dates: { cal: 30, unit: "1 date" },

        Almonds: { cal: 45, unit: "5 large" },
        Pistachios: { cal: 50, unit: "5 large" },
        Walnut: { cal: 55, unit: "1 large" },
        Hazelnuts: { cal: 45, unit: "5 large" },

        "Mixed Nuts": { cal: 220, unit: "1 handful" },

        Oil: { cal: 120, unit: "1 tbsp" },
        "Mayo Tbsp": { cal: 110, unit: "1 tbsp" },
        "Ketchup Tbsp": { cal: 25, unit: "1 tbsp" },

        Omelette: { cal: 300, unit: "2 eggs" },

        "Tuna Can": { cal: 250, unit: "1 can" },

        "Pasta Plate": { cal: 600, unit: "1 plate" },

        "Protein Shake": { cal: 180, unit: "1 shake" },

        "Soda Cup": { cal: 150, unit: "1 cup" },

        "Cheat Meal": { cal: 1200, unit: "1 meal" },
      };

      const defaultExercises = {
        "Walking Treadmill": 5,
        "Running Treadmill": 11,

        "Gym Lifting": 6,

        Basketball: 8,
        Football: 10,

        "Slow Walking": 3,
      };

      let customFoods = JSON.parse(localStorage.getItem("customFoods")) || {};
      let customExercises =
        JSON.parse(localStorage.getItem("customExercises")) || {};

      let foods = { ...defaultFoods, ...customFoods };
      let exercises = { ...defaultExercises, ...customExercises };

      let daily = JSON.parse(localStorage.getItem("daily")) || {
        date: "",
        entries: [],
      };
      let weightHistory =
        JSON.parse(localStorage.getItem("weightHistory")) || [];

      let selectedFood = null;

      /* DATE */

      function tehranDate() {
        return new Date().toLocaleDateString("en-CA", {
          timeZone: "Asia/Tehran",
        });
      }

      function checkReset() {
        if (daily.date !== tehranDate()) {
          daily = { date: tehranDate(), entries: [] };
          saveDaily();
          saveCloudData();
        }
      }

      function saveDaily() {
        localStorage.setItem("daily", JSON.stringify(daily));
      }

      /* SEARCH */

      function searchFood() {
        let q = foodSearch.value.toLowerCase();
        searchResults.innerHTML = "";

        Object.keys(foods)
          .filter((f) => f.toLowerCase().includes(q))
          .forEach((f) => {
            searchResults.innerHTML += `<div class="search-item" onclick="selectFood('${f}')">${f}</div>`;
          });
      }

      function selectFood(name) {
        selectedFood = name;

        foodSearch.value = name;

        searchResults.innerHTML = "";

        foodAmount.placeholder = foods[name].unit;
      }

      /* TARGET */

      function calculateTarget() {
        let info = JSON.parse(localStorage.getItem("userInfo"));
        if (!info) return 0;

        let bmr =
          info.sex === "male"
            ? 10 * info.weight + 6.25 * info.height - 5 * info.age + 5
            : 10 * info.weight + 6.25 * info.height - 5 * info.age - 161;

        let tdee = bmr * info.activity;
        let adjust = (info.goalSpeed * 7700) / 7;

        return info.goalWeight < info.weight
          ? Math.round(tdee - adjust)
          : Math.round(tdee + adjust);
      }

      /* UI */

      function updateUI() {
        checkReset();

        let target = calculateTarget();
        targetCalories.innerText = target;

        let consumed = 0;
        let burned = 0;

        daily.entries.forEach((e) => {
          if (e.type === "food") consumed += e.cal;
          if (e.type === "exercise") burned += e.cal;
        });

        let net = consumed - burned;

        let percent = target ? Math.min((net / target) * 100, 100) : 0;

        progressBar.style.width = percent + "%";
        progressBar.innerText = Math.round(percent) + "%";

        calLeft.innerText = Math.round(target - net);

        entryList.innerHTML = "";

        daily.entries.forEach((e, i) => {
          entryList.innerHTML += `
<div class="entry">
<span>${e.text}</span>
<button onclick="deleteEntry(${i})">x</button>
</div>`;
        });

        loadInfoSummary();
      }

      /* ENTRIES */

      function addFood() {
        let amount = parseFloat(foodAmount.value);
        if (!selectedFood || !amount) return;

        let cal = foods[selectedFood].cal * amount;

        daily.entries.push({
          type: "food",
          cal: cal,
          text: `${selectedFood} +${Math.round(cal)} kcal`,
        });

        saveDaily();
        updateUI();
        saveCloudData();
      }

      function addExercise() {
        let e = exerciseSelect.value;
        let m = parseFloat(exerciseMinutes.value);
        if (!m) return;

        let cal = exercises[e] * m;

        daily.entries.push({
          type: "exercise",
          cal: cal,
          text: `${e} ${m}min -${Math.round(cal)} kcal`,
        });

        saveDaily();
        updateUI();
        saveCloudData();
      }

      function deleteEntry(i) {
        daily.entries.splice(i, 1);
        saveDaily();
        updateUI();
        saveCloudData();
      }

      function resetDay() {
        if (confirm("Reset today?")) {
          daily = { date: tehranDate(), entries: [] };
          saveDaily();
          updateUI();
          saveCloudData();
        }
      }

      /* USER INFO */

      function saveInfo() {
        let info = {
          age: +age.value,
          sex: sex.value,
          height: +height.value,
          weight: +weight.value,
          goalWeight: +goalWeight.value,
          goalSpeed: +goalSpeed.value,
          activity: +activity.value,
          saveCloudData();
        };

        localStorage.setItem("userInfo", JSON.stringify(info));

        updateUI();
      }

      function loadInfoSummary() {
        let info = JSON.parse(localStorage.getItem("userInfo"));

        if (!info) {
          infoSummary.innerText = "No info saved.";
          return;
        }

        infoSummary.innerText = `Age ${info.age} • ${info.weight}kg → ${info.goalWeight}kg`;

        age.value = info.age;
        height.value = info.height;
        weight.value = info.weight;
        goalWeight.value = info.goalWeight;
        goalSpeed.value = info.goalSpeed;
        sex.value = info.sex;
        activity.value = info.activity;
      }

      /* CUSTOM FOODS */

      function addCustomFood() {
        let name = customFoodName.value;
        let cal = parseFloat(customFoodCalories.value);
        let unit = customFoodUnit.value;

        if (!name || !cal || !unit) return;

        customFoods[name] = { cal, unit };

        localStorage.setItem("customFoods", JSON.stringify(customFoods));

        foods = { ...defaultFoods, ...customFoods };

        renderCustomFoods();
        saveCloudData();
      }

      function deleteCustomFood(name) {
        delete customFoods[name];

        localStorage.setItem("customFoods", JSON.stringify(customFoods));

        foods = { ...defaultFoods, ...customFoods };

        renderCustomFoods();
        saveCloudData();
      }

      function renderCustomFoods() {
        customFoodList.innerHTML = "";

        Object.keys(customFoods).forEach((name) => {
          customFoodList.innerHTML += `
<div class="entry">
<span>${name}</span>
<button onclick="deleteCustomFood('${name}')">x</button>
</div>`;
        });
      }

      /* CUSTOM EXERCISES */

      function addCustomExercise() {
        let name = customExerciseName.value;
        let cal = parseFloat(customExerciseCalories.value);

        if (!name || !cal) return;

        customExercises[name] = cal;

        localStorage.setItem(
          "customExercises",
          JSON.stringify(customExercises),
        );

        exercises = { ...defaultExercises, ...customExercises };

        loadExercises();
        renderCustomExercises();
        saveCloudData();
      }

      function deleteCustomExercise(name) {
        delete customExercises[name];

        localStorage.setItem(
          "customExercises",
          JSON.stringify(customExercises),
        );

        exercises = { ...defaultExercises, ...customExercises };

        loadExercises();
        renderCustomExercises();
        saveCloudData();
      }

      function renderCustomExercises() {
        customExerciseList.innerHTML = "";

        Object.keys(customExercises).forEach((name) => {
          customExerciseList.innerHTML += `
<div class="entry">
<span>${name}</span>
<button onclick="deleteCustomExercise('${name}')">x</button>
</div>`;
        });
      }

      function loadExercises() {
        exerciseSelect.innerHTML = "";

        Object.keys(exercises).forEach((e) => {
          exerciseSelect.innerHTML += `<option>${e}</option>`;
        });
      }

      /* NAV */

      function switchTab(tab, e) {
        entriesTab.style.display = tab === "entries" ? "block" : "none";
        infoTab.style.display = tab === "info" ? "block" : "none";

        document
          .querySelectorAll(".tab")
          .forEach((t) => t.classList.remove("active"));

        e.target.classList.add("active");
      }

      let weightChart;

function saveWeight() {
  let weight = parseFloat(weightInput.value);

  if (!weight) return;

  weightHistory.push({
    date: new Date().toLocaleDateString("en-CA"),
    weight: weight,
  });

  localStorage.setItem(
    "weightHistory",
    JSON.stringify(weightHistory)
  );

  renderWeightChart();
  saveCloudData();

  weightInput.value = "";
}

function undoWeight() {
  if (weightHistory.length === 0) return;

  weightHistory.pop();

  localStorage.setItem(
    "weightHistory",
    JSON.stringify(weightHistory)
  );

  renderWeightChart();
  saveCloudData();
}

function resetWeights() {
  if (!confirm("Delete all weight history?")) return;

  weightHistory = [];

  localStorage.setItem(
    "weightHistory",
    JSON.stringify(weightHistory)
  );

  renderWeightChart();
  saveCloudData();
}

function renderWeightChart() {
  const ctx = document.getElementById("weightChart");

  if (!ctx) return;

  const labels = weightHistory.map((w) => w.date);

  const data = weightHistory.map((w) => w.weight);

  if (weightChart) {
    weightChart.destroy();
  }

  weightChart = new Chart(ctx, {
    type: "line",

    data: {
      labels: labels,

      datasets: [
        {
          label: "Weight (kg)",
          data: data,
          tension: 0.3,
        },
      ],
    },

    options: {
      responsive: true,

      plugins: {
        legend: {
          display: true,
        },
      },

      scales: {
        y: {
          beginAtZero: false,
        },
      },
    },
  });
}

      /* INIT */

      applyDarkMode();
     async function saveCloudData() {
  if (!currentUid) return;

  const data = {
    daily,
    customFoods,
    customExercises,
    weightHistory,
    userInfo: JSON.parse(localStorage.getItem("userInfo")),
};

  await setDoc(doc(db, "users", currentUid), data);

  console.log("Cloud saved");
}

async function loadCloudData() {
  const ref = doc(db, "users", currentUid);

  const snap = await getDoc(ref);

  if (!snap.exists()) return;

  const data = snap.data();

  if (data.daily) daily = data.daily;

  if (data.customFoods) customFoods = data.customFoods;

  if (data.customExercises)
    customExercises = data.customExercises;

  if (data.weightHistory)
    weightHistory = data.weightHistory;
  if (data.userInfo)
    localStorage.setItem(
        "userInfo",
        JSON.stringify(data.userInfo)
    );
  foods = { ...defaultFoods, ...customFoods };

  exercises = {
    ...defaultExercises,
    ...customExercises,
  };

 updateUI();
renderCustomFoods();
renderCustomExercises();
renderWeightChart();
loadExercises();
loadInfoSummary();

  console.log("Cloud loaded");
}
      loadInfoSummary();
      updateUI();

  renderCustomFoods();

  renderCustomExercises();

  renderWeightChart();

  loadExercises();

      window.toggleDark = toggleDark;
window.switchTab = switchTab;
window.searchFood = searchFood;
window.addFood = addFood;
window.addExercise = addExercise;
window.resetDay = resetDay;
window.saveInfo = saveInfo;
window.saveWeight = saveWeight;
window.undoWeight = undoWeight;
window.resetWeights = resetWeights;
window.addCustomFood = addCustomFood;
window.addCustomExercise = addCustomExercise;
window.deleteCustomFood = deleteCustomFood;
window.deleteCustomExercise = deleteCustomExercise;
window.deleteEntry = deleteEntry;
window.selectFood = selectFood;
window.login = login;
window.logout = logout;
