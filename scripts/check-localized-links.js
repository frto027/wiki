let desc = {
  names: ['check-localized-links'],
  description: 'check the localized version is used in the BSMG markdown file',
  // information: undefined,
  tags: ['i18n'],
  function: function rule(params, onError) {
    function handle(token) {
      if (token.type == 'link_open') {
        // console.log(token)
        let href = token.attrs[0][1]
        if (
          href.startsWith('/') ||
          href.startsWith('./') ||
          href.startsWith('../')
        ) {
        }
      } else {
        // console.log(token)
        if (token.children) {
          for (let t of token.children) {
            handle(t)
          }
        }
      }
    }

    for (let token of params.parsers.markdownit.tokens) {
      handle(token)
    }
    // console.log(params)
    // onError({"lineNumber":0})
    // return;
    // params.parsers.markdownit.tokens.filter(function filterToken(token) {
    //   return token.type === "blockquote_open";
    // }).forEach(function forToken(blockquote) {
    //   var lines = blockquote.map[1] - blockquote.map[0];
    //   onError({
    //     "lineNumber": blockquote.lineNumber,
    //     "detail": "Blockquote spans " + lines + " line(s).",
    //     "context": blockquote.line.substr(0, 7)
    //   });
    // });
  },
}

export default desc
