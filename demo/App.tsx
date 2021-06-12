import { defineComponent } from 'vue'

import './index.css'

export default defineComponent({
  render() {
    return (
      <div id="app">
        <a
          class="github-fork-ribbon right-top"
          href="https://github.com/zxpsuper/createVue"
          title="Fork me on GitHub"
        >Fork me on GitHub</a>
        <transition name="slide-up">
          {/* TODO: 在tsx下图片检索不到 */}
          <img
            src="./assets/logo.png"
            style="transition: all 0.3s"
          />
        </transition>
      </div>
    );
  }
})