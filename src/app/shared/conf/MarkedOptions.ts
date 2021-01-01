import { MarkedOptions, MarkedRenderer } from 'ngx-markdown';

// function that returns `MarkedOptions` with renderer override
export function markedOptionsFactory(): MarkedOptions {
  const renderer = new MarkedRenderer();

  const linkRenderer = renderer.link;
  renderer.link = (href, title, text) => {
    const html = linkRenderer.call(renderer, href, title, text);
    return html.replace(/^<a /, '<a target="_blank" rel="nofollow" ');
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
