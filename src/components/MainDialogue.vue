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
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <clipPath id="clip1248_20193">
                        <rect id="复制_1" width="17.052675" height="17.052441" transform="translate(1.000000 1.000000)"
                          fill="white" fill-opacity="0">
                        </rect>
                      </clipPath>
                      <clipPath id="clip1257_20794">
                        <rect id="复制" width="20.000000" height="20.000000" fill="white" fill-opacity="0"></rect>
                      </clipPath>
                    </defs>
                    <g clip-path="url(#clip1257_20794)">
                      <g clip-path="url(#clip1248_20193)">
                        <path id="path"
                          d="M5.03 14.64C4.77 14.64 4.5 14.62 4.24 14.56C3.98 14.51 3.73 14.43 3.49 14.33C3.24 14.23 3.01 14.1 2.79 13.96C2.57 13.81 2.37 13.64 2.18 13.45C1.99 13.26 1.82 13.05 1.68 12.83C1.53 12.61 1.4 12.37 1.3 12.13C1.2 11.88 1.13 11.63 1.07 11.36C1.02 11.1 1 10.84 1 10.57L1 5.07C1 4.8 1.02 4.54 1.07 4.27C1.13 4.01 1.2 3.76 1.3 3.51C1.4 3.26 1.53 3.03 1.68 2.81C1.82 2.58 1.99 2.38 2.18 2.19C2.37 2 2.57 1.83 2.79 1.68C3.01 1.53 3.24 1.41 3.49 1.31C3.73 1.2 3.98 1.13 4.24 1.07C4.5 1.02 4.77 1 5.03 1L10.49 1C10.75 1 11.01 1.02 11.27 1.07C11.53 1.13 11.78 1.2 12.03 1.31C12.27 1.41 12.51 1.53 12.73 1.68C12.95 1.83 13.15 2 13.34 2.19C13.53 2.38 13.69 2.58 13.84 2.81C13.99 3.03 14.11 3.26 14.21 3.51C14.31 3.76 14.39 4.01 14.44 4.27C14.5 4.54 14.52 4.8 14.52 5.07L12.94 5.07C12.94 4.91 12.92 4.75 12.89 4.58C12.86 4.43 12.81 4.27 12.75 4.12C12.69 3.97 12.61 3.83 12.52 3.69C12.43 3.56 12.33 3.43 12.22 3.32C12.1 3.2 11.98 3.1 11.85 3.01C11.71 2.92 11.57 2.84 11.42 2.78C11.27 2.72 11.12 2.67 10.96 2.64C10.81 2.61 10.65 2.59 10.49 2.59L5.03 2.59C4.87 2.59 4.71 2.61 4.55 2.64C4.4 2.67 4.24 2.72 4.09 2.78C3.95 2.84 3.8 2.92 3.67 3.01C3.54 3.1 3.41 3.2 3.3 3.32C3.18 3.43 3.08 3.56 2.99 3.69C2.9 3.83 2.83 3.97 2.77 4.12C2.71 4.27 2.66 4.43 2.63 4.58C2.6 4.75 2.58 4.91 2.58 5.07L2.58 10.57C2.58 10.73 2.6 10.89 2.63 11.05C2.66 11.21 2.71 11.37 2.77 11.52C2.83 11.67 2.9 11.81 2.99 11.94C3.08 12.08 3.18 12.2 3.3 12.32C3.41 12.43 3.54 12.54 3.67 12.63C3.8 12.72 3.95 12.79 4.09 12.86C4.24 12.92 4.4 12.96 4.55 13C4.71 13.03 4.87 13.04 5.03 13.04L5.03 14.64Z"
                          fill="currentColor" fill-opacity="1.000000" fill-rule="evenodd"></path>
                      </g>
                      <path id="path"
                        d="M14.75 18.91L9.3 18.91C9.03 18.91 8.77 18.88 8.51 18.83C8.25 18.78 8 18.7 7.75 18.6C7.51 18.49 7.27 18.37 7.05 18.22C6.83 18.07 6.63 17.9 6.44 17.71C6.25 17.52 6.09 17.32 5.94 17.1C5.79 16.87 5.67 16.64 5.57 16.39C5.47 16.14 5.39 15.89 5.34 15.63C5.28 15.37 5.26 15.1 5.26 14.83L5.26 9.33C5.26 9.06 5.28 8.8 5.34 8.54C5.39 8.28 5.47 8.02 5.57 7.77C5.67 7.53 5.79 7.29 5.94 7.07C6.09 6.85 6.25 6.64 6.44 6.45C6.63 6.26 6.83 6.09 7.05 5.95C7.27 5.8 7.51 5.67 7.75 5.57C8 5.47 8.25 5.39 8.51 5.34C8.77 5.29 9.03 5.26 9.3 5.26L14.75 5.26C15.01 5.26 15.28 5.29 15.54 5.34C15.8 5.39 16.05 5.47 16.29 5.57C16.54 5.67 16.77 5.8 16.99 5.95C17.21 6.09 17.41 6.26 17.6 6.45C17.79 6.64 17.96 6.85 18.1 7.07C18.25 7.29 18.37 7.53 18.48 7.77C18.58 8.02 18.65 8.28 18.71 8.54C18.76 8.8 18.78 9.06 18.78 9.33L18.78 14.83C18.78 15.1 18.76 15.37 18.71 15.63C18.65 15.89 18.58 16.14 18.48 16.39C18.37 16.64 18.25 16.87 18.1 17.1C17.96 17.32 17.79 17.52 17.6 17.71C17.41 17.9 17.21 18.07 16.99 18.22C16.77 18.37 16.54 18.49 16.29 18.6C16.05 18.7 15.8 18.78 15.54 18.83C15.28 18.88 15.01 18.91 14.75 18.91ZM9.3 6.86C9.13 6.86 8.97 6.87 8.82 6.91C8.66 6.94 8.51 6.98 8.36 7.05C8.21 7.11 8.07 7.18 7.93 7.28C7.8 7.37 7.68 7.47 7.56 7.58C7.45 7.7 7.35 7.82 7.26 7.96C7.17 8.09 7.09 8.24 7.03 8.38C6.97 8.54 6.92 8.69 6.89 8.85C6.86 9.01 6.84 9.17 6.84 9.33L6.84 14.83C6.84 15 6.86 15.16 6.89 15.32C6.92 15.48 6.97 15.63 7.03 15.78C7.09 15.93 7.17 16.07 7.26 16.21C7.35 16.34 7.45 16.47 7.56 16.58C7.68 16.7 7.8 16.8 7.93 16.89C8.07 16.98 8.21 17.06 8.36 17.12C8.51 17.18 8.66 17.23 8.82 17.26C8.97 17.29 9.13 17.31 9.3 17.31L14.75 17.31C14.91 17.31 15.07 17.29 15.23 17.26C15.38 17.23 15.54 17.18 15.69 17.12C15.83 17.06 15.98 16.98 16.11 16.89C16.24 16.8 16.37 16.7 16.48 16.58C16.59 16.47 16.7 16.34 16.79 16.21C16.87 16.07 16.95 15.93 17.01 15.78C17.07 15.63 17.12 15.48 17.15 15.32C17.18 15.16 17.2 15 17.2 14.83L17.2 9.33C17.2 9.17 17.18 9.01 17.15 8.85C17.12 8.69 17.07 8.54 17.01 8.38C16.95 8.24 16.87 8.09 16.79 7.96C16.7 7.82 16.59 7.7 16.48 7.58C16.37 7.47 16.24 7.37 16.11 7.28C15.98 7.19 15.83 7.11 15.69 7.05C15.54 6.98 15.38 6.94 15.23 6.91C15.07 6.87 14.91 6.86 14.75 6.86L9.3 6.86Z"
                        fill="currentColor" fill-opacity="1.000000" fill-rule="nonzero"></path>
                    </g>
                  </svg>
                </div>
              </el-tooltip>

              <el-tooltip class="item" effect="dark" content="编辑消息" placement="bottom">
                <div class="opt_item" @click="editQuestion(item)">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M18.2286 17.3545H1.77142C1.34538 17.3545 1 17.6999 1 18.1259C1 18.552 1.34538 18.8973 1.77142 18.8973H18.2286C18.6546 18.8973 19 18.552 19 18.1259C19 17.6999 18.6546 17.3545 18.2286 17.3545Z"
                      fill="currentColor"></path>
                    <mask id="mask0_400_418" maskUnits="userSpaceOnUse" x="1" y="1" width="15" height="15">
                      <path d="M15.1429 1.10254H1V15.2454H15.1429V1.10254Z" fill="white"></path>
                    </mask>
                    <g mask="url(#mask0_400_418)">
                      <path
                        d="M2.48999 15.2425C2.36999 15.2425 2.26002 15.2225 2.15002 15.2025C2.04002 15.1725 1.94003 15.1325 1.84003 15.0825C1.73003 15.0325 1.63999 14.9825 1.54999 14.9025C1.45999 14.8325 1.39001 14.7525 1.32001 14.6625C1.25001 14.5825 1.19001 14.4825 1.14001 14.3825C1.09001 14.2825 1.05003 14.1725 1.03003 14.0625C1.01003 13.9525 1 13.8425 1 13.7225C1 13.6125 1.00998 13.5025 1.03998 13.3925L1.75 10.4325C1.9 9.81254 2.20001 9.28253 2.64001 8.83253L9.40002 2.08253C9.55002 1.92253 9.71997 1.78254 9.90997 1.66254C10.09 1.54254 10.28 1.44254 10.49 1.35254C10.69 1.27254 10.9 1.20254 11.12 1.16254C11.33 1.12254 11.55 1.10254 11.77 1.10254C12 1.10254 12.21 1.12254 12.43 1.16254C12.65 1.20254 12.86 1.27254 13.06 1.35254C13.27 1.44254 13.46 1.54254 13.64 1.66254C13.83 1.78254 14 1.92253 14.15 2.08253C14.31 2.24253 14.45 2.41254 14.57 2.59254C14.69 2.77254 14.79 2.97255 14.88 3.17255C14.96 3.37255 15.03 3.59254 15.07 3.80254C15.11 4.02254 15.13 4.24254 15.13 4.46254C15.13 4.68254 15.11 4.90253 15.07 5.11253C15.03 5.33253 14.96 5.54254 14.88 5.74254C14.79 5.95254 14.69 6.14254 14.57 6.32254C14.45 6.51254 14.31 6.68253 14.15 6.83253L7.40002 13.5925C6.95002 14.0425 6.42 14.3325 5.81 14.4825L2.84003 15.1925C2.73003 15.2225 2.60999 15.2425 2.48999 15.2425ZM11.67 2.73254C11.22 2.76254 10.84 2.94254 10.52 3.26254L3.78998 9.99254C3.55998 10.2225 3.41002 10.4925 3.33002 10.8125L2.66998 13.5625L5.42999 12.9025C5.73999 12.8225 6.02 12.6725 6.25 12.4425L13 5.68254C13.08 5.60254 13.15 5.52255 13.22 5.42255C13.28 5.33255 13.33 5.23254 13.38 5.12254C13.42 5.02254 13.45 4.91254 13.47 4.80254C13.5 4.68254 13.51 4.57254 13.51 4.46254C13.51 4.34254 13.5 4.23254 13.47 4.12254C13.45 4.01254 13.42 3.90254 13.38 3.79254C13.33 3.69254 13.28 3.59254 13.22 3.49254C13.15 3.40254 13.08 3.31254 13 3.23254C12.82 3.06254 12.62 2.92254 12.39 2.84254C12.16 2.75254 11.91 2.71254 11.67 2.73254Z"
                        fill="currentColor"></path>
                    </g>
                  </svg>
                </div>
              </el-tooltip>

              <div v-show="item.siblings && item.siblings.length > 1" class="opt_page">
                <ArrowLeft :disabled="item.rank === 1" @click="toggleBranch(item, -1)" />
                <span>{{ item.rank }} / {{ item.siblings ? item.siblings.length : 1 }}</span>
                <ArrowRight :disabled="item.rank === (item.siblings ? item.siblings.length : 1)"
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
import { type TreeNodeData, TreeNode } from '@/utils';
import emitter from '@/utils/mitt';
import { ElMessage } from 'element-plus';
import { ArrowLeft, ArrowRight } from '@element-plus/icons-vue'

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

      let receivedText = '', got_ans = false;

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
          currNode.children.push(obj);

          // 指针移动到当前节点
          currNode = node;

          return Promise.resolve();
        }

        const chunkText = decoder.decode(value, { stream: true });
        let parseData = { docs: undefined, content: "", data: null, error: '' };

        {
          // 分割数据
          const chunks = chunkText.trim().split('data: ');

          chunks.forEach(chunk => {
            if (chunk.trim()) {
              let idx = chunk.lastIndexOf('}');
              let removeT = chunk + '';
              if (idx > 0) {
                removeT = chunk.substring(0, idx + 1);
              } else {
                return;  //: ping - 2025-02-10 08:36:31.266873
              }
              try {
                // 解析 JSON
                const jsonData = JSON.parse(removeT);
                const content = extractText(jsonData);

                parseData.content += content;

              } catch (error) {
                // 如果解析失败，跳过该 chunk
                console.log('解析 JSON 失败:', error);
                console.log(chunk);
              }
            }
          });
        }

        // temOutVars = afterCB && (afterCB(parseData, temOutVars));
        receivedText += parseData.content;

        // 这里执行Markdown解析!!!
        const parseMd = receivedText;

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