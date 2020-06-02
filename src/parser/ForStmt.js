const Stmt = require('./Stmt');
const ASTNodeTypes = require('./ASTNodeType');
class ForStmt extends Stmt{
    constructor(parent){
        super(parent, ASTNodeTypes.FOR_STMT, 'for');
    }
}

module.exports = ForStmt;