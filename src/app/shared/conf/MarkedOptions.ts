import { MarkedOptions, MarkedRenderer } from 'ngx-markdown';
import { parsedSrc } from '../pipes/src.pipe';
import { Store } from '@ngxs/store';
import { PagesState } from '../stores/pages/pages.state';

// @ts-ignore
window.global = {};
declare let global: any;
global.writeToClip = function (element: HTMLElement): void {
  if (element.querySelector('code')) {
    navigator.clipboard.writeText(element.querySelector('code')!.innerText);
    element.querySelector('button')!.innerText = 'copied';
  }
};

// function that returns `MarkedOptions` with renderer override
export function markedOptionsFactory(store: Store): MarkedOptions {
  const renderer = new MarkedRenderer();

  const linkRenderer = renderer.link;
  renderer.link = function (link) {
    const parsedUrl = parsedSrc(link.href, store.selectSnapshot(PagesState.getCourse));
    const html = linkRenderer.call(this, { ...link, href: parsedUrl });
    return html.replace(/^<a /, '<a target="_blank" rel="nofollow" ');
  };

  const imageRenderer = renderer.image;
  renderer.image = function (image) {
    const parsedUrl = parsedSrc(image.href, store.selectSnapshot(PagesState.getCourse));
    const html = imageRenderer.call(this, { ...image, href: parsedUrl });
    return html.replace(/^<a /, '<a target="_blank" rel="nofollow" ');
  };

  const htmlRenderer = renderer.html;
  renderer.html = function (html) {
    const generatedHtml = htmlRenderer.call(this, html);
    return parsedSrc(generatedHtml, store.selectSnapshot(PagesState.getCourse));
  };

  const codeRenderer = renderer.code;
  renderer.code = function (code) {
    const html = codeRenderer.call(this, code);
    return `<div class="code-area" ondblclick="global.writeToClip(this)"><button onclick="global.writeToClip(this.parentNode)">copy</button>${html}</div>`;
  };

  return {
    renderer,
    gfm: true,
    breaks: false,
    pedantic: false,
  };
}
