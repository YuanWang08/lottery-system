<script setup lang="ts">
import { ref } from "vue";
// import InputBox from "../components/InputBox.vue";

const student_number = ref("");
const department = ref("");
const grade = ref("");
const name = ref("");
const isFackbook = ref(false);
const isInstagram = ref(false);
const isDiscord = ref(false);
const facebook_id = ref("");
const instagram_id = ref("");
const discord_id = ref("");
</script>

<template>
  <main>
    <h1>抽獎表單</h1>
    <form>
      <label for="student_number">學號</label>
      <input type="text" id="student_number" v-model="student_number" />
      <label for="department">系所</label>
      <input type="text" id="department" v-model="department" />
      <label for="grade">年級</label>
      <input type="text" id="grade" v-model="grade" />
      <label for="name">姓名</label>
      <input type="text" id="name" v-model="name" />

      <button type="submit">送出</button>
    </form>
  </main>
</template>
