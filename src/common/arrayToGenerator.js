//公共工具类，将数组转化为生成器
function * arrayToGenerator(arr){
    for(let i = 0; i < arr.length; i++){
        yield arr[i];
    }
}
module.exports = arrayToGenerator;