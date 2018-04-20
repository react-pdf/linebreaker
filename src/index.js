import { LineBreaker } from '@react-pdf/textkit';
import formatter from "./formatter";
import linebreak from "./linebreak";

const HYPHEN = 0x002d;
const TOLERANCE_LIMIT = 40;

const fallbackLinebreaker = new LineBreaker();

class KPLineBreaker {
  constructor(callback, tolerance) {
    this.tolerance = tolerance || 4;
    this.callback = callback;
  }

  suggestLineBreak(glyphString, width) {
    let tolerance = this.tolerance;
    const measuredWidth = this.measureWidth(glyphString);
    const nodes = formatter(measuredWidth, this.callback)(glyphString);
    let breaks = [];

    // Try again with a higher tolerance if the line breaking failed.
    while (breaks.length === 0 && tolerance < TOLERANCE_LIMIT) {
      breaks = linebreak(nodes, [width], { tolerance });
      tolerance += 2;
    }

    // Fallback to textkit default's linebreaking algorithm if K&P fails
    if (breaks.length === 0) {
      return fallbackLinebreaker.suggestLineBreak(glyphString, width);
    }

    if (!breaks[1]) {
      return { position: glyphString.end };
    }

    const breakNode = this.findBreakNode(nodes, breaks[1].position);
    const breakIndex = breakNode.value.end - glyphString.start;

    if (breakNode.hyphenated) {
      glyphString.insertGlyph(breakIndex, HYPHEN);
    }

    return { position: breakIndex + 1 };
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
