import english from 'hyphenation.en-us';
import Hypher from 'hypher';
import linebreak from "./linebreak";

const SOFT_HYPHEN = '\u00AD';

const getWords = glyphString => {
	const words = [];
	const { start } = glyphString;
	let lastIndex = 0;

	for (const { index } of glyphString) {
		if (glyphString.isWhiteSpace(index - start)) {
			const word = glyphString.slice(lastIndex, index - start);

			if (word.length > 0) {
				words.push(word);
			}

			lastIndex = index - start + 1;
		}
	}

	if (lastIndex < glyphString.end) {
		const word = glyphString.slice(lastIndex, glyphString.end - glyphString.start);
		words.push(word);
	}

	return words;
}

const h = new Hypher(english);

const hyphenateString = (string) => {
	if (string.includes(SOFT_HYPHEN)) {
		return string.split(SOFT_HYPHEN)
	}

	return h.hyphenate(string);
}

const hyphenate = (glyphString) => {
	const hyphenated = hyphenateString(glyphString.string);

	let index = 0;
	const parts = hyphenated.map(part => {
		const res = glyphString.slice(index, index + part.length);
		index += part.length
		return res;
	});

	return parts;
}

const formatter = (measureText, options = {}) => {
  const spaceWidth = measureText(' ');
	const hyphenWidth = measureText('-');
	const hyphenPenalty = 100;
  const opts = {
    width: options.width || 3,
    stretch: options.stretch || 6,
    shrink: options.shrink || 9
  };

  return (glyphString) => {
    const nodes = [];
    const words = getWords(glyphString);
    const spaceStretch = spaceWidth * opts.width / opts.stretch;
    const spaceShrink = spaceWidth * opts.width / opts.shrink;

    words.forEach((word, index, array) => {
      const hyphenated = hyphenate(word);

      if (hyphenated.length > 1 && word.string.length > 4) {
        hyphenated.forEach((part, partIndex, partArray) => {
					const isLastPart = partIndex === hyphenated.length - 1;

          nodes.push(linebreak.box(measureText(part), part, !isLastPart));

          if (partIndex !== partArray.length - 1) {
            nodes.push(linebreak.penalty(hyphenWidth, hyphenPenalty, 1));
          }
        });
      } else {
      	nodes.push(linebreak.box(measureText(word), word));
      }
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
