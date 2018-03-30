import formatter from "./formatter";
import linebreak from "./linebreak";

class KPLineBreaker {
  suggestLineBreak(glyphString, width, hyphenationFactor = 0, tolerance = 3) {
    const nodes = formatter(this.measureWidth(glyphString))(glyphString);
    const breaks = linebreak(nodes, [width], { tolerance });
    const breakNode = this.findBreakNode(nodes, breaks[1].position).value;
    const breakPoint = breakNode.end - glyphString.start + 1;

    return { position: breakPoint };
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
