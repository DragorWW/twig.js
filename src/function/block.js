module.exports = function(block) {
  if (this.originalBlockTokens[block]) {
    return Twig.logic.parse.apply(this, [this.originalBlockTokens[block], this.context]).output;
  } else {
    return this.blocks[block];
  }
}