const LinkedList = require("linkedlist");
const CACHE_SIZE = 10;

//公共工具类，将一个迭代器转化为能够peek、回退的迭代器——流
class PeekIterator{
    constructor(it, endToken = null){
        this.it = it;
        //存放需要putBack 的元素
        this.stackPutBacks = new LinkedList();

        //基于时间窗口的缓存
        this.queueCache = new LinkedList();
        //流的结束标志-可选
        this.endToken = endToken;
    }
    peek(){
        if(this.stackPutBacks.length > 0){
            return this.stackPutBacks.tail;
        }
        const val = this.next();
        this.putBack();
        return val;
    }
    putBack(){
        if(this.queueCache.length > 0){
            this.stackPutBacks.push(this.queueCache.pop());
        }
    }
    next(){
        let val = null;

        //根据回退栈中是否有元素来判断从哪获取当前元素
        if(this.stackPutBacks.length > 0){
            val = this.stackPutBacks.pop();
        }else{
            val = this.it.next().value;
            if(val === undefined){
                //如果迭代器已空
                val = this.endToken;
                this.endToken = null;
            }
            
        }


        //如果窗口缓存已满，则移除最旧的值
        while(this.queueCache.length > CACHE_SIZE - 1){
            this.queueCache.shift();
        }
        this.queueCache.push(val);
        return val;
    }


    hasNext(){
        //使用两个！是为了真值转换
        //endToken也是流的一部分，它存在则流未尽
        return this.endToken || !!this.peek();
    }
}

module.exports = PeekIterator;