// this slugify is used in vitepress to generate title id
const rControl = /[\u0000-\u001f]/g
const rSpecial = /[\s~`!@#$%^&*()\-_+=[\]{}|\\;:"'“”‘’<>,.?/]+/g
const rCombining = /[\u0300-\u036F]/g
const slugify = str =>
  str
    .normalize('NFKD')
    .replace(rCombining, '')
    .replace(rControl, '')
    .replace(rSpecial, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/^(\d)/, '_$1')
    .toLowerCase()

let desc = {
  names: ['check-internal-title'],
  description: 'check the internal title is referenced currectly in wiki',
  // information: undefined,
  tags: ['i18n'],
  function: function rule(params, onError) {
    let found_title = new Set()
    function find_titles(token) {
      if (token.children) {
        for (let t of token.children) {
          find_titles(t)
        }
      }

      if (token.type != 'heading_open') {
        return
      }
      if (!token.line.startsWith(token.markup)) {
        console.warn(
          "check-localized-links can't handle the markdown title:" + token.line,
        )
        return
      }
      let title = token.line.substr(token.markup.length)
      while (title.length > 0 && title[0] == ' ') title = title.substr(1)
      found_title.add(slugify(title))
    }
    for (let token of params.parsers.markdownit.tokens) {
      find_titles(token)
    }

    //console.log("founded title in file", found_title)

    function handle(token) {
      if (token.type == 'link_open') {
        let href = token.attrs[0][1]
        if (href.startsWith('#')) {
          let title = href.substr(1)
          if (!found_title.has(decodeURI(title))) {
            onError({
              lineNumber: token.lineNumber,
              detail: 'The title not found in this file: ' + title,
              context: title,
            })
          }
        }
      } else {
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
  },
}

export default desc
