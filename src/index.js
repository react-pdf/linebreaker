import formatter from "./formatter";
import linebreak from "./linebreak";

const HYPHEN = 0x002d;

class KPLineBreaker {
  constructor(callback, tolerance) {
    this.tolerance = tolerance || 3;
    this.callback = callback;
  }

  suggestLineBreak(glyphString, width) {
    const nodes = formatter(
      this.measureWidth(glyphString),
      this.callback,
    )(glyphString);
    const breaks = linebreak(nodes, [width], { tolerance: this.tolerance });

    if (!breaks[1]) {
      return { position: glyphString.end };
    }

    const breakNode = this.findBreakNode(nodes, breaks[1].position);
    let breakIndex = breakNode.value.end - glyphString.start + 1;

    if (breakNode.hyphenated) {
      glyphString.insertGlyph(breakIndex, HYPHEN);
      breakIndex += 1;
    }

    return { position: breakIndex };
  }

  measureWidth(glyphString) {
    const { font, fontSize } = glyphString.glyphRuns[0].attributes;

    return word => {
      if (typeof word  === 'string') {
        const scale = fontSize / font.unitsPerEm;
        return font.layout(word).positions[0].xAdvance * scale;
      }

      return word.advanceWidth;
    };
  }

  findBreakNode(nodes, position) {
    let index = position - 1;

    while (!nodes[index].value) {
      index -= 1;
    }

    return nodes[index];
  }
}

export default KPLineBreaker;
