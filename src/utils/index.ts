import MarkdownIt from "markdown-it";
import hljs from 'markdown-it-highlightjs';
import mk from 'markdown-it-katex';
import multimdTable from 'markdown-it-multimd-table';
import markdownItLinkAttributes from "markdown-it-link-attributes";
import DOMPurify from "dompurify";

export type TreeNodeData = {
  id: number;
  question: string;
  answer: string;
  is_edit: boolean;
  edit_text: string;
  siblings: null | any[];   //我爸妈所有的孩子
  rank: number;             //我在家排老几
}

export class TreeNode<T> {
  parent: TreeNode<T> | null;
  value: T | null;
  children: TreeNode<T>[];

  constructor(parent: TreeNode<T> | null, value: T) {
    this.parent = parent;
    this.value = value;
    this.children = [];
  }

  traverse(): T[] {
    const ans: T[] = [];
    let p: TreeNode<T> | null = this;
    while (p && p.value !== null) {
      ans.unshift(p.value);
      p = p.parent;
    }
    return ans;
  }

  // 销毁整棵树
  destroy(): void {
    // 递归销毁所有子节点
    this.children.forEach(child => child.destroy && child.destroy());

    // 清除当前节点的引用
    if (this.parent) {
      // 从父节点的 children 数组中移除当前节点
      this.parent.children = this.parent.children.filter(child => child !== this);
    }

    // 清除当前节点的属性
    this.parent = null;
    this.value = null;
    this.children = [];
  }
}

// 返回 HTML 字符串
export function innerProcess(mdStr: string): string {
  if (!mdStr) {
    return "";
  }

  const md = new MarkdownIt()
    .use(hljs, { inline: true })
    .use(mk)
    .use(multimdTable, {
      multiline: false,
      rowspan: false,
      headerless: false,
      multibody: true,
      autolabel: true,
    })
    .use(markdownItLinkAttributes, {
      pattern: /^http[s]?:\/\//, // 只对外部链接添加特定属性
      attrs: { target: "_blank", rel: "noopener" }
    }); // 链接属性

  // 0. 字符串替换
  const formatText = mdStr
    .replace(/\\\( /g, "$")
    .replace(/\\\(/g, "$")
    .replace(/ \\\)/g, "$")
    .replace(/\\\)/g, "$")
    .replace(/\\\[\\n/g, "$$$$\n")
    .replace(/\\\[/g, "$$$$\n")
    .replace(/\\n\\\]/g, "\n$$$$")
    .replace(/\\\]/g, "\n$$$$");

  // 1. Markdown 渲染
  const renderedContent = md.render(formatText);

  // 2. DOM 净化（防 XSS）
  const safeHtml = DOMPurify.sanitize(renderedContent);

  // 3. 为代码块添加复制按钮
  return addCopyButton(safeHtml);
}

// 返回 HTML 字符串
function addCopyButton(renderedMarkdown: string): string {
  const tempDiv: HTMLDivElement = document.createElement("div");
  tempDiv.innerHTML = renderedMarkdown;

  const preElements = tempDiv.querySelectorAll<HTMLPreElement>("pre");

  preElements.forEach((pre) => {
    const toolbar = document.createElement("div");
    toolbar.className = "toolbar";

    // 左侧：语言名称
    const left = document.createElement("div");

    let lang = "";

    const code = pre.querySelector<HTMLElement>("code");
    if (code) {
      const className = Array.from(code.classList).find((item) =>
        item.startsWith("language-")
      );

      if (className) {
        lang = className.replace("language-", "");
      }
    }

    left.className = 'left';
    left.textContent = lang;

    toolbar.appendChild(left);

    // 右侧：复制按钮
    const right = document.createElement("div");
    right.textContent = "复制";
    right.className = "right copy-button";

    toolbar.appendChild(right);

    pre.insertBefore(toolbar, pre.firstChild);
  });

  return tempDiv.innerHTML;
}