<template>
  <div class="bottom_input_outside">
    <div class="bottom_input_wrapper">
      <div class="text">
        <div :class="{ active: isActive }">
          <div class="darkBorderBg"></div>
          <div class="darkBorderBg"></div>
          <div class="darkBorderBg"></div>
        </div>

        <div class="bottom_input_container">
          <textarea ref="textareaRef" id="chatInput" v-model="inputValue" rows="2" placeholder="请输入对话内容，换行请使用Shift+Enter。"
            @keydown="handleKeydown" />

          <div class="settings">
            <div class="left_item"></div>

            <div class="right_wrapper">
              <div class="submit" @click="submitQuestion">
                <img src="@/assets/images/submit.png" alt="" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="anno">
        内容由AI生成，仅供参考
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import emitter from '@/utils/mitt'


const textareaRef = ref<HTMLTextAreaElement>()

const inputValue = ref('')
const isActive = ref(false)


function resizeTextarea() {
  const textarea = textareaRef.value

  if (!textarea) return

  textarea.style.height = 'auto'

  const newHeight = Math.min(
    textarea.scrollHeight - 16,
    128
  )

  textarea.style.height = `${newHeight}px`
}

function initTextarea() {
  textareaRef.value?.addEventListener('input', resizeTextarea)
}

function submitQuestion() {
  if (!inputValue.value.trim()) return

  emitter.emit('quiz', inputValue.value)

  isActive.value = true
  inputValue.value = ''

  if (textareaRef.value) {
    textareaRef.value.style.height = 'auto'
  }
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    submitQuestion()
  }
}

onMounted(() => {
  initTextarea()

  emitter.on('GotAnswer', () => { isActive.value = false })
  emitter.on('BottomActive', () => { isActive.value = true })
})

onUnmounted(() => {
  textareaRef.value?.removeEventListener(
    'input',
    resizeTextarea
  )

  emitter.off('GotAnswer')
  emitter.off('BottomActive')
})
</script>

<style scoped lang="scss">
.bottom_input_outside {
  position: sticky;
  left: 0;
  bottom: 0;
  width: 100%;
  background-color: #fff;
  border-radius: 32px;
}

.bottom_input_wrapper {
  margin: auto;
  max-width: 48rem;
  padding: 1rem;
  padding-bottom: 32px;
  display: flex;
  position: relative;

  .text {
    flex: 1;
    border-radius: 0.5rem;
    display: flex;
    background-color: #F5F5F5;
    position: relative;
    margin: 0;

    textarea {
      min-height: 52px;
    }

    .darkBorderBg {
      position: absolute;
      width: 100%;
      height: 100%;
      overflow: hidden;
      z-index: -1;
      border-radius: 0.5rem;
      filter: blur(3px);

      &::before {
        content: "";
        position: absolute;
        left: 50%;
        top: 50%;
        width: 800px;
        height: 800px;
        transform: translate(-50%, -50%) rotate(82deg);
        background-image: conic-gradient(rgba(0, 0, 0, 0),
            #4b7afe,
            rgba(0, 0, 0, 0) 10%,
            rgba(0, 0, 0, 0) 50%,
            #4b7afe,
            rgba(0, 0, 0, 0) 60%);
      }
    }

    @keyframes rotate-animation {
      from {
        transform: translate(-50%, -50%) rotate(0);
      }

      to {
        transform: translate(-50%, -50%) rotate(360deg);
      }
    }

    >.active>.darkBorderBg::before {
      animation: rotate-animation 4s linear infinite;
    }

    .bottom_input_container {
      flex: 1;
      padding: 10px;
      display: flex;
      flex-direction: column;

      textarea {
        resize: none;
        padding: 8px;
        width: calc(100% - 16px);
        background: transparent;
        border: none;
        outline: none;
        overflow-y: auto;
        max-height: 128px;
        font-size: 18px;
        box-sizing: content-box;
      }

      .settings {
        display: flex;
        align-items: center;
        margin-top: 8px;

        .left_item {
          cursor: pointer;
        }

        .right_wrapper {
          flex: 1;
          display: flex;
          justify-content: flex-end;
          align-items: center;

          .submit {
            height: 24px;
            cursor: pointer;

            img {
              width: 24px;
              height: 24px;
            }
          }
        }
      }
    }
  }

  .anno {
    position: absolute;
    left: 50%;
    bottom: 8px;
    transform: translateX(-50%);
    font-size: 12px;
    color: rgb(163, 163, 163);
    margin: 2px 0;
  }
}
</style>