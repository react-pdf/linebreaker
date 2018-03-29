import formatter from "./formatter";
import linebreak from "./linebreak";

class KPLineBreaker {
  suggestLineBreak(glyphString, width, hyphenationFactor = 0, tolerance = 3) {
    const nodes = formatter(word => word.advanceWidth)(glyphString);
    const breaks = linebreak(nodes, [width], { tolerance });
    const breakNode = nodes[breaks[1].position - 1].value;
    const breakPoint = breakNode.end - glyphString.start + 1;

    return { position: breakPoint };
  }
}

export default KPLineBreaker;
