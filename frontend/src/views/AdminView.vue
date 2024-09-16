<template>
  <div class="admin-container">
    <div v-if="!isLoggedIn" class="admin-card">
      <h1>管理員登入</h1>
      <form @submit.prevent="login" class="admin-form">
        <div class="form-group">
          <label for="password">密碼 <span class="required">*</span></label>
          <input 
            v-model="password"
            type="password"
            id="password"
            name="password"
            required
            @blur="validatePassword"
          >
          <span v-if="error" class="error-message">{{ error }}</span>
        </div>
        <button type="submit" :disabled="!isValid">登入</button>
      </form>
    </div>

    <div v-else class="interface-card">
      <h1>抽獎系統</h1>
      <div class="stats">
        <p>目前參與人數：{{ participantCount }}</p>
        <p>目前抽獎券數：{{ lotteryCount }}</p>
      </div>
      <div class="lottery-settings">
        <p>抽獎數設定</p>
        <input v-model="lotteryNumber" type="number" min="1" />
      </div>
      <button @click="startLottery">開始抽獎</button>
      <div class="all-lotteries">
        <h2>目前抽獎序號</h2>
        <ul>
          <li v-for="(lottery, index) in allLotteries" :key="index">
            {{ lottery }}
          </li>
        </ul>
      </div>
      <div v-if="lotteryResults.length" class="lottery-results">
        <h2>抽獎結果</h2>
        <ul>
          <li v-for="(result, index) in lotteryResults" :key="index">
            {{ result }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';

const password = ref('');
const participantCount = ref(0);
const lotteryCount = ref(0);
const lotteryNumber = ref(1);
const allLotteries = ref([]);
const lotteryResults = ref([]);
const error = ref('');
const isLoggedIn = ref(false);
const token = ref('');
let fetchInterval = null;

const isValid = computed(() => {
  return password.value.trim() !== '' && error.value === '';
});

const validatePassword = () => {
  if (password.value.trim() === '') {
    error.value = '密碼不能為空';
  } else {
    error.value = '';
  }
};

const login = async () => {
  try {
    const response = await fetch('https://lottery-system.onrender.com/admin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ password: password.value }),
    });

    if (!response.ok) {
      throw new Error('登入失敗');
    }

    const data = await response.json();
    token.value = data.token;
    isLoggedIn.value = true;
    error.value = '';
    await fetchLotteries();
    startFetchInterval();
  } catch (err) {
    console.error('Error logging in:', err);
    error.value = '登入失敗，請稍後再試';
  }
};

const fetchLotteries = async () => {
  try {
    const response = await fetch('https://lottery-system.onrender.com/lottery', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token.value}`,
      },
    });

    if (!response.ok) {
      throw new Error('查詢失敗');
    }

    const data = await response.json();
    participantCount.value = data.lotteries.length;
    lotteryCount.value = data.lotteries.length;
    allLotteries.value = data.lotteries;
    console.log('Fetched lotteries:', allLotteries.value);
  } catch (err) {
    console.error('Error fetching lotteries:', err);
    error.value = '查詢失敗，請稍後再試';
  }
};

const startLottery = () => {
  const results = [];
  for (let i = 0; i < lotteryNumber.value; i++) {
    const randomIndex = Math.floor(Math.random() * allLotteries.value.length);
    results.push(allLotteries.value[randomIndex]);
    allLotteries.value.splice(randomIndex, 1);
  }
  lotteryResults.value = results;
};

const startFetchInterval = () => {
  fetchInterval = setInterval(fetchLotteries, 30000);
};

onMounted(() => {
  if (isLoggedIn.value) {
    startFetchInterval();
  }
});

onUnmounted(() => {
  if (fetchInterval) {
    clearInterval(fetchInterval);
  }
});
</script>

<style scoped>
.admin-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px;
}

.admin-card, .interface-card {
  background-color: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  margin-bottom: 20px;
}

.interface-card {
  width: 90%;
  max-width: none;
  height: 90vh;
  overflow-y: auto;
}

h1, h2 {
  text-align: center;
  color: #000000;
  margin-bottom: 20px;
  font-size: 24px;
  border-bottom: 2px solid #4a90e2;
  padding-bottom: 10px;
}

h3 {
  color: #000000;
  margin-top: 20px;
  margin-bottom: 10px;
  font-size: 18px;
}

p {
  color: #000000;
  font-size: 16px;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  color: #555;
  font-weight: bold;
}

input[type="text"], input[type="password"], input[type="number"] {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

button {
  width: 100%;
  padding: 12px;
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #357abd;
}

button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.required {
  color: red;
}

.error-message {
  color: red;
  font-size: 14px;
  margin-top: 5px;
  display: block;
}

.all-lotteries {
  padding-top: 12px;
}

.stats, .lottery-settings, .lottery-results, .all-lotteries {
  margin-bottom: 20px;
}

.all-lotteries ul, .lottery-results ul {
  list-style-type: none;
  padding: 0;
}

.all-lotteries li, .lottery-results li {
  background-color: #f8f9fa;
  padding: 12px 15px;
  margin-bottom: 10px;
  border-radius: 6px;
  font-family: monospace;
  font-size: 16px;
  color: #4a90e2;
  font-weight: bold;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  border: 1px solid #e9ecef;
}
</style>