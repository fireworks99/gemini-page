<template>
  <div :class="['dialogue_outside', { 'mt0': store.dataLen === 0 }]" ref="chatContainer" @scroll="onScroll">
    <div class="main_dialogue_wrapper">

      <div class="qa" v-for="item in dataList" :key="item.id">

        <!-- 问题 -->
        <div class="question">
          <div class="container" v-show="!item.is_edit" :data-qu="item.question">
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
        <div class="answer">

          <!-- 这里可以有 参考文档、深度思考，只不过本项目没有 -->

          <div v-html="item.answer"></div>
        </div>

        <div style="height: 36px; margin-top: 12px;"></div>

      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, reactive, ref, watch } from 'vue';
import { type TreeNodeData, TreeNode, innerProcess } from '@/utils';
import emitter from '@/utils/mitt';
import { ElMessage } from 'element-plus';
import { ArrowLeft, ArrowRight } from '@element-plus/icons-vue';
import IconCopy from './Icons/IconCopy.vue';
import IconEdit from './Icons/IconEdit.vue';

import { useMainStore } from "@/store";
const store = useMainStore();

const cnt = ref(0);
const dataList = reactive<TreeNodeData[]>([]);
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
  if (dataList.length > 1) {
    scrollToBottom();
  }

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

          return Promise.resolve();
        }

        processChunk(value);

        // 这里执行Markdown解析!!!
        const parseMd = innerProcess(receivedText);

        dataList[dataList.length - 1].answer = parseMd;
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
      });
  } catch (err) {
    ElMessage.error(String(err));
  }

}

// 页面滑动到最底端
const chatContainer = ref<HTMLDivElement>();
const scrollToBottom = () => {
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
  }
}

// 复制功能
import ClipboardJS from 'clipboard';
const cbInstances = ref<ClipboardJS[]>([]);
const initClipboardJS = () => {

  // 1.回答中代码的复制
  const clipboard = new ClipboardJS('.copy-button', {
    target: (trigger: Element) => {
      const parent = trigger.parentElement!; // 使用 ! 断言不为 null
      return parent.nextElementSibling as Element; // 断言为 Element
    }
  });

  clipboard.on('success', (e: ClipboardJS.Event) => {
    e.trigger.innerHTML = '复制成功';
    setTimeout(() => {
      e.trigger.innerHTML = '复制';
    }, 1000);
    e.clearSelection();
  });

  clipboard.on('error', (e: ClipboardJS.Event) => {
    console.error('复制失败:', e.action);
  });

  cbInstances.value.push(clipboard);

  // 2.问题的复制
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

    .container {
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
          display: none;

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

          svg {
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 8px;
            cursor: pointer;

            &:not([disabled]):hover {
              background-color: #f5f5f5;
            }

            &[disabled] {
              cursor: not-allowed;
            }
          }

          span {
            margin: 0 4px;
          }
        }
      }
    }

    &:hover .container .options .opt_item {
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
    margin-bottom: 12px;
    background-color: #e2ebff;
    padding: 12px 32px 16px 32px;
    box-sizing: border-box;
    border-radius: 16px;
    border-top-left-radius: 0;
    min-height: 80px;

    .icon {
      background-color: #fff;
      border-radius: 50%;
      justify-content: center;
      align-items: center;
      width: 32px;
      height: 32px;
      display: flex;
      box-shadow: 0 0 0 1px #d5e4ff;
      position: absolute;
      top: 22px;
      left: 16px;
    }
  }
}
</style>