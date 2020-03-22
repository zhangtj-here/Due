import {renderData} from './render.js'

function constructObjectProxy(vm, obj, namespace) {
	let proxyObj = {}
	for (let prop in obj) {
		Object.defineProperty(proxyObj, prop, {
			configurable: true,
			enumber: true,
			get () {
				return obj[prop]
			},
			set (newValue) {
				console.log(getNameSpace(namespace, prop))
				obj[prop] = newValue
				renderData(vm, getNameSpace(namespace, prop))
			}
		})
		Object.defineProperty(vm, prop, {
			configurable: true,
			enumber: true,
			get () {
				return obj[prop]
			},
			set (newValue) {
				console.log(getNameSpace(namespace, prop))
				obj[prop] = newValue
				renderData(vm, getNameSpace(namespace, prop))
			}
		})
		if (obj[prop] instanceof Object) {
			proxyObj[prop] = constructProxy(vm, obj[prop], getNameSpace(namespace, prop))
		}
	}

	return proxyObj
}

const arrayProto = Array.prototype
function defArrayFunc(obj, func, namespace, vm) {
	Object.defineProperty(obj, func, {
		enumerable: true,
		configurable: true,
		value: function (...args) {
			let original = arrayProto[func]
			const result = original.apply(this, args)
			console.log(getNameSpace(namespace, ""))
			return result
		}
	})
}

function constructArrayProxy(vm, arr, namespace) {
	let obj = {
		eleType: "Array",
		toString: function () {
			let result = "";
			for (let i = 0; i < arr.length; i ++) {
				result += arr[i] + ", ";
			}
			return result.substring(0, result.length -2)
		},
		push() {

		},
		pop() {

		},
		shift() {

		},
		unshift() {

		}
	}
	defArrayFunc.call(vm, obj, 'push', namespace, vm)
	defArrayFunc.call(vm, obj, 'pop', namespace, vm)
	defArrayFunc.call(vm, obj, 'shift', namespace, vm)
	defArrayFunc.call(vm, obj, 'unshift', namespace, vm)
	arr.__proto__ = obj
	return arr
}


// 我们知道页面上的哪个属性被修改了，我们才能对页面上的内容进行更新
// 所以我们必须先能够捕获修改的这个事件
// 所以我们需要用用代理的方式来实现监听属性修改
export function constructProxy(vm, obj, namespace) { //vm代表due对象，obj表示要代理的对象
	// 递归
	let proxyObj = null
	if (obj instanceof Array) { //判断这个对象是否为数组
		let proxyObj = new Array(obj.length)
		for (let i = 0,len = obj.lenth; i < len; i++) {
			proxyObj[i] = constructProxy(vm, obj[i], namespace)
		}
		proxyObj = constructArrayProxy(vm, obj, namespace)
		return proxyObj
	} else if (obj instanceof Object) { //判断这个对象是否为对象
		proxyObj = constructObjectProxy(vm, obj, namespace)
	} else {
		throw new Error("error")
	}
	return proxyObj
}


function getNameSpace(nowNameSpace, nowProp) {
	if (nowNameSpace == null || nowNameSpace == "") {
		return nowProp
	} else if (nowProp == null || nowProp == "") {
		return nowNameSpace
	} else {
		return nowNameSpace + '.' + nowProp
	}
}