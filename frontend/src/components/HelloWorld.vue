<script setup lang="ts">
defineProps<{
  msg: string
}>()
</script>

<template>
  <div class="greetings">
    <h1 class="redTheme">{{ msg }}</h1>
    <h3>
      期初社大抽獎系統
    </h3>
    <p class="content">規則：填寫表單就會有一張抽獎券，若有追縱證券研究社的FB、IG與加入DC都可再獲得一張抽獎券，每個學號只能填寫一次</p>
  </div>
</template>

<style scoped>
.content {
  text-align: start;
  margin-top: 1rem;
}

.redTheme {
  color: #FF2D2D;
}

h1 {
  font-weight: 500;
  font-size: 2.6rem;
  position: relative;
  top: -10px;
}

h3 {
  font-size: 1.2rem;
}

.greetings h1,
.greetings h3 {
  text-align: center;
}

@media (min-width: 1024px) {
  .greetings h1,
  .greetings h3 {
    text-align: left;
  }
}
</style>
