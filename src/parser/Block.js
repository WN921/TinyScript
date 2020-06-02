const Stmt = require('./Stmt');
const ASTNodeTypes = require('./ASTNodeType');
class Block extends Stmt{
    constructor(parent){
        super(parent, ASTNodeTypes.BLOCK, 'block');
    }
}

module.exports = Block;