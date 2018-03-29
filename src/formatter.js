import linebreak from "./linebreak";

/*!
 * Knuth and Plass line breaking algorithm in JavaScript
 *
 * Licensed under the new BSD License.
 * Copyright 2009-2010, Bram Stein
 * All rights reserved.
 */

const getWords = glyphString => {
	const words = [];
	const { start } = glyphString;
	let lastIndex = 0;

	for (const { index } of glyphString) {

		if (glyphString.isWhiteSpace(index - start)) {
			words.push(glyphString.slice(lastIndex, index - start));
			lastIndex = index - start + 1;
		}
	}

	return words;
}

const formatter = (measureText, options) => {
  const spaceWidth = 10; // measureText(' ');
  const o = {
    space: {
        width: options && options.space.width || 3,
        stretch: options && options.space.stretch || 6,
        shrink: options && options.space.shrink || 9
    }
  };
  // const h = new Hypher(Hypher.en),
  const hyphenWidth = 15; // measureText('-'),
  const hyphenPenalty = 100;

  return (glyphString) => {
    const nodes = [];
    const words = getWords(glyphString);
    const spaceStretch = spaceWidth * o.space.width / o.space.stretch;
    const spaceShrink = spaceWidth * o.space.width / o.space.shrink;

    words.forEach((word, index, array) => {
      // var hyphenated = h.hyphenate(word);
      // if (hyphenated.length > 1 && word.length > 4) {
      //   hyphenated.forEach(function(part, partIndex, partArray) {
      //     nodes.push(linebreak.box(measureText(part), part));
      //     if (partIndex !== partArray.length - 1) {
      //       nodes.push(linebreak.penalty(hyphenWidth, hyphenPenalty, 1));
      //     }
      //   });
      // } else {
      nodes.push(linebreak.box(measureText(word), word));
      // }
      if (index === array.length - 1) {
        nodes.push(linebreak.glue(0, linebreak.infinity, 0));
        nodes.push(linebreak.penalty(0, -linebreak.infinity, 1));
      } else {
        nodes.push(linebreak.glue(spaceWidth, spaceStretch, spaceShrink));
      }
    });
    return nodes;
  }
};

export default formatter;
