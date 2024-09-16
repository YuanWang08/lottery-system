<template>
  <div class="search-container">
    <div class="search-card">
      <h1>抽獎序號查詢</h1>
      <form @submit.prevent="searchLotteries" class="search-form">
        <div class="form-group">
          <label for="student_number">學號 <span class="required">*</span></label>
          <input 
            v-model="studentNumber"
            type="text"
            id="student_number"
            name="student_number"
            required
            @blur="validateStudentNumber"
          >
          <span v-if="error" class="error-message">{{ error }}</span>
        </div>
        <button type="submit" :disabled="!isValid">查詢</button>
      </form>
    </div>

    <div v-if="searchResult" class="result-card">
      <h2>查詢結果</h2>
      <div class="result-item">
        <label>學號：</label>
        <span class="result-value">{{ studentNumber }}</span>
      </div>
      <div class="lottery-numbers">
        <h3>抽獎序號：</h3>
        <ul>
          <li v-for="(lottery, index) in searchResult.lotteries" :key="index">
            {{ lottery }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const studentNumber = ref('');
const error = ref('');
const searchResult = ref(null);

const validateStudentNumber = () => {
  if (!studentNumber.value.trim()) {
    error.value = '請輸入學號';
  } else {
    error.value = '';
  }
};

const isValid = computed(() => {
  return studentNumber.value.trim() !== '' && error.value === '';
});

const searchLotteries = async () => {
  if (!isValid.value) return;

  try {
    const response = await fetch('https://lottery-system.onrender.com/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ student_number: studentNumber.value }),
    });

    if (!response.ok) {
      throw new Error('查詢失敗');
    }

    const data = await response.json();
    searchResult.value = data;
  } catch (err) {
    console.error('Error searching lotteries:', err);
    error.value = '查詢失敗，請稍後再試';
    searchResult.value = null;
  }
};
</script>

<style scoped>
.search-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px;
}

.search-card, .result-card {
  background-color: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  margin-bottom: 20px;
}

h1, h2 {
  text-align: center;
  color: #495057;
  margin-bottom: 20px;
  font-size: 24px;
  border-bottom: 2px solid #4a90e2;
  padding-bottom: 10px;
}

h3 {
  color: #495057;
  margin-top: 20px;
  margin-bottom: 10px;
  font-size: 18px;
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

input[type="text"] {
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

.result-item {
  margin-bottom: 20px;
  background-color: #f8f9fa;
  padding: 15px;
  border-radius: 6px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.result-item label {
  font-weight: bold;
  color: #495057;
  display: block;
  margin-bottom: 5px;
}

.result-value {
  font-size: 18px;
  color: #4a90e2;
  font-weight: bold;
}

.lottery-numbers ul {
  list-style-type: none;
  padding: 0;
}

.lottery-numbers li {
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