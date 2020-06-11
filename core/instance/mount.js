import VNode from '../vdom/vnode.js'
import {prepareRender, getTemplate2VnodeMap, getVnode2TemplateMap, getVNodeByTemplate, clearMap, renderNode} from './render.js'
import {vmodel} from './grammer/vmodel.js'
import {vforInit} from './grammer/vfor.js'
import {mergeAttr} from '../util/ObjectUtil.js' 
import {checkVBind} from './grammer/vbind.js'

export function initMount(Due) {
	Due.prototype.Smount = function (el) {
		let vm = this
		let rootDom = document.getElementById(el)
		mount(this, rootDom)
	}
}

export function mount(vm, elm) {
	// 进行挂载
	// console.log("begin mount")
	vm._vnode = constructVNode(vm, elm, null)
	// 进行预备渲染(建立渲染索引，通过模板找vnode,通过vnode找模板)
	prepareRender(vm, vm._vnode);
	console.log(getTemplate2VnodeMap())
	console.log(getVnode2TemplateMap())
}

function constructVNode(vm, elm, parent) {//深度优先搜索
	let vnode = analysisAttr(vm, elm, parent)
	if (vnode == null) {
		let children = []
		let text = getNodeText(elm)
		let data = null
		let nodeType = elm.nodeType
		let tag = elm.nodeName
		vnode = new VNode(tag, elm, children, text, data, parent, nodeType)
		if (elm.nodeType == 1 && elm.getAttribute('env')) {
			vnode.env = mergeAttr(vnode.env, JSON.parse(elm.getAttribute('env')))
		} else {
			vnode.env = mergeAttr(vnode.env, parent ? parent.env : {})
		}
	}

	checkVBind(vm, vnode)
	// let childs = vnode.elm.childNodes
	let childs = vnode.nodeType == 0 ? vnode.parent.elm.childNodes : vnode.elm.childNodes
	for (let i = 0; i < childs.length; i++) {
		let childNodes = constructVNode(vm, childs[i], vnode)
		if (childNodes instanceof VNode) { //返回单一节点的时候
			vnode.children.push(childNodes)
		} else { //返回节点数组的时候
			vnode.children = vnode.children.cocat(childNodes)
		}
	}
	return vnode
}

function getNodeText(elm) {
	if (elm.nodeType == 3) {
		return elm.nodeValue
	} else {
		return ''
	}
}


function analysisAttr(vm, elm, parent) {
	if (elm.nodeType == 1) {
		let attrNames = elm.getAttributeNames()
		// console.log(attrNames)
		if (attrNames.indexOf("v-model") > -1) {
			vmodel(vm, elm, elm.getAttribute('v-model'))
		}
		if (attrNames.indexOf('v-for') > -1) {
			return vforInit(vm, elm, parent, elm.getAttribute('v-for'))
		}
	}
}

export function rebuild(vm, template) {
	let virtualNode = getVNodeByTemplate(template);

	for (let i = 0; i < virtualNode.length; i++) {
		virtualNode[i].parent.elm.innerHTML = ""
		virtualNode[i].parent.elm.appendChild(virtualNode[i].elm);
		let result = constructVNode(vm, virtualNode[i].elm, virtualNode[i].parent)
		virtualNode[i].parent.children = [result]
		clearMap()
		prepareRender(vm, vm._vnode)
		// renderNode(vm, vm._vnode);
	}
}