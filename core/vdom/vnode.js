export default class VNode {
	// tag-> 标签类型，DIV,SPAN,INPUT,#TEXT
	// elm-> 对应的真实节点，
	// children-> 当前节点下对应子节点
	// text-> 当前节点下的文本
	// data-> VNodeData,暂时保留，暂无意义
	// parent-> 父级节点
	// parent-> 节点类型
	constructor(tag, elm, children, text, data, parent, nodeType) {
		this.tag = tag
		this.elm = elm
		this.children = children
		this.text = text
		this.data = data
		this.parent = parent
		this.nodeType = nodeType
		this.env = {} //当前节点的环境变量
		this.instructions = null //用来存放指令的
		this.template = [] //当前节点涉及到的模板
	}
}