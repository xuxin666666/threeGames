// 寻路算法
// {...config['w']}:障碍，{...config[' ']}:路

var config = { // 创建方块
    'w': { // 墙
        value: 1, // 方块的值，用以寻找路
        ED: 0, // 欧拉距离
        MD: 0, // 曼哈段距离
        TD: 0, // 两者相加
        parent: [0, 0], // 父节点的坐标
        selected: 0 // 0：未检索 1：放到open中，2：open中忽略，可认为已取出
    },
    ' ': { // 路
        value: 0,
        ED: 0,
        MD: 0,
        TD: 0,
        parent: [0, 0],
        selected: 0 // 1：放到open中，2：放到close中
    }
}

function findWayHard(map, start, end, canAttack){
    map = handleMap(map, config, canAttack)
    return AStar(map, start, end)
}

function AStar(map, start, end){
    var openList = [], current = 0, MaxXSize = map.length, MaxYSize = map[0].length
    var x, y
    openList.push([...start, 0]) // 把起点添加到openlist中
    while(current !== -1 && openList[current].slice(0, 2).toString() !== end.toString()){
        [x, y] = openList[current]
        openList[current][2] = 2 // 2表示已从openlist中忽略
        map[x][y].selected = 2 // 0：未检索 1：放到open中，2：open中忽略
        for(let i = -1; i <= 1; i++){
            for(let j = -1; j <= 1; j++){ // 2个循环，找周围的8个点
                if(i !== 0 && j !== 0) continue // 不能走斜线，只检测周围4格
                if(x+i >= 0 && x+i < MaxXSize && y+j >= 0 && y+j < MaxYSize){ // 如果在地图内
                    if(map[x+i][y+j].value !== config['w'].value && !map[x+i][y+j].selected){ // 如果不是墙且未检索
                        openList.push([x+i, y+j, 0])
                        map[x+i][y+j].parent = [x, y]
                        map[x+i][y+j].ED = EDistance(i, j) + map[x][y].ED
                        map[x+i][y+j].MD = MDistance([x+i, y+j], end)
                        map[x+i][y+j].TD = map[x+i][y+j].ED + map[x+i][y+j].MD
                        map[x+i][y+j].selected = 1
                    } else if (map[x+i][y+j].selected === 1){ // 如果在open中
                        var newED = EDistance(i, j)
                        if(map[x+i][y+j].ED > map[x][y].ED + newED){
                            map[x+i][y+j].parent = [x, y]
                            map[x+i][y+j].ED = newED + map[x][y].ED
                            map[x+i][y+j].TD = map[x+i][y+j].ED + map[x+i][y+j].MD
                        }
                    }
                }
            }
        }
        current = getNextOpenCurrent(openList, map) // 得到下一个要进行循环的点
    }
    if(current === -1) return null

    var fArr = end, path = [end]
    while(fArr.toString() !== start.toString()){ // 从终点反向寻找，添加到路径
        [x, y] = fArr
        fArr = map[x][y].parent
        path.push(fArr)
        
    } 
    return path.reverse()
}

function handleMap(map, config, canAttack){ // 处理地图
    var newMap = []
    for(let i = 0; i < map.length; i++){
        newMap[i] = []
        for(let j = 0; j < map[0].length; j++){
            if(map[i][j] && (
                (!canAttack && map[i][j].type === 'brick')
                || map[i][j].type === 'stone'
                || map[i][j].type === 'water'
            )) {
                newMap[i][j] = {...config['w']}
            } else newMap[i][j] = {...config[' ']}
        }
    }
    return newMap
}

function getNextOpenCurrent(openList, map){
    var flag = -1
    for(let i = 0; i < openList.length; i++){
        if(openList[i][2] === 0){
            if(flag === -1){
                flag = i
            } else {
                var [x, y] = openList[i]
                var [fx, fy] = openList[flag]
                if(map[x][y].TD < map[fx][fy].TD){
                    flag = i
                }
            }
        }
    }
    return flag
}

function EDistance(x, y){ // 计算欧拉距离
    if (x !== 0 && y !== 0)
        return 21;
    else
        return 10;
}

function MDistance(point1, point2){ // 计算曼哈顿距离
    var sum = 0
    var xd = point1[0] - point2[0], yd = point1[1] - point2[1]
    sum = sum + Math.abs(xd) + Math.abs(yd)
    return sum * 10
}

export {findWayHard}