interface BlurOptions {
  blur?: number;
  blurryWords?: string[];
  operator?: string;
  autoBlur?: boolean;
  excludes?: string[];
}
export default class Blur {
  private blur!: number;
  private originBlurryWords: string[] = [];
  private blurryWords: string[] = [];
  private operator!: string;
  private words!: string[];
  private autoBlur!: boolean;
  // 只能传 className
  private excludes!: string[];
  private observer: MutationObserver | null = null;
  private classRandom: string = generateRandomString(6);

  constructor(options?: BlurOptions) {
    this.initialParams(options);
    this.originBlurryWords = this.blurryWords;
    this.excludes = options?.excludes || [];
    this.initial();
  }
  private initialParams(options?: BlurOptions) {
    this.blur = this.isVoid(options?.blur) ? 2 : options?.blur!;
    const blurryWords = (options?.blurryWords || []).filter(Boolean);
    if (
      !blurryWords ||
      !blurryWords.length ||
      (blurryWords.length === 1 && blurryWords[0] === "")
    ) {
      this.blurryWords = this.originBlurryWords;
    } else if (blurryWords.length > 0) {
      this.blurryWords = this.blurryWords.concat(blurryWords);
    }
    this.operator = options?.operator || "";
    this.autoBlur = options?.autoBlur || false;
  }
  private initial() {
    this.initWords();
    this.blurryWordsWithTag();
    this.autoBlur && this.observerElement();
  }
  enableBlur(options?: Omit<BlurOptions, "excludes">) {
    this.initialParams(options || {});
    this.disableBlur();
    this.initial();
  }
  disableBlur() {
    this.destroy();
    this.unBlurryWordsFromTag();
  }
  destroy() {
    this.observer?.disconnect();
  }
  private observerElement = () => {
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
  };
  private isVoid(text: string | number | null | undefined) {
    return text === null || text === undefined || text.toString().trim() === "";
  }

  private hasStyle = (node: Node, containsClassRandom = false) => {
    const parentElement = node?.parentElement;
    const classnames = containsClassRandom
      ? this.excludes
      : this.excludes.concat(this.classRandom);
    return classnames.some((item) => parentElement?.classList.contains(item));
  };

  private blurryWordsWithTag(element: Node = document.body) {
    let n;
    let nodeList = [];
    const walk = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, {
      acceptNode: (node: Node) => {
        const isContainsWord = this.isContainsWord(node.textContent);
        const isContainsNumber = this.isContainsNumber(node.textContent);
        return isContainsNumber || isContainsWord
          ? NodeFilter.FILTER_ACCEPT
          : NodeFilter.FILTER_REJECT;
      },
    });
    while ((n = walk.nextNode())) nodeList.push(n);
    nodeList.forEach((n) => this.acceptNode(n));
  }

  private unBlurryWordsFromTag = (element: Node = document.body) => {
    let n;
    let nodeList = [];
    const walk = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, {
      acceptNode: (node: Node) => {
        const isStyle = this.hasStyle(node);
        return isStyle ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
      },
    });
    while ((n = walk.nextNode())) nodeList.push(n);
    nodeList.forEach((n) => this.acceptNode2(n));
  };

  private acceptNode = (node: Node) => {
    const isStyle = this.hasStyle(node);
    if (isStyle) return;
    this.wrapTextWithTag(node);
  };

  private acceptNode2 = (node: Node) => {
    const isStyle = this.hasStyle(node);
    const hasExclude = this.hasStyle(node, true);
    if (!isStyle || hasExclude || !node.parentElement) return;
    this.unwrapTextFromTag(node.parentElement as HTMLElement);
  };

  private isContainsNumber = (text: string | null) => {
    // 从一句话中匹配出小数、整数、负数和千分位
    return /[-+]?\d{1,3}(?:,\d{3})*(?:\.\d+)?/g.test(text || "");
  };

  private isContainsWord = (text: string | null) => {
    const words = this.words;
    if (!words.length) return false;
    return words.some((item) => text?.indexOf(item) !== -1);
  };

  private initWords = () => {
    this.words = this.blurryWords.length
      ? this.blurryWords.filter(Boolean)
      : [];
  };

  private wrapTextWithTag = (node: Node) => {
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

  private unwrapTextFromTag = (node: HTMLElement) => {
    if (!node) return;
    const attrValue = node?.getAttribute(`data-${this.classRandom}`);
    const textNode = document.createTextNode(
      attrValue || node.textContent || ""
    );
    const parentElement = node.parentElement;
    parentElement?.replaceChild(textNode, node);
  };

  private createElementAndSetBlurred = (newText: string) => {
    const span = document.createElement("span");
    span.classList.add(this.classRandom);
    span.innerText = newText;
    span?.setAttribute(`data-${this.classRandom}`, newText);
    this.setBlurred(span);
    return span;
  };

  private setBlurred(element: Node) {
    if (!(element instanceof HTMLElement)) return;
    if (this.operator) {
      this.replaceText(element);
    } else {
      this.blurText(element);
    }
  }

  private blurText = (
    element: HTMLElement & { style?: CSSStyleDeclaration }
  ) => {
    element.style.cssText = `filter: blur(${this.blur}px);`;
  };

  private replaceText = (element: HTMLElement) => {
    element.textContent = this.operator;
  };
}

function generateRandomString(length: number) {
  const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }

  return result;
}
