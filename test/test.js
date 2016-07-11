/**
 * Created by bln on 16-7-11.
 */
console.time(1);
try{
    throw new Error();
}catch(e){
    (function(){
        for(var i =0;i<100000000;i++){
            var p = i % 2;
        }
    })()
}
console.timeEnd(1);

console.time(2);
try{
    throw new Error();
}catch(e){
        for(var i =0;i<100000000;i++){
            var p = i % 2;
        }
}
console.timeEnd(2);