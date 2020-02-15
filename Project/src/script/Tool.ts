export module tools {
    /**
     * 
     * @param n 
     * @param m 第二个随机数不存在的话默认为10
     */
    export function random(n: number, m?: number) {
        m = m || 10;
        const c: number = m - n + 1;
        return Math.floor(Math.random() * c + n)
    }
    /**
     * 
     * @param arr 
     * @param count
     * 从数组中随机取出count个数 
     */
    export function getRandomArrayElements(arr, count) {
        var shuffled = arr.slice(0), i = arr.length, min = i - count, temp, index;
        while (i-- > min) {
            index = Math.floor((i + 1) * Math.random());
            temp = shuffled[index];
            shuffled[index] = shuffled[i];
            shuffled[i] = temp;
        }
        return shuffled.slice(min);
    }
    export function getArrayDifElements(arr, count): any {
        const result = [];
        let i: number = 0;
        for (i; i < count; i++) {
            const temp = getDiffEle(arr.slice(), result, i);
            result.push(temp);
        }
        return result;
    }
    export function getDiffEle(arr, result, place) {
        let indexArr = [];
        let i: number = 0;
        for (i; i < arr.length - place; i++) {
            indexArr.push(i);
        }
        const ranIndex = Math.floor(Math.random() * indexArr.length);
        if (result.indexOf(arr[ranIndex]) === -1) {
            const backNum = arr[ranIndex];
            arr[ranIndex] = arr[indexArr.length - 1];
            return backNum;
        } else {
            arr.splice(ranIndex, 1);
            return getDiffEle(arr, result, place);
        }
    }
    export let roleDragCan: boolean = false;
    export function copydata(obj): any {
        const ret = {};
        Object.getOwnPropertyNames(obj).forEach(name => {
            ret[name] = obj[name];
        });
        return ret;
    }

    /**
     * 数组复制 
     */
    export function fillArray(value, len) {
        var arr = [];
        for (var i = 0; i < len; i++) {
            arr.push(value);
        }
        return arr;
    }

    /**
     * 
     * @param angle 角度
     * @param XY 必须包含y上的速度
     */
    export function speedByAngle(angle: number, XY: any) {
        if (angle % 90 === 0 || !angle) {
            console.error("计算的角度异常,需要查看：", angle);
            // debugger
            return;
        }
        let speedXY = { x: 0, y: 0 };
        speedXY.y = XY.y;
        speedXY.x = speedXY.y / Math.tan(angle * Math.PI / 180);
        return speedXY;
    }
    export function speedXYByAngle(angle: number, speed: number) {
        if (angle % 90 === 0 || !angle) {
            //debugger
        }
        const speedXY = { x: 0, y: 0 };
        speedXY.x = speed * Math.cos(angle * Math.PI / 180);
        speedXY.y = speed * Math.sin(angle * Math.PI / 180);
        return speedXY;
    }

    export function speedLabelByAngle(angle: number, speed: number, speedBate?: number) {
        // if (angle % 90 === 0 || !angle) {
        //     debugger
        // }
        const speedXY = { x: 0, y: 0 };
        const selfAngle = angle;
        const defaultSpeed = speed;
        const bate = speedBate || 1;
        if (selfAngle % 90 === 0) {
            if (selfAngle === 0 || selfAngle === 360) {
                speedXY.x = Math.abs(defaultSpeed) * bate;
            } else if (selfAngle === 90) {
                speedXY.y = Math.abs(defaultSpeed) * bate;
            } else if (selfAngle === 180) {
                speedXY.x = -Math.abs(defaultSpeed) * bate;
            } else {
                speedXY.y = -Math.abs(defaultSpeed) * bate;
            }
        } else {
            const tempXY = tools.speedXYByAngle(selfAngle, defaultSpeed);
            speedXY.x = tempXY.x;
            speedXY.y = tempXY.y;
            if (selfAngle > 0 && selfAngle < 180) {
                speedXY.y = Math.abs(speedXY.y) * bate;
            } else {
                speedXY.y = -Math.abs(speedXY.y) * bate;
            }
            if (selfAngle > 90 && selfAngle < 270) {
                speedXY.x = -Math.abs(speedXY.x) * bate;
            } else {
                speedXY.x = Math.abs(speedXY.x) * bate;
            }
        }
        return speedXY;
    }
    /**
     * 
     * @param degree 角度
     * 根据角度计算弧度
     */
    export function getRad(degree) {
        return degree / 180 * Math.PI;
    }
    /**
     * 求圆上的点的坐标~
     */
    export function getRoundPos(angle: number, radius: number, centPos: any) {
        var center = centPos; //圆心坐标
        var radius = radius; //半径
        var hudu = (2 * Math.PI / 360) * angle; //90度角的弧度

        var X = center.x + Math.sin(hudu) * radius; //求出90度角的x坐标
        var Y = center.y - Math.cos(hudu) * radius; //求出90度角的y坐标
        return { x: X, y: Y };
    }
    /**
     * 转化大的数字
     */
    export function converteNum(num: number): string {
        if (typeof (num) !== "number") {
            console.warn("要转化的数字并不为number");
            return num;
        }
        let backNum: string;

        if (num < 1000) {
            backNum = "" + num;
        } else if (num < 1000000) {
            backNum = "" + (num / 1000).toFixed(1) + "k";
        } else if (num < 10e8) {
            backNum = "" + (num / 1000000).toFixed(1) + "m";
        } else {
            backNum = "" + num;
        }
        return backNum;
    }

}
export default tools;