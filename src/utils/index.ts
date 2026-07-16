export type TreeNodeData = {
  id: number;
  question: string;
  answer: string;
  is_edit: boolean;
  edit_text: string;
  siblings: null | any[];
  rank: number;//当前节点有多少子树
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