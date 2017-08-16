/**
 * Created by kk on 2017/8/4.
 */
import Storage from 'react-native-storage';
import React, { Component } from 'react';
import {
    AppRegistry,
    AsyncStorage,
    View,
    TouchableOpacity,
    Text
} from 'react-native';

let storage = new Storage({
    //最大容量，默认值1000条数据循环存储
    size: 1000,

    //存储引擎：RN使用AsyncStorage
    //如果不指定则数据只会保存在内存中，重启后即丢失
    storageBackend: AsyncStorage,

    //数据过期时间，默认一整天（1000 * 3600 * 24 毫秒），设为null则永不过期
    defaultExpires: null,

    //读写时在内存中缓存数据，默认开启
    enableCache: true,

    // 如果storage中没有相应数据，或数据已过期，
    // 则会调用相应的sync方法，无缝返回最新数据。
    // sync方法的具体说明会在后文提到
    // 你可以在构造函数这里就写好sync的方法
    // 或是在任何时候，直接对storage.sync进行赋值修改
    // 或是写到另一个文件里，这里require引入

});
exports.storage = storage;

storage.sync = require('./RNAsyncStorage_asyn').ssss;

// 使用key和id来保存数据，一般是保存同类别（key）的大量数据。
// 所有这些"key-id"数据共有一个保存上限（无论是否相同key）
// 即在初始化storage时传入的size参数。
// 在默认上限参数下，第1001个数据会覆盖第1个数据。
// 覆盖之后，再读取第1个数据，会返回catch或是相应的sync方法。
let userA = {
    name: 'A',
    age: 20,
    tags: [
        'geek',
        'nerd',
        'otaku'
    ]
};

export default class AsyncStorageVc extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: '',

            age: 10
        }
    }
    render() {
        return (
            <View style={{flex: 1, backgroundColor: '#dddddd', alignItems: 'center'}}>

                <Text style={{marginTop: 100, color: 'red'}}>
                    普通存储: {this.state.data}
                </Text>

                <Text style={{marginTop: 20, color: 'red'}}>
                    同步刷新存储 {this.state.age}
                </Text>

                <TouchableOpacity style={{marginTop: 20, width: 60, height: 40, backgroundColor: '#aaaa00'}}
                                  onPress={this._saveData}>
                    <Text>存储数据</Text>
                </TouchableOpacity>

                <TouchableOpacity style={{marginTop: 20, width: 60, height: 40, backgroundColor: '#aa00aa'}}
                                  onPress={this._readData}>
                    <Text>读取数据</Text>
                </TouchableOpacity>

                <TouchableOpacity style={{marginTop: 20, width: 60, height: 40, backgroundColor: '#ffff00'}}
                                  onPress={this._saveData11}>
                    <Text>存储会过期数据</Text>
                </TouchableOpacity>

                <TouchableOpacity style={{marginTop: 20, width: 60, height: 40, backgroundColor: '#aaffaa'}}
                                  onPress={this._readData11}>
                    <Text>读取数据会调用sync</Text>
                </TouchableOpacity>

            </View>
        )
    }

    _saveData =()=> {
        storage.save({
            key: 'loginState',
            data: {
                userid: '111 userid',
            },
        })
    };

    _saveData11 =()=> {
        storage.save({
            key: 'user',  // 注意:请不要在key中使用_下划线符号!
            id: '1001',   // 注意:请不要在id中使用_下划线符号!
            data: userA,
            expires: 1000 * 2
        });
    };

    _readData =()=> {
         storage.load({
             key: 'loginState',
         }).then(ret => {
             // 如果找到数据，则在then方法中返回
             // 注意：这是异步返回的结果（不了解异步请自行搜索学习）
             // 你只能在then这个方法内继续处理ret数据
             // 而不能在then以外处理
             // 也没有办法“变成”同步返回
             // 你也可以使用“看似”同步的async/await语法

             console.log(ret.userid);
             this.setState({ data: ret.userid});
         }).catch(err => {
             //如果没有找到数据且没有sync方法，
             //或者有其他异常，则在catch中返回
             console.warn(err.message);
             switch (err.name) {
                 case 'NotFoundError':
                     // TODO;
                     this.setState({ data: 'NotFoundError' });
                     break;
                 case 'ExpiredError':
                     this.setState({ data: 'ExpiredError' });
                     break;
             }
         })
    };

    _readData11 =()=> {
        //load 读取
        storage.load({
            key: 'user',
            id: '1001',

            // autoSync(默认为true)意味着在没有找到数据或数据过期时自动调用相应的sync方法
            autoSync: true,

            // syncInBackground(默认为true)意味着如果数据过期，
            // 在调用sync方法的同时先返回已经过期的数据。
            // 设置为false的话，则等待sync方法提供的最新数据(当然会需要更多时间)。
            syncInBackground: false,

            // 你还可以给sync方法传递额外的参数
            syncParams: {
                extraFetchOptions: {
                    // 各种参数
                },
                someFlag: true,
            },
        }).then(ret => {
            // 如果找到数据，则在then方法中返回
            console.log('_readData11==' + ret.age);
            this.setState({age: ret.age})
        }).catch(err => {
            // 如果没有找到数据且没有sync方法，
            // 或者有其他异常，则在catch中返回
            console.warn('_readData11 error =' + err.message);
            switch (err.name) {
                case 'NotFoundError':
                    // TODO;
                    break;
                case 'ExpiredError':
                    // TODO
                    break;
            }
        })
    }
}
AppRegistry.registerComponent('AsyncStorageProject', ()=>AsyncStorageVc);