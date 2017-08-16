/**
 * Created by kk on 2017/8/4.
 */

let aaa = require('./RNAsyncStorage');
let storage = aaa.storage;

ssss = {
    // sync方法的名字必须和所存数据的key完全相同
    // 方法接受的参数为一整个object，所有参数从object中解构取出
    // 这里可以使用promise。或是使用普通回调函数，但需要调用resolve或reject。
    user(params){
        let { id, resolve, reject, syncParams: { extraFetchOptions, someFlag } } = params;
        console.log('aaaaaaaaaaaaaa' + JSON.stringify(params));
        //{"id":"1001","syncParams":{"extraFetchOptions":{},"someFlag":true}}
        fetch('http://localhost:9010/storage', {
            method: 'GET',
            // body: 'id=' + id,
            ...extraFetchOptions,
        }).then(response => {
            console.log('fetch数据11 === ' + JSON.stringify(response));
            return response.json();
        }).then(json => {
            //{"name":"B","age":18,"tags":["geek1","nerd1","otaku1"]}
            console.log('fetch数据22 === ' + JSON.stringify(json));
            if(json){
                storage.save({
                    key: 'user',
                    id,
                    data: json,
                    expires: 1000 * 6
                });

                if (someFlag) {
                    // 根据syncParams中的额外参数做对应处理
                }
                console.log('resolve = ' + resolve, resolve);
                // 成功则调用resolve
                resolve && resolve(json);
            }
            else{
                // 失败则调用reject
                reject && reject(new Error('data parse error'));
            }
        }).catch(err => {
            console.warn('bbbbbbbb' + err);
            reject && reject(err);
        });
    }
};

exports.ssss = ssss;