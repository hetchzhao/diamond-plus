

# 功能一
```jsx
<template>
  <div id="app">
    <a
      class="github-fork-ribbon right-top"
      href="https://github.com/zxpsuper/createVue"
      title="Fork me on GitHub"
    >Fork me on GitHub</a>
    <transition name="slide-up">
      <img
        src="./assets/logo.png"
        alt
        style="transition: all 0.3s"
      />
    </transition>
    <vuf-crud
      :data="data"
      :columns="columns"
    >
      <vuf-table>
        <template v-slot:address="slotProps">
          <div>this is slot</div>
          <div>{{slotProps}}</div>
        </template>
      </vuf-table>
    </vuf-crud>
    <!-- <vuf-page /> -->
  </div>
</template>
```