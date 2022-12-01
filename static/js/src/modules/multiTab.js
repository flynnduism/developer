const { el, mount, text, list, setChildren, setStyle, setAttr } = redom

class codeblockLanguageTab {
    constructor(parentCallback) {
        this.index
        this.parentCallback = parentCallback
        this.lang = el("a")
        this.el = el("li", {
            onclick: function (e) {
                parentCallback(this.index)
            }.bind(this)
        }, this.lang)
    }
    update(data, index, items, context) {
        this.index = index
        this.lang.textContent = data
        if (context.active == this.index) {
            this.lang.classList.add("is-active")
        } else {
            this.lang.classList.remove("is-active")
        }
    }
}

class multiTabBlockHandler {
    constructor(nodes, tabClass, parentCallback) {
        this.tabClass = tabClass
        this.parentCallback = parentCallback
        this.active = 0
        this.nodes = Array.from(nodes)
        this.langs = this.nodes.map(k => { return k.dataset.title })
        this.tabs = list("ul", codeblockLanguageTab, null, this.ChildEventHandler.bind(this))
        this.el = el("div.tabs.is-boxed", this.tabs)

        this.tabs.update(this.langs, { active: 0 })
        this.updateTabContent(this.active)
    }
    ChildEventHandler(data) {
        this.tabs.update(this.langs, { active: data })
        this.updateTabContent(data)
        this.parentCallback(this.tabClass, this.langs[data])
    }
    updateTabContent(data) {
        for (let i = 0; i < this.nodes.length; i++) {
            setStyle(this.nodes[i], { display: i == data ? "block" : "none" })
        }
    }
    globalTabUpdate(data) {
        let activeIndex = this.langs.indexOf(data)
        this.tabs.update(this.langs, { active: activeIndex })
        this.updateTabContent(activeIndex)
    }
}

class multiTabContentHandler {
    constructor() {
        this.selectedTab = {
            os: null,
            code: null,
        }
        this.handler = []
        let multiTabBlocks = document.querySelectorAll("div.multitab-content-wrapper")
        multiTabBlocks.forEach((multiTabBlock, index) => {
            let tabs = multiTabBlock.querySelectorAll("div.multitab-content")
            this.handler[index] = {}
            this.handler[index].class = multiTabBlock.dataset.class.toLowerCase()
            this.handler[index].tabBlock = new multiTabBlockHandler(tabs, this.handler[index].class, this.updateTabs.bind(this) )
            multiTabBlock.insertBefore(this.handler[index].tabBlock.el, multiTabBlock.firstChild);
        })
    }
    updateTabs(tabClass, value) {
        this.handler.map(k => {
            if (k.class == tabClass) {
                k.tabBlock.globalTabUpdate(value)
            }
        })
    }
}

export { multiTabContentHandler }