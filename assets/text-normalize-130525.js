(() => {
  const fixes = [
    [/\u00e2\u20ac\u00a2/g, "\u2022"],
    [/\u00c3\u00a2\u00e2\u201a\u00ac\u00c2\u00a2/g, "\u2022"],
    [/\u00e2\u20ac\u2122/g, "\u2019"]
  ];
  const clean = value => fixes.reduce((text, [pattern, replacement]) => text.replace(pattern, replacement), value);
  const cleanTextNode = node => {
    const next = clean(node.nodeValue || "");
    if (next !== node.nodeValue) node.nodeValue = next;
  };
  const cleanTree = root => {
    if (!root) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) cleanTextNode(walker.currentNode);
  };
  const observer = new MutationObserver(records => {
    for (const record of records) {
      if (record.type === "characterData") cleanTextNode(record.target);
      for (const node of record.addedNodes) {
        if (node.nodeType === Node.TEXT_NODE) cleanTextNode(node);
        else if (node.nodeType === Node.ELEMENT_NODE) cleanTree(node);
      }
    }
  });
  const start = () => {
    cleanTree(document.body);
    observer.observe(document.documentElement, { childList: true, subtree: true, characterData: true });
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();