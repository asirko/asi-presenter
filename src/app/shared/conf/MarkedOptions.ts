import { MarkedOptions, MarkedRenderer } from 'ngx-markdown';
import { parsedSrc } from '../pipes/src.pipe';
import { Store } from '@ngxs/store';
import { PagesState } from '../stores/pages/pages.state';

// @ts-ignore
window.global = {};
declare let global: any;
global.writeToClip = function toto(element: HTMLElement): void {
  const body = document.querySelector('body');
  const area = document.createElement('textarea');
  body.appendChild(area);
  area.value = element.querySelector('code').innerText;
  area.select();
  document.execCommand('copy');

  body.removeChild(area);

  element.querySelector('button').innerText = 'copied';
};

// function that returns `MarkedOptions` with renderer override
export function markedOptionsFactory(store: Store): MarkedOptions {
  const renderer = new MarkedRenderer();

  const linkRenderer = renderer.link;
  renderer.link = (href, title, text) => {
    const parsedUrl = parsedSrc(href, store.selectSnapshot(PagesState.getCourse));
    const html = linkRenderer.call(renderer, parsedUrl, title, text);
    return html.replace(/^<a /, '<a target="_blank" rel="nofollow" ');
  };

  const imageRenderer = renderer.image;
  renderer.image = (href, title, text) => {
    const parsedUrl = parsedSrc(href, store.selectSnapshot(PagesState.getCourse));
    const html = imageRenderer.call(renderer, parsedUrl, title, text);
    return html.replace(/^<a /, '<a target="_blank" rel="nofollow" ');
  };

  const htmlRenderer = renderer.html;
  renderer.html = html => {
    const generatedHtml = htmlRenderer.call(renderer, html);
    return parsedSrc(generatedHtml, store.selectSnapshot(PagesState.getCourse));
  };

  const codeRenderer = renderer.code;
  renderer.code = (code, language) => {
    const html = codeRenderer.call(renderer, code, language);
    return `<div class="code-area" ondblclick="global.writeToClip(this)"><button onclick="global.writeToClip(this.parentNode)">copy</button>${html}</div>`;
  };

  return {
    renderer,
    gfm: true,
    breaks: false,
    pedantic: false,
    smartLists: true,
    smartypants: false,
  };
}
