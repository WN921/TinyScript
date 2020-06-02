const Stmt = require('./Stmt');
const ASTNodeTypes = require('./ASTNodeType');
class DeclareStmt extends Stmt{
    constructor(parent){
        super(parent, ASTNodeTypes.DECLARE_STMT, 'declare');
    }
}

module.exports = DeclareStmt;