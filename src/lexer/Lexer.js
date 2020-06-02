const PeekIterator = require('../common/PeekIterator');
const Token = require('./Token');
const TokenType = require('./TokenType');
const AlphabetHelper = require('./AlphabetHelper');
const LexicalException = require('./LexicalException');
//词法分析器，analys方法的source参数应该是一个PeekIterator类的实例，即是一个流
class Lexer{
    analyse(source){
        const tokens = [];
        const it = new PeekIterator(source, '\0');
        //while循环不断地取字符，判断，生成对应的token加到tokens数组中。
        while(it.hasNext()){
            let c = it. next();
            if( c == '\0'){
                break;
            }
            let lookahead = it.peek();
            if(c == ' ' || c == '\n'){
                continue;
            }
            //提取注释的程序
            if(c == '/'){
                if(lookahead == '/'){
                    //在有下一个的情况下不断地删除，直到到行末
                    while(it.hasNext() && (c = it.next()) != '\n');
                }
                else if(lookahead == '*'){
                    let valid = false;
                    while(it.hasNext()){
                        const p = it.next();
                        if(p == '*' && it.peek() == '/'){
                            valid = true;
                            it.next();
                            break;
                        }
                    }
                    if(!valid){
                        throw new "comment not matched";
                    }
                    continue;
                }
            }
            if(c == '{' || c == '}' || c == '(' || c == ')'){
                tokens.push(new Token(TokenType.BRACKET, c));
                continue;
            }

            if(c == '"' || c == "'"){
                it.putBack(c);
                tokens.push(Token.makeString(it));
                continue;
            }

            if(AlphabetHelper.isLetter(c)){
                it.putBack(c);
                tokens.push(Token.makeVarOrKeyword(it));
                continue;
            }

            if(AlphabetHelper.isNumber(c)){
                it.putBack(c);
                tokens.push(Token.makeNumber(it));
                continue;
            }

            if((c== '+' || c == '-') && AlphabetHelper.isNumber(lookahead)){
                //这里要筛选带符号的数值，跳过：a + 1等表达式

                const lastToken = tokens[tokens.length - 1] || null;
                if(lastToken == null || !lastToken.isValue()){
                    it.putBack(c);
                    tokens.push(Token.makeNumber(it));
                    continue;
                }
            }

            if(AlphabetHelper.isOperator(c)){
                it.putBack(c);
                tokens.push(Token.makeOp(it));
                continue;
            }
            throw new LexicalException(c);
        }

        return tokens;        
    }
}

module.exports = Lexer;