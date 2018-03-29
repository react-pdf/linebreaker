import formatter from "./formatter";
import linebreak from "./linebreak";

class KPLineBreaker {
  suggestLineBreak(glyphString, width, hyphenationFactor = 0, tolerance = 3) {
    const nodes = formatter(word => word.length)(glyphString.string);
    const breaks = linebreak(nodes, [width], { tolerance});

    return breaks[1];
  }
}

export default KPLineBreaker;
