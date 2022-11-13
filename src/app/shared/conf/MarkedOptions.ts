import { MarkedOptions, MarkedRenderer } from 'ngx-markdown';
import { parsedSrc } from '../pipes/src.pipe';
import { Store } from '@ngxs/store';
import { PagesState } from '../stores/pages/pages.state';

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
    const escapedCode = code
      .replace(/\n/g, '\\n') // line break
      .replace(/"/g, '&quot;') // double quote
      .replace(/'/g, '&quot;'); // single quote
    const strEvent = `new CustomEvent('copy', { bubbles: true, detail: '${escapedCode}' })`;
    return html.replace('<pre>', `<pre ondblclick="this.dispatchEvent(${strEvent});">`);
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
