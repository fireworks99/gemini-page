<template>
  <div :class="['dialogue_outside', { 'mt0': store.dataLen === 0 }]" ref="chatContainer" @scroll="onScroll">
    <div class="main_dialogue_wrapper">

      <div class="qa" v-for="item in dataList" :key="item.id">

        <!-- 问题 -->
        <div class="question">
          <div class="q-container" v-show="!item.is_edit" :data-qu="item.question">
            {{ item.question }}

            <div class="options">
              <el-tooltip class="item" effect="dark" content="复制" placement="bottom">
                <div class="opt_item opt_q_copy">
                  <IconCopy />
                </div>
              </el-tooltip>

              <el-tooltip class="item" effect="dark" content="编辑消息" placement="bottom">
                <div class="opt_item" @click="editQuestion(item)">
                  <IconEdit />
                </div>
              </el-tooltip>

              <div v-show="item.siblings && item.siblings.length > 1" class="opt_page">
                <ArrowLeft :class="{ disabled: item.rank === 1 }" @click="toggleBranch(item, -1)" />
                <span>{{ item.rank }} / {{ item.siblings ? item.siblings.length : 1 }}</span>
                <ArrowRight :class="{ disabled: item.rank === (item.siblings?.length ?? 1) }"
                  @click="toggleBranch(item, 1)" />
              </div>
            </div>

          </div>

          <div class="qu_edit" v-show="item.is_edit">
            <textarea v-model="item.edit_text" class="qu_edit_text" @keydown="handleKeydown(item, $event)"></textarea>
            <div class="qu_edit_mirror">{{ item.edit_text }}</div>
            <div class="qu_edit_btn">
              <el-button size="small" round @click="item.is_edit = false">取消</el-button>
              <el-button size="small" round type="primary" @click="appendToNewBranch(item)">发送</el-button>
            </div>
          </div>
        </div>

        <!-- 回答 -->
        <div class="answer" :data-as="item.answer">

          <!-- 这里可以有 参考文档、深度思考，只不过本项目没有 -->

          <!-- <div v-html="item.answer"></div> -->
          <MarkdownRender :content="item.answer" :code-block-props="{
            stream: true,
            theme: { light: 'vitesse-light', dark: 'vitesse-dark' },
            diffMode: 'inline'
          }" smooth-streaming="auto" :fade="false" />

          <div class="options">
            <el-tooltip class="item" effect="dark" content="复制" placement="bottom">
              <div class="opt_item opt_a_copy">
                <IconCopy />
              </div>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="重试" placement="bottom">
              <div class="opt_item" @click="retry(item.question)">
                <el-icon :size="22"><RefreshRight /></el-icon>
              </div>
            </el-tooltip>

          </div>
        </div>

        <div style="height: 36px; margin-top: 12px;"></div>

      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, reactive, ref, watch } from 'vue';
import { type TreeNodeData, TreeNode } from '@/utils';
import emitter from '@/utils/mitt';
import { ElMessage } from 'element-plus';
import { ArrowLeft, ArrowRight, RefreshRight } from '@element-plus/icons-vue';
import IconCopy from './Icons/IconCopy.vue';
import IconEdit from './Icons/IconEdit.vue';
import { MarkdownRender } from 'markstream-vue';
import 'markstream-vue/index.css';
import 'katex/dist/katex.min.css';

import { useMainStore } from "@/store";
const store = useMainStore();

const cnt = ref(0);
const dataList = reactive<TreeNodeData[]>([
  // {
  //   answer: "**TypeScript（简称 TS）** 是由微软开发的一种开源编程语言。简单来说，**TS 是 JavaScript（JS）的“增强版”或“超集（Superset）”**。\n\n如果用一个公式来表示，那就是：**TypeScript = JavaScript + 类型系统（Type System） + 先进的 JS 特性**。\n\n以下是对 TS 的快速介绍：\n\n---\n\n### 1. 为什么需要 TS？（解决 JS 的痛点）\nJavaScript 是一门**动态类型**语言，写代码时非常自由，但也带来了一些隐患：\n* **隐式类型转换和低级错误：** 比如把字符串和数字相加，或者拼错了变量名，JS 在运行前不会报错，只有在浏览器里运行到那一行时才会崩溃。\n* **维护困难：** 当项目变大、成员变多时，没有类型提示，阅读别人的代码像猜谜。\n\n**TS 的核心目的，就是把这些错误提前到“编译阶段”暴露出来，而不是等到“运行阶段”。**\n\n---\n\n### 2. TS 的核心特性\n\n* **静态类型检查（Static Typing）：** \n  你可以为变量、函数参数和返回值指定类型。如果类型不匹配，编辑器会立即报错。\n* **IDE（代码编辑器）的极致体验：**\n  因为有了类型定义，VS Code 等编辑器可以提供精准的代码自动补全、跳转定义和重构提示。\n* **向下兼容：**\n  TS 代码不能直接在浏览器中运行，它需要通过编译器**编译（转化）成普通的 JS 代码**。你可以配置编译成 ES5、ES6 等任意版本，确保在老旧浏览器上也能运行。\n* **完全兼容 JS：**\n  任何合法的 JS 代码都是合法的 TS 代码。你可以把一个 `.js` 文件直接改名为 `.ts`，它依然可以工作。\n\n---\n\n### 3. 代码对比直观感受\n\n**JavaScript 例子：**\n```javascript\nfunction greet(names) {\n    // 如果不小心传了数字，names.join 会报错导致程序崩溃\n    return \"Hello, \" + names.join(\", \"); \n}\ngreet(123); // 运行到这里才会报错：names.join is not a function\n```\n\n**TypeScript 例子：**\n```typescript\n// 限制 names 必须是字符串数组 (string[])\nfunction greet(names: string[]): string {\n    return \"Hello, \" + names.join(\", \");\n}\n\ngreet(123); // 🔴 在你写下这行代码时，编辑器就会爆红报错，根本不让你运行\ngreet([\"Alice\", \"Bob\"]); // 🟢 正确\n```\n\n---\n\n### 4. TS 的优缺点\n\n**优点：**\n1. **Bug 更少：** 在写代码时就能发现 80% 的低级错误。\n2. **易于维护：** 代码即文档，看类型定义就能明白接口结构，非常适合多人协作的大型项目。\n3. **主流趋势：** 如今前端主流框架（Vue 3, React, Angular）和 Node.js 社区都全面拥抱 TS，是前端工程师的必备技能。\n\n**缺点：**\n1. **学习成本：** 需要学习接口（Interface）、泛型（Generics）等新概念。\n2. **开发前期多写代码：** 需要写很多类型声明，前期开发速度可能会变慢（但后期维护会省下大量时间）。\n3. **编译时间：** 项目非常庞大时，编译过程会稍微消耗一些时间。\n\n### 总结\n**TypeScript 就像是给 JavaScript 穿上了一件“防弹衣”**。虽然穿衣服（写类型）的过程有点繁琐，但它能极大地保护你的代码在复杂的线上环境中不轻易“受伤”。",
  //   edit_text: "",
  //   id: 1,
  //   is_edit: false,
  //   question: "简单介绍一下TS",
  //   rank: 1,
  //   siblings: null
  // }
]);
let lastScrollTop = 0;

watch(
  () => dataList,
  newVal => {
    store.dataLen = newVal.length;
  },
  { deep: true }
)

const clearAll = ref(false);
let root = new TreeNode<TreeNodeData | null>(null, null);
let currNode = root;
const autoScroll = ref(true);
const generating = ref(false);

const extractText = (chunk: any) => {
  return (
    chunk?.candidates?.[0]?.content?.parts
      ?.map((part: any) => part.text ?? "")
      .join("") ?? ""
  );
}

const fetchAnswerToDialogue = (val: string) => {

  // 1.组织输入
  const messages = [];
  dataList.forEach(item => {
    messages.push(
      {
        role: "user",
        content: item.question
      },
      {
        role: "assistant",
        content: item.answer
      }
    )
  });
  messages.push({
    role: "user",
    content: val
  });

  // 2.界面更新问题
  dataList.push({
    id: ++cnt.value,
    question: val,
    answer: '',
    is_edit: false,
    edit_text: '',
    siblings: null,
    rank: 1
  });

  scrollToBottom();


  // 3.定义答案格式
  // const md = null;

  // 4.发送请求并处理
  try {
    fetch(window.APP_CONFIG.BASE_API + '/chat', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages }),
    }).then(async response => {

      if (!response.ok) {
        // 尝试解析错误信息
        let errorMsg = `HTTP ${response.status}`;
        try {
          const errorData = await response.json();
          errorMsg = errorData.error?.message || errorMsg;
        } catch (_) {
          // 如果响应体不是JSON，忽略
        }
        throw new Error(errorMsg);
      }

      if (!response.body) {
        throw new Error("ReadableStream not supported in this browser.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");

      let receivedText = '', got_ans = false, buffer = '';

      const processChunk = (chunk: Uint8Array) => {
        buffer += decoder.decode(chunk, { stream: true });

        while (true) {
          // 找到一条 SSE 消息结束
          const match = buffer.match(/\r?\n\r?\n/);

          if (!match || match.index === undefined) {
            break;
          }

          const end = match.index;
          const rawEvent = buffer.slice(0, end);
          buffer = buffer.slice(end + match[0].length);

          parseMessage(rawEvent);
        }
      }

      const parseMessage = (message: string) => {
        const lines = message.split(/\r?\n/);

        for (const line of lines) {
          if (!line.startsWith("data:")) {
            continue;
          }

          const json = line.slice(5).trim();

          if (!json) {
            continue;
          }

          try {
            const obj = JSON.parse(json);
            const content = extractText(obj);
            receivedText += content;

          } catch (e) {
            console.error(e);
          }
        }
      }

      reader.read().then(function processText({ done, value }): Promise<void> {

        // 1.中途执行清空对话
        if (clearAll.value) {
          dataList.splice(0); //清空对话
          root.destroy();
          root = new TreeNode(null, null);
          currNode = root;
          clearAll.value = false; // 重置开关

          return Promise.resolve();
        }

        // 2.正常回答结束
        if (done) {
          console.log("流式输出结束");

          generating.value = false;
          autoScroll.value = true;

          // 更新树（待获取了完整的 answer/docs 之后再执行即可）
          const last = dataList[dataList.length - 1];
          last.rank = currNode.children ? currNode.children.length + 1 : 1;

          // 子元素value中的siblings属性是一个引用，指向父元素的children属性
          const obj = JSON.parse(JSON.stringify(last));
          last.siblings = currNode.children;
          obj.siblings = currNode.children;

          const node = new TreeNode(currNode, obj);
          currNode.children.push(node);

          // 指针移动到当前节点
          currNode = node;

          scrollToBottom();

          return Promise.resolve();
        }

        processChunk(value);

        // console.log('receivedText: ', receivedText);

        dataList[dataList.length - 1].answer = receivedText;
        generating.value = true;

        if (!got_ans) {
          // 这里可以写深度思考的事件（如果有深度思考）

          emitter.emit("GotAnswer");
          got_ans = true;
        }

        if (autoScroll.value) {
          scrollToBottom();
        }

        // 继续读取下一块数据
        return reader.read().then(processText);
      });

    })
      .catch((error) => {
        console.error("Stream error:", error);
        ElMessage.error(`请求失败：${error.message}`);
        generating.value = false; // 记得重置状态
        emitter.emit("GotAnswer");
      });
  } catch (err) {
    ElMessage.error(String(err));
    emitter.emit("GotAnswer");
  }

}

// 页面滑动到最底端
import { nextTick } from "vue";
const chatContainer = ref<HTMLDivElement>();
const scrollToBottom = async () => {
  await nextTick();

  const el = chatContainer.value;
  if (!el) return;

  el.scrollTop = el.scrollHeight;
};

// 复制功能
import ClipboardJS from 'clipboard';
const cbInstances = ref<ClipboardJS[]>([]);
const initClipboardJS = () => {

  // 问题的复制
  const q_copy = new ClipboardJS('.opt_q_copy', {
    text: (trigger: Element): string => {
      const parent = trigger.parentElement?.parentElement;
      return parent?.getAttribute('data-qu') || '';
    }
  });

  q_copy.on('success', (e: ClipboardJS.Event) => {
    ElMessage.success('复制成功');
    e.clearSelection();
  });

  q_copy.on('error', (e: ClipboardJS.Event) => {
    console.error('复制失败:', e.action);
  });

  cbInstances.value.push(q_copy);

  // 回答的复制
  const a_copy = new ClipboardJS('.opt_a_copy', {
    text: (trigger: Element): string => {
      const parent = trigger.parentElement?.parentElement;
      return parent?.getAttribute('data-as') || '';
    }
  });

  a_copy.on('success', (e: ClipboardJS.Event) => {
    ElMessage.success('复制成功');
    e.clearSelection();
  });

  a_copy.on('error', (e: ClipboardJS.Event) => {
    console.error('复制失败:', e.action);
  });

  cbInstances.value.push(a_copy);
}

// 监听用户的滑动
const onScroll = (e: Event) => {
  /**监听用户滚动事件：滚动滚轮+拖转滚动条（如何与脚本滚动做区分？用户滚动必定是向上的）
   * 如果此时内容正在生成，则this.autoScroll置为false
   * 如果此时内容不在生成，则this.autoScroll置为true
   */
  const target = e.target as HTMLElement;

  if (target.scrollTop < lastScrollTop) {
    autoScroll.value = !generating.value;
  }
  lastScrollTop = target.scrollTop < 0 ? 0 : target.scrollTop;
}

// 编辑问题
const editQuestion = (item: TreeNodeData) => {
  item.is_edit = true;
  item.edit_text = item.question;
}

// 编辑问题时按下回车
const handleKeydown = (item: TreeNodeData, event: KeyboardEvent) => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    emitter.emit("BottomActive");
    appendToNewBranch(item);
  }
}

// 将问答添加到新的分支
const appendToNewBranch = (item: TreeNodeData) => {
  while (currNode.value?.id !== item.id) {
    currNode = currNode.parent || root;
    dataList.pop();
  }
  currNode = currNode.parent || root;
  dataList.pop();
  fetchAnswerToDialogue(item.edit_text);
}

// 切换分支
const toggleBranch = (item: TreeNodeData, step: number) => {
  const r = item.rank;
  const rank = r + step;
  if (rank < 1 || rank > (item.siblings || []).length) {
    return;
  }

  while (currNode.value?.id !== item.id) {
    currNode = currNode.parent || root;
    dataList.pop();
  }
  currNode = currNode.parent || root;
  dataList.pop();

  let node = currNode.children[rank - 1];
  dataList.push({ ...(node.value as TreeNodeData) });
  while (node.children && node.children.length > 0) {
    const lastIndex = node.children.length - 1;
    node = node.children[lastIndex];
    dataList.push({ ...(node.value as TreeNodeData) });
  }
  currNode = node;
}

// 重试（这会重建当前节点及其子树）
const retry = (question: string) => {
  emitter.emit("BottomActive");
  const tem = currNode.parent || root;
  currNode.destroy();
  currNode = tem;
  dataList.pop();
  fetchAnswerToDialogue(question);
}

onMounted(() => {
  emitter.on('quiz', val => {
    fetchAnswerToDialogue(String(val));
  });

  emitter.on("clearDialogue", () => {
    if (generating.value) {
      clearAll.value = true;
    } else {
      dataList.splice(0);
    }

    root.destroy();
    root = new TreeNode(null, null);
    currNode = root;
  });

  initClipboardJS();
  lastScrollTop = chatContainer.value?.scrollTop || 0;
})

onUnmounted(() => {
  emitter.off('quiz');
  emitter.off("clearDialogue");

  cbInstances.value.forEach(instance => {
    if (instance.destroy) {
      instance.destroy();
    }
  });
  cbInstances.value = [];
  dataList.splice(0);
})

</script>

<style lang='scss' scoped>
.dialogue_outside {
  margin-top: 24px;
  overflow: auto;

  &.mt0 {
    margin-top: 0;
  }
}

.main_dialogue_wrapper {
  margin: auto;
  max-width: 48rem;

  .question {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 16px;
    padding-bottom: 32px;

    .q-container {
      font-size: 16px;
      line-height: 28px;
      color: #262626;
      padding: calc((44px - 28px) / 2) 20px;
      box-sizing: border-box;
      white-space: pre-wrap;
      word-break: break-word;
      // background-color: #eff6ff;
      background-color: #f5f5f5;
      border-radius: 16px;
      border-top-right-radius: 0;
      max-width: calc(100% - 48px);
      position: relative;

      .options {
        position: absolute;
        right: 0px;
        bottom: -36px;

        display: flex;
        align-items: center;

        .opt_item {
          margin-right: 8px;
          color: #909090;
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          cursor: pointer;
          // display: none;

          &:hover {
            background-color: #f5f5f5;
          }
        }

        .opt_page {
          color: rgb(139, 139, 139);
          display: flex;
          align-items: center;
          white-space: nowrap; //坚决不换行

          .disabled {
            opacity: 0.4;
            cursor: not-allowed;
          }

          span {
            margin: 0 4px;
          }
        }
      }
    }

    &:hover .q-container .options .opt_item {
      display: flex;
    }

    .qu_edit {
      width: 100%;
      max-width: calc(100% - 48px);
      min-height: 100px;
      max-height: 268px;
      position: relative;
      box-shadow: inset 0 0 0 1px rgb(229, 229, 229);
      box-sizing: border-box;
      color: rgb(64, 64, 64);
      font-size: 18px;
      line-height: 28px;
      border-radius: 14px;
      background-color: transparent;
      margin-bottom: 24px;

      &:focus-within {
        box-shadow: inset 0 0 0 2px #adcbf4;
      }

      .qu_edit_text {
        width: 100%;
        border: none;
        outline: none;
        resize: none;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        box-sizing: border-box;
        background-color: transparent;
        color: inherit;
        font-size: inherit;
        line-height: inherit;
        padding: 8px 20px;
        word-break: break-word;
      }

      .qu_edit_mirror {
        visibility: hidden;
        white-space: pre-wrap;
        pointer-events: none;
        max-width: 100%;
        font-size: inherit;
        line-height: inherit;
        padding: 8px 20px;
        word-break: break-word;
        font-family: inherit;
      }

      .qu_edit_btn {
        position: absolute;
        right: 0px;
        top: calc(100% + 12px);
        display: flex;
        justify-content: flex-end;
      }
    }
  }

  .answer {
    color: rgb(64, 64, 64);
    position: relative;
    margin-bottom: 32px;
    background: linear-gradient(135deg, #0f766e11, #14b8a611);
    padding: 12px 32px 16px 32px;
    box-sizing: border-box;
    border-radius: 16px;
    min-height: 80px;

    position: relative;

    .options {
      position: absolute;
      left: 0px;
      bottom: -36px;

      display: flex;
      align-items: center;

      .opt_item {
        margin-right: 8px;
        color: #909090;
        width: 28px;
        height: 28px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 8px;
        cursor: pointer;
        // display: none;

        &:hover {
          background-color: #f5f5f5;
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .main_dialogue_wrapper {
    .answer {
      background: none;
    }
  }

}
</style>