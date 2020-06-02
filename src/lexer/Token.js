const TokenType = require('./TokenType')
const AlphabetHelper = require('./AlphabetHelper');
const LexicalException = require('./LexicalException');
const Keywords = new Set([
    'var',
    'if',
    'else',
    'for',
    'while',
    'break',
    'func',
    'return'
])
//词法分析工具类
class Token {
    constructor(type, value) {
        this._type = type;
        this._value = value;
    }

    getType() {
        return this._type;
    }
    getValue() {
        return this._value;
    }
    isValue(){
        return this._type == TokenType.INTEGER || this._type == TokenType.FLOAT;
    }
    isVariable() {
        return this._type == TokenType.VARIABLE;
    }
    isScalar() {
        return this._type == TokenType.INTEGER ||
            this._type == TokenType.FLOAT ||
            this._type == TokenType.STRING ||
            this._type == TokenType.BOOLEAN;
    }
    toString() {
        return `type ${thie._type}, value ${this._value}`
    }

    //默认进入方法时已经进行了判断，首字母符合要求
    static makeVarOrKeyword(it) {
        let s = '';
        while (it.hasNext()) {
            const c = it.peek();
            if (AlphabetHelper.isLiteral(c)) {
                s += c;
            }
            else {
                break;
            }
            it.next();
        }

        if (Keywords.has(s)) {
            return new Token(TokenType.KEYWORD, s);
        }
        if (s == 'true' || s == 'false') {
            return new Token(TokenType.BOOLEAN, s);
        }
        return new Token(TokenType.VARIABLE, s);
    }

    //默认使用此方法式已确认是字符串
    static makeString(it) {
        let s = '';
        let state = 0;
        while (it.hasNext()) {
            let c = it.next();

            switch (state) {
                case 0: {
                    if (c == '"') {
                        state = 1;
                    }
                    else {
                        state = 2;
                    }
                    s += c;
                    break;
                }
                case 1: {
                    if (c == '"') {
                        return new Token(TokenType.STRING, s + c);
                    } else {
                        s += c;
                    }
                    break;
                }
                case 2: {
                    if (c == "'") {
                        return new Token(TokenType.STRING, s + c);
                    } else {
                        s += c;
                    }
                    break;
                }
            }
        }
        throw new LexicalException("Unexpextede error");
    }

    static makeOp(it) {
        let state = null;
        while (it.hasNext()) {
            let lookahead = it.next();

            switch (state) {
                case null: {
                    switch (lookahead) {
                        case '+':
                            state = '+';
                            break;
                        case '-':
                            state = "-";
                            break;
                        case '*':
                            state = '*';
                            break;
                        case '/':
                            state = '/';
                            break;
                        case '>':
                            state = '>';
                            break;
                        case '<':
                            state = '<';
                            break;
                        case '=':
                            state = '=';
                            break;
                        case '!':
                            state = '!';
                            break;
                        case '&':
                            state = '&';
                            break;
                        case '|':
                            state = '|';
                            break;
                        case '^':
                            state = '^';
                            break;
                        case '%':
                            state = '%';
                            break;
                        case ',':
                            return new Token(TokenType.OPERATOR, ',');
                        case ';':
                            return new Token(TokenType.OPERATOR, ';');
                    }
                    break;
                }
                case '+': {
                    if (lookahead == '+') {
                        return new Token(TokenType.OPERATOR, '++');
                    }
                    else if (lookahead == '=') {
                        return new Token(TokenType.OPERATOR, '+=');
                    }
                    else {
                        it.putBack(lookahead);
                        return new Token(TokenType.OPERATOR, '+');
                    }
                }
                case '-':
                    if (lookahead == "-") {
                        return new Token(TokenType.OPERATOR, "--");
                    } else if (lookahead == "=") {
                        return new Token(TokenType.OPERATOR, "-=");
                    } else {
                        it.putBack();
                        return new Token(TokenType.OPERATOR, "-");
                    }
                case '*':
                    if (lookahead == "=") {
                        return new Token(TokenType.OPERATOR, "*=");
                    } else {
                        it.putBack();
                        return new Token(TokenType.OPERATOR, "*");
                    }
                case '/':
                    if (lookahead == "=") {
                        return new Token(TokenType.OPERATOR, "/=");
                    } else {
                        it.putBack();
                        return new Token(TokenType.OPERATOR, "/");
                    }
                case '>':
                    if (lookahead == "=") {
                        return new Token(TokenType.OPERATOR, ">=");
                    } else if (lookahead == ">") {
                        return new Token(TokenType.OPERATOR, ">>");
                    } else {
                        it.putBack();
                        return new Token(TokenType.OPERATOR, ">");
                    }
                case '<':
                    if (lookahead == "=") {
                        return new Token(TokenType.OPERATOR, "<=");
                    } else if (lookahead == "<") {
                        return new Token(TokenType.OPERATOR, "<<");
                    } else {
                        it.putBack();
                        return new Token(TokenType.OPERATOR, "<");
                    }
                case '=':
                    if (lookahead == "=") {
                        return new Token(TokenType.OPERATOR, "==");
                    } else {
                        it.putBack();
                        return new Token(TokenType.OPERATOR, "=");
                    }
                case '!':
                    if (lookahead == "=") {
                        return new Token(TokenType.OPERATOR, "!=");
                    } else {
                        it.putBack();
                        return new Token(TokenType.OPERATOR, "!");
                    }
                case '&':
                    if (lookahead == "&") {
                        return new Token(TokenType.OPERATOR, "&&");
                    } else if (lookahead == "=") {
                        return new Token(TokenType.OPERATOR, "&=");
                    } else {
                        it.putBack();
                        return new Token(TokenType.OPERATOR, "&");
                    }
                case '|':
                    if (lookahead == "|") {
                        return new Token(TokenType.OPERATOR, "||");
                    } else if (lookahead == "=") {
                        return new Token(TokenType.OPERATOR, "|=");
                    } else {
                        it.putBack();
                        return new Token(TokenType.OPERATOR, "|");
                    }
                case '^':
                    if (lookahead == "^") {
                        return new Token(TokenType.OPERATOR, "^^");
                    } else if (lookahead == "=") {
                        return new Token(TokenType.OPERATOR, "^=");
                    } else {
                        it.putBack();
                        return new Token(TokenType.OPERATOR, "^");
                    }
                case '%':
                    if (lookahead == "=") {
                        return new Token(TokenType.OPERATOR, "%=");
                    } else {
                        it.putBack();
                        return new Token(TokenType.OPERATOR, "%");
                    }

            }
        }//end while
        throw new LexicalException('Unexpected error');
    }
    
    //所有工厂方法都假定至少第一个字母符合。

    static makeNumber(it){
        let state = 0;
        let s = '';
        let lookahead = null;
        while(it.hasNext()){
            lookahead = it.peek();
            switch(state){
                case 0:{
                    if(lookahead == '0'){
                        state = 1;
                    }
                    else if(AlphabetHelper.isNumber(lookahead)){
                        state = 2;
                    }
                    else if(lookahead == '+' || lookahead =='-'){
                        state = 3;
                    }
                    else if(lookahead == '.'){
                        state = 5;
                    }
                    break;
                }
                case 1:{
                    if(lookahead == '0'){
                        state = 1;
                    }
                    else if(AlphabetHelper.isNumber(lookahead)){
                        state = 2;
                    }
                    else if(lookahead == '.'){
                        state = 4;
                    }
                    else{
                        return new Token(TokenType.INTEGER, s);
                    }
                    break;
                }
                case 2:{
                    if(AlphabetHelper.isNumber(lookahead)){
                        state = 2;
                    }
                    else if(lookahead == '.'){
                        state = 4;
                    }
                    else{
                        return new Token(TokenType.INTEGER, s);
                    }
                    break;
                }
                case 3:{
                    if(AlphabetHelper.isNumber(lookahead)){
                        state = 2;
                    }
                    else if(lookahead == '.'){
                        state = 5;
                    }
                    else{
                        throw LexicalException.fromChar(s);
                    }
                    break;
                }
                case 4:{
                    if(lookahead == '.'){
                        throw LexicalException.fromChar(s);
                    }
                    else if(AlphabetHelper.isNumber(lookahead)){
                        state = 20;
                    }
                    else{
                        return new Token(TokenType.FLOAT, s);
                    }
                    break;
                }
                case 5:{
                    if(AlphabetHelper.isNumber(lookahead)){
                        state = 20;
                    }
                    else{
                        throw LexicalException.fromChar(s);
                    }
                    break;
                }
                case 20:{
                    if(AlphabetHelper.isNumber(lookahead)){
                        state = 20;
                    }
                    else if(lookahead == '.'){
                        throw LexicalException.fromChar(s);
                    }
                    else{
                        return new Token(TokenType.FLOAT, s);
                    }
                    break;
                }

            }
            s += lookahead;
            it.next();
        }//end while
        throw new LexicalException("Unexpected error");

    }
}



module.exports = Token;