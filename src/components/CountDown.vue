<template>
    <div class="count-down">
        <h1>Count through setInterval：{{ countInterval }}</h1>
        <button @click="stopInterval">Stopping through clearTimeout</button>

        <hr>

        <h1>Count through setTimeout：{{ countTimeout }}</h1>
        <button @click="stopTimeout">Stopping through clearInterval</button>
    </div>
</template>
    
<script setup lang='ts'>
import { ref } from 'vue'

// 1. Example for setInterval
const countInterval = ref(0)

const IntervalID = setInterval(() => countInterval.value++, 1000)

const stopInterval = () => {
    console.log('ClearTimeout triggered in stopInterval method!')
    clearTimeout(IntervalID)
}

// 2. Example for setTimeout
const countTimeout = ref(0)
let TimeoutID = 0

const addCount = () => {
    TimeoutID = setTimeout(() => {
        countTimeout.value++
        addCount()
    }, 1000)
}

addCount()

const stopTimeout = () => {
    console.log('ClearInterval triggered in stopTimeout method!')
    clearInterval(TimeoutID)
}
</script>
    
<style lang="scss">
.count-down {
    .box {}
}

</style>