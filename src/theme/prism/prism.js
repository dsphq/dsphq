import prism from 'prismjs';
import 'prismjs/components/prism-json';
import lightTheme from './lightTheme';
import darkTheme from './darkTheme';

let styleNode;

if (process.browser) {
  styleNode = document.createElement('style');
  styleNode.setAttribute('data-prism', 'true');
  if (document.head) {
    document.head.appendChild(styleNode);
  }
}

export function setPrismTheme(type) {
  styleNode.textContent =  type === 'light' ? lightTheme : darkTheme;
}

export default prism;