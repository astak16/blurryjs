## 使用

1. 安装

```bash
npm i blurryjs
# 或
yarn add blurryjs
# 或
pnpm i blurryjs
```

2. 引入

```js
import Blur from "blurryjs";
```

3. 快速使用

```js
const blur = new Blur(); // 默认全局数字模糊
```

## 参数说明

5 个参数

1. `blur?: number`：模糊程度，单位：`px`，默认 `2px`
2. `blurryWords?: string[]`：需要模糊的词，默认数字模糊
3. `operator?: string`：默认模糊，可以是其他符号，比如 `*` 等
4. `autoBlur?: boolean`：是否自动模糊，默认 `false`，只处理静态文本，如果需要处理异步数据，需要设置为 `true`
5. `excludes?: string[]`：排除不需要模糊的 `dom`，类名，比如 `["ant-input"]`

```ts
const blur = new Blur({
  blur: 2,
  blurryWords: ["周杰伦", "陈奕迅"],
  operator: "*",
  autoBlur: false,
  excludes: ["ant-input"],
});
```

3 个方法：

1. `enableBlur(options)`：开启模糊，`options` 参数为：`blur`、`blurryWords`、`operator`、`autoBlur`

   ```ts
   blur.enableBlur({
     blur: 2,
     blurryWords: ["1", "2", "3"],
     operator: "*",
     autoBlur: false,
   });
   ```

2. `disableBlur`：关闭模糊

   ```ts
   blur.disableBlur();
   ```

3. `destroy`：销毁

   ```ts
   blur.destroy();
   ```

## 效果

![20230625](./images/20230625.gif)

## 为什么要做这个插件

页面在展示时，某些敏感的数据不想展示，可以使用该插件，对敏感数据进行模糊处理

敏感数据过滤通常是由后端去做的，有时候在某些场合不想展示某些数据，这时让后端去改代码，再重新部署，这样的成本太高，所以前端也需要有这样的能力，可以在前端对敏感数据进行模糊处理，这样就不需要后端参与了

前端过滤文本，通常有两种方法：

1. 拦截响应，对文本进行过滤后在渲染在页面上
2. 渲染在页面上后，对文本进行过滤

对于方案一，需要遍历所有的响应对象的所有属性，而且只能替换或者删除文本，无法实现个性化的配置

所以我选择了方案二，当页面渲染结束后，遍历所有的 `dom`，对文本进行过滤，这样可以实现个性化的配置

遍历 `dom`，你能想到最直接的方法是：

1. `document.querySelectorAll("*")`
2. `document.body.getElementsByTagName("*")`

然后在遍历找到的所有 `dom`，对文本进行过滤，这样效率会很差

所以我选择了 `TreeWalker` 遍历 `dom`，效率会高很多

## 技术说明

[treeWalker](https://developer.mozilla.org/zh-CN/docs/Web/API/TreeWalker) 是通过 `document.createTreeWalker()` 创建的，传入 `NodeFilter.SHOW_TEXT` 参数，就可以拿到页面中所有的文本节点

然后用正则匹配文本，如果匹配到了，就对文本进行模糊处理：

```ts
const wrapTextWithTag = (node: Node) => {
  const oldText = node?.textContent;
  if (!oldText) return;
  const regexNumber = /[-+]?\d{1,3}(?:,\d{3})*(?:\.\d+)?/;
  const regexWord = new RegExp(`(${this.words.join("|")})`);
  const mergedRegex = new RegExp(
    `(${regexNumber.source}|${regexWord.source})`,
    "g"
  );

  if (mergedRegex.test(oldText)) {
    const rep = oldText.replace(mergedRegex, "<span>$1</span>");
    const arr = rep.split(/<\/?span>/);
    let span;
    node.textContent = "";
    for (let i = 0; i < arr.length; i++) {
      const newText = arr[i];
      const isContainsWord = this.isContainsWord(newText);
      const isContainsNumber = this.isContainsNumber(newText);
      if (!this.isVoid(newText) && (isContainsWord || isContainsNumber)) {
        span = this.createElementAndSetBlurred(newText);
      } else {
        span = document.createTextNode(newText);
      }
      node.parentElement?.insertBefore(span, node);
    }
  }
};
```

如果到此结束的话，只能处理静态的文本，如果是异步数据，就无法处理了，所以还需要监听 `dom` 的变化，对新增的 `dom` 进行模糊处理

监听 `dom` 可以使用 [MutationObserver](https://developer.mozilla.org/zh-CN/docs/Web/API/MutationObserver)，将 `subtree` 设置为 `true`，就可以监听到所有的 `dom` 变化

```ts
const observer = new MutationObserver((mutationList) => {
  mutationList.map((mutation) => {
    const node = mutation.addedNodes[0];
    if (!node) return;
    const isStyle = this.hasStyle(node);
    if (node.nodeType === 1 && !isStyle && !this.isVoid(node.textContent)) {
      this.blurryWordsWithTag(node);
    }
  });
});
observer.observe(document.body, { childList: true, subtree: true });
this.observer = observer;
```

这里需要说明一点：默认不开启异步数据模糊处理，因为这样会影响性能，如果需要开启，设置 `autoBlur` 为 `true`

推荐使用方式：页面设置个按钮，点击按钮开启模糊，这样可以避免一些性能问题

## demo

```
git clone https://github.com/astak16/blurryjs.git

cd blurryjs

pnpm i

pnpm dev
```
