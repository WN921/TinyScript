/**
 * 词法分析工具类，异常处理工具类。表示词法分析阶段出错
 */
class LexicallException extends Error{
    constructor(msg){
        super(msg);
    }
    static fromChar(c){
        return new LexicallException(`unexpected char ${c}`)
    }
}

module.exports = LexicallException;