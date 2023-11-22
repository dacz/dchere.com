function openm() {
  window.open('6d61696c746f3a6869406463686572652e636f6d'.split('').reduce((acc, it, i) => i % 2 ? [...acc.slice(0, acc.length - 1), [...(acc.slice(acc.length - 1)[0]), it]] : [...acc, [it]], []).map(i => parseInt(i.join(''), 16)).map(i => String.fromCharCode(i)).join(''));
}

document.addEventListener('DOMContentLoaded', () => {
  let nodes = document.querySelectorAll('a[href^="https://"]');
  nodes.forEach(node => node.setAttribute('target', '_blank'));
});
