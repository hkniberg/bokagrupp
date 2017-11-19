/**
 * Generates a field with an href link
 * @param linkFunction a function that takes the field object and returns {href: ..., text: ...}
 */
export function linkField(key, label, linkFunction) {
  return {
    key: key,
    label: label,
    fn: function (value, object, key) {
      const linkInfo = linkFunction(object)
      if (linkInfo && linkInfo.text) {
        let sortKey = null
        if (Number(linkInfo.text)) {
          //This is a nifty little trick to make sure that
          //numbers are sorted as numbers, not as strings.
          sortKey = 100000000000 + Number.parseFloat(linkInfo.text)
        } else {
          sortKey = (" " + linkInfo.text).toLowerCase()
        }

        //We include the <!-- ... --> in the beginning to make sorting work
        return new Spacebars.SafeString(
          `<!-- ${sortKey} --> <a href="${linkInfo.href}">${linkInfo.text}</a>`
        )
      } else {
        return ""
      }
    }
  }
}
