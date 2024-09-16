<template>
  <div class="raffle-container">
    <div v-if="!submitted" class="form-card">
      <h1>抽獎表單</h1>
      <form @submit.prevent="validateAndSubmit">
        <div v-for="field in requiredFields" :key="field.name" class="form-group">
          <label :for="field.name">{{ field.label }} <span class="required">*</span></label>
          <input 
            v-model="formData[field.name]" 
            :type="field.type" 
            :id="field.name" 
            :name="field.name"
            required
            @blur="validateField(field.name)"
          >
          <span v-if="fieldErrors[field.name]" class="error-message">{{ fieldErrors[field.name] }}</span>
        </div>

        <div v-for="social in socialFields" :key="social.name" class="form-group">
          <div class="checkbox-group">
            <input v-model="formData[social.isName]" type="checkbox" :id="social.isName" :name="social.isName">
            <label :for="social.isName">是否有追蹤證研{{ social.label }}</label>
          </div>
          <div v-if="formData[social.isName]" class="social-id-input">
            <label :for="social.idName">你的{{ social.label }} ID</label>
            <input v-model="formData[social.idName]" type="text" :id="social.idName" :name="social.idName">
          </div>
        </div>

        <button type="submit" :disabled="!isFormValid">提交</button>
      </form>
    </div>
    
    <div v-else class="result-card">
      <h1>抽獎結果</h1>
      <div class="result-item">
        <label>學號：</label>
        <span class="result-value">{{ submissionResult.student_number }}</span>
      </div>
      <div class="lottery-numbers">
        <h2>抽獎序號：</h2>
        <ul>
          <li v-for="(lottery, index) in submissionResult.lotteries" :key="index">
            {{ lottery }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed } from 'vue';

const requiredFields = [
  { name: 'student_number', label: '學號', type: 'text' },
  { name: 'department', label: '系所', type: 'text' },
  { name: 'grade', label: '年級', type: 'text' },
  { name: 'name', label: '姓名', type: 'text' },
];

const socialFields = [
  { name: 'facebook', label: 'Facebook', isName: 'isFacebook', idName: 'facebook_id' },
  { name: 'instagram', label: 'Instagram', isName: 'isInstagram', idName: 'instagram_id' },
  { name: 'discord', label: 'Discord', isName: 'isDiscord', idName: 'discord_id' },
];

const formData = reactive({
  student_number: '',
  department: '',
  grade: '',
  name: '',
  isFacebook: false,
  isInstagram: false,
  isDiscord: false,
  facebook_id: '',
  instagram_id: '',
  discord_id: '',
});

const fieldErrors = reactive({});
const submitted = ref(false);
const submissionResult = ref(null);

const validateField = (fieldName) => {
  if (!formData[fieldName].trim()) {
    fieldErrors[fieldName] = `${requiredFields.find(f => f.name === fieldName).label}是必填的`;
  } else {
    fieldErrors[fieldName] = '';
  }
};

const isFormValid = computed(() => {
  return requiredFields.every(field => formData[field.name].trim() !== '') &&
         Object.values(fieldErrors).every(error => error === '');
});

const validateAndSubmit = async () => {
  requiredFields.forEach(field => validateField(field.name));
  
  if (!isFormValid.value) {
    alert('請填寫所有必填欄位');
    return;
  }

  if (confirm('您確定要提交嗎？請注意，每個學號只能提交一次。')) {
    await submitForm();
  }
};

const submitForm = async () => {
  try {
    const response = await fetch("http://localhost:3000/sheet", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    if (response.status === 400) {
      alert("該學號已註冊過。");
      return;
    }
    const data = await response.json();
    console.log("Form submitted successfully:", data);
    submissionResult.value = data;
    submitted.value = true;
  } catch (error) {
    console.error("Error submitting form:", error);
    alert("表單提交失敗，請稍後再試。");
  }
};
</script>

<style scoped>
.raffle-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 12px;
}

.form-card{
  background-color: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

h1 {
  text-align: center;
  color: #333;
  margin-bottom: 20px;
}

h2 {
  color: #444;
  margin-top: 20px;
  margin-bottom: 10px;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  color: #555;
}

input[type="text"] {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.checkbox-group {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.checkbox-group input[type="checkbox"] {
  margin-right: 10px;
}

.social-id-input {
  margin-top: 10px;
  margin-left: 25px;
}

button {
  width: 100%;
  padding: 10px;
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
  font-size: 12px;
  margin-top: 5px;
  display: block;
}

.lottery-numbers ul {
  list-style-type: none;
  padding: 0;
}

.lottery-numbers li {
  background-color: #f0f0f0;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 4px;
  font-family: monospace;
  font-size: 16px;
}

.result-card {
  background-color: #f8f9fa;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  border: 1px solid #e9ecef;
}

.result-card h1 {
  color: #495057;
  margin-bottom: 30px;
  font-size: 24px;
  border-bottom: 2px solid #4a90e2;
  padding-bottom: 10px;
}

.result-item {
  margin-bottom: 20px;
  background-color: white;
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

.lottery-numbers h2 {
  color: #495057;
  margin-top: 30px;
  margin-bottom: 15px;
  font-size: 20px;
}

.lottery-numbers ul {
  list-style-type: none;
  padding: 0;
}

.lottery-numbers li {
  background-color: white;
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