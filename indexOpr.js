//打开数据库
const openDB = (indexedDB, inspectDB, userName, version) => {
    //1 打开IndexedDB请求
    let reqDB = indexedDB.open(userName, version);
    //2 打开请求的处理结果，有三种结果：失败、成功、阻止
    //2.1 请求成功
    reqDB.onsuccess = (e) => {
        inspectDB = e.target.result;
        console.log("请求成功" + inspectDB);
    };

    //2.2 请求失败
    reqDB.onerror = (e) => {
    };

    //2.3 请求阻止，打开成功或版本有变化时执行，一般用于初始化数据库
    reqDB.onupgradeneeded = (e) => {
        inspectDB = e.target.result;//获取到数据库实例

        if (!inspectDB.objectStoreNames.contains('inspect')) {
            let inspectStore = inspectDB.createObjectStore('inspect', {
                keyPath: 'id',
                // autoIncrement: true
            });
            console.log("数据库创建成功");
        }
        console.log("进入阻止");
    };
}

//插入数据
const insertDB = (inspectDB, tableName, value) => {
    //创建事务
    let transaction = inspectDB.transaction(tableName, 'readwrite');
    //通过事务获取store
    let inspectStore = transaction.objectStore(tableName);
    //向store种添加数据
    let addInspectRequest = inspectStore.put(value);
    //添加成功
    addInspectRequest.onsuccess = (e) => {
        console.log("===添加成功===" + e.target.result);
    };
    //添加失败
    addInspectRequest.onerror = (e) => {
        console.log("===添加失败===" + e.target.error)
    }
}

//删除数据
const deleteByID = (inspectDB, tableName, id) => {
    //创建事务
    let transaction = inspectDB.transaction(tableName, 'readwrite');
    //通过事务获取store
    let inspectStore = transaction.objectStore(tableName);
    //删除操作
    inspectStore.delete(id).onsuccess = (e) => {
        console.log("删除成功" + e.target.result);
    }
}

//查询数据
const queryByID = (inspectDB, tableName, id) => {
    //创建事务
    let transaction = inspectDB.transaction(tableName, 'readwrite');
    //通过事务获取store
    let inspectStore = transaction.objectStore(tableName);

    let request = inspectStore.get(id);

    request.onsuccess = (e) => {
        console.log("获取成功："+e.target.result.name);
        console.log("获取成功：" + request);
    };
}

//清空数据库数据
const deleteTable = (inspectDB, tableName) => {
    //创建事务
    let transaction = inspectDB.transaction(tableName, 'readwrite');
    //通过事务获取store
    let inspectStore = transaction.objectStore(tableName);

    let request = inspectStore.clear();

    request.onsuccess = (e) => {
        console.log("数据删除完成");
    }
}

//删除并关闭数据库
const shutdownDB = (indexedDB, inspectDB, tableName) => {

    deleteTable(inspectDB,tableName);

    // inspectDB.close();
    //
    let request = indexedDB.deleteDatabase(tableName);
    request.onsuccess = (e) => {
        console.log("数据库删除完成");
    }
}

export {openDB, insertDB, deleteByID, queryByID, deleteTable, shutdownDB}
