import { Heading } from '@tiptap/extension-heading';

export const TocHeading = Heading.extend({
  name: 'heading',
  addAttributes() {
    return {
      ...this.parent?.(),
      id: {
        default: null,
        parseHTML: (element) => element.getAttribute('id'),
        renderHTML: (attributes) => {
          if (!attributes.id) {
            attributes.id = getUuid();
          }
          return { id: attributes.id };
        },
      },
    };
  },
});

function getUuid() {
  let s = [];
  let hexDigits = '0123456789abcdef';
  for (let i = 0; i < 36; i++) {
    s[i] = hexDigits.substring(
      Math.floor(Math.random() * 0x10),
      Math.floor(Math.random() * 0x10) + 1
    );
  }
  s[14] = '4'; // bits 12-15 of the time_hi_and_version field to 0010
  s[19] = hexDigits.substring((parseInt(s[19], 16) & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
  s[8] = s[13] = s[18] = s[23] = ''; // -
  return s.join('').substring(0, 6);
}

export default Heading;
