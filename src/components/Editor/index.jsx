import EditorJS from '@editorjs/editorjs';

import React, { useEffect } from "react";
import Embed from '@editorjs/embed'
import Table from '@editorjs/table'
import List from '@editorjs/list'
import Warning from '@editorjs/warning'
import Code from '@editorjs/code'
import LinkTool from '@editorjs/link'
import Image from '@editorjs/image'
import Raw from '@editorjs/raw'
import Header from '@editorjs/header'
import Quote from '@editorjs/quote'
import Marker from '@editorjs/marker'
import CheckList from '@editorjs/checklist'
import Delimiter from '@editorjs/delimiter'
import InlineCode from '@editorjs/inline-code'
import SimpleImage from '@editorjs/simple-image'
// import Emojis from '../Emojis';
import  "../../g.scss"

import s from "./index.module.scss"
const users = [
    {
        id: 'walter',
        display: 'Walter White',
    },
    {
        id: 'pipilu',
        display: '皮皮鲁',
    },
    {
        id: 'luxixi',
        display: '鲁西西',
    },
    {
        id: 'satoshi1',
        display: '中本聪',
    },
    {
        id: 'satoshi2',
        display: 'サトシ・ナカモト',
    },
    {
        id: 'nobi',
        display: '野比のび太',
    },
    {
        id: 'sung',
        display: '성덕선',
    },
    {
        id: 'jesse',
        display: 'Jesse Pinkman',
    },
    {
        id: 'gus',
        display: 'Gustavo "Gus" Fring',
    },
    {
        id: 'saul',
        display: 'Saul Goodman',
    },
    {
        id: 'hank',
        display: 'Hank Schrader',
    },
    {
        id: 'skyler',
        display: 'Skyler White',
    },
    {
        id: 'mike',
        display: 'Mike Ehrmantraut',
    },
    {
        id: 'lydia',
        display: 'Lydìã Rôdarté-Qüayle',
    },
]
class MentionTool  {

    state = {
        curIpt: "sadsa",
        position: {
            x: 0,
            y: 0
        },
        queryString: "",
        showDialog: false,


    }

    curListInfo = users

    curChooseInfo = {}

    constructor({ data, api }) {
        this.api = api;
        this.renderElement = this.createContain()
    }

    // 创建容器
    createContain() {
        const wrapper = document.createElement("div");
        const input = document.createElement("input");
        const span = document.createElement("span");
        wrapper.classList.add("mention-r");
        span.innerHTML = "@"
        // wrapper.contentEditable = true
        // input.value = ""
        // wrapper.addEventListener("change",this.handleKeyUp);
        // wrapper.addEventListener("keyDown",this.handleKeyDown);
        input.addEventListener("input", this.change);
        input.classList.add("mention-ipt");
        input.addEventListener("blur", this.blur);
        wrapper.appendChild(span)
        wrapper.appendChild(input)

        return wrapper;
    }

    change=(e) =>{
        console.log(e.target.value)
        console.log("showAt")
        const content = e.target.value || ""
        if(content) {
            this.curListInfo = users.filter(user => user.display.includes(content))
            console.log("curListInfo",this.curListInfo)
            this.createUserList();
        }else {
            const target = this.renderElement.querySelector(".user-list")
            if(target!=null) {
                target.parentNode.removeChild(target);
            } 
        }
    }

    // 失去焦点时进行隐藏操作
    blur=(e) =>{
        const target = this.renderElement.querySelector(".user-list")
        if(target!=null) {
         setTimeout(() => {
            target.parentNode.removeChild(target);
         }, 200);
        } 
    }

    userListItemClick=(e,it)=>{
        this.renderElement.querySelector(".mention-ipt").value = e.target.innerText;
        this.curChooseInfo = it;
    }

    createUserListItem(it) {
        const item =  document.createElement("div")
        item.classList.add("user-item")
        item.innerText = it.display;
        item.addEventListener("click", (e)=>this.userListItemClick(e,it));
        return item;
    }

    createUserList() {
        const target = this.renderElement.querySelector(".user-list")
        console.log("target",target)
        // 没有 说明是第一次创建
        if(target==null) {
            const list =  document.createElement("div")
            list.classList.add("user-list")
            this.curListInfo.forEach((it)=>{
                list.appendChild(this.createUserListItem(it))
            })
            this.renderElement.appendChild(list);
        }else {
            target.parentNode.removeChild(target);
            // 这里是更新用户信息
            const list =  document.createElement("div")
            list.classList.add("user-list")
            this.curListInfo.forEach((it)=>{
                list.appendChild(this.createUserListItem(it))
            })
            this.renderElement.appendChild(list);
        }
    }




    // 渲染子菜单 进行@内容筛选
    // renderSettings() {
    //     const wrapper = document.createElement('div');

    //     users.forEach(tune => {
    //         let button = document.createElement('div');

    //         // button.classList.add('cdx-settings-button');
    //         button.innerHTML = tune.display;
    //         wrapper.appendChild(button);
    //     });

    //     return wrapper;
    // }


    // 菜单栏
    static get toolbox() {
        return {
            title: '@Person',
            icon: '<svg t="1700552852600" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1466" width="200" height="200"><path d="M910.933333 689.066667c-51.2 83.2-123.733333 134.4-211.2 166.4-66.133333 25.6-138.666667 34.133333-209.066666 29.866666-72.533333-4.266667-147.2-23.466667-211.2-64s-110.933333-100.266667-136.533334-170.666666c-21.333333-74.666667-19.2-155.733333 0-228.266667 21.333333-70.4 59.733333-134.4 110.933334-185.6 59.733333-57.6 132.266667-93.866667 211.2-108.8 68.266667-12.8 140.8-10.666667 206.933333 6.4 57.6 14.933333 104.533333 40.533333 142.933333 85.333333 36.266667 40.533333 61.866667 89.6 68.266667 145.066667 6.4 57.6-4.266667 117.333333-29.866667 170.666667-34.133333 70.4-98.133333 136.533333-174.933333 172.8-10.666667 4.266667-23.466667 6.4-32 2.133333-4.266667-4.266667-8.533333-10.666667-6.4-21.333333 19.2-142.933333 61.866667-260.266667 113.066667-401.066667 4.266667-10.666667-6.4-32-27.733334-38.4-21.333333-8.533333-36.266667 4.266667-38.4 8.533333-2.133333 8.533333-19.2 51.2-25.6 74.666667-12.8-32-38.4-61.866667-68.266666-78.933333-34.133333-19.2-74.666667-23.466667-113.066667-14.933334-42.666667 8.533333-81.066667 29.866667-110.933333 59.733334-70.4 72.533333-117.333333 168.533333-113.066667 268.8 2.133333 59.733333 21.333333 117.333333 66.133333 157.866666 38.4 36.266667 87.466667 46.933333 138.666667 34.133334 46.933333-12.8 85.333333-40.533333 117.333333-76.8v34.133333c0 21.333333 8.533333 40.533333 25.6 55.466667 14.933333 12.8 36.266667 17.066667 66.133334 10.666666 102.4-25.6 204.8-128 253.866666-226.133333 27.733333-57.6 36.266667-125.866667 29.866667-187.733333-6.4-61.866667-27.733333-119.466667-66.133333-170.666667-46.933333-64-106.666667-100.266667-183.466667-121.6-78.933333-21.333333-160-25.6-243.2-10.666667-98.133333 17.066667-185.6 64-253.866667 134.4C149.333333 258.133333 106.666667 330.666667 85.333333 409.6c-25.6 87.466667-25.6 183.466667 8.533334 270.933333 29.866667 74.666667 81.066667 142.933333 149.333333 189.866667 72.533333 49.066667 162.133333 70.4 249.6 76.8 89.6 6.4 181.333333-6.4 264.533333-40.533333 70.4-29.866667 134.4-74.666667 187.733334-142.933334 8.533333-12.8 23.466667-40.533333 19.2-55.466666-12.8-34.133333-44.8-32-53.333334-19.2zM618.666667 456.533333c-10.666667 68.266667-44.8 140.8-93.866667 183.466667-23.466667 23.466667-49.066667 38.4-72.533333 46.933333-27.733333 8.533333-55.466667 6.4-76.8-6.4s-38.4-38.4-49.066667-78.933333c-17.066667-70.4 6.4-151.466667 42.666667-209.066667 25.6-38.4 64-74.666667 108.8-89.6 46.933333-14.933333 93.866667-2.133333 123.733333 36.266667 21.333333 32 23.466667 81.066667 17.066667 117.333333z" fill="#2c2c2c" p-id="1467"></path></svg>'
        };
    }

    render() {
        return this.renderElement;
    }

    save(blockContent) {
        console.log("blockContent",this.curChooseInfo,blockContent)
        return this.curChooseInfo;
    }

    handleKeyDown = (e) => {
        if (this.state.showDialog) {
            if (
                e.code === "ArrowUp" ||
                e.code === "ArrowDown" ||
                e.code === "Enter"
            ) {
                e.preventDefault();
            }
        }
    };

    // 获取光标位置
    getCursorIndex = () => {
        const selection = window.getSelection();
        return selection?.focusOffset;
    };

    // 获取节点
    getRangeNode = () => {
        const selection = window.getSelection();
        return selection?.focusNode;
    };

    getRangeRect = () => {
        const selection = window.getSelection();
        const range = selection?.getRangeAt(0);
        const rect = range.getClientRects()[0];
        const LINE_HEIGHT = 30;
        return {
            x: rect.x,
            y: rect.y + LINE_HEIGHT
        };
    };

    // 是否展示 @
    showAt = () => {
        console.log("showAt")
        const node = this.getRangeNode();
        if (!node || node.nodeType !== Node.TEXT_NODE) return false;
        const content = node.textContent || "";
        const regx = /@([^@\s]*)$/;
        const match = regx.exec(content.slice(0, this.getCursorIndex()));
        return match && match.length === 2;
    };

    // 获取 @ 用户
    getAtUser = () => {
        const content = getRangeNode()?.textContent || "";
        const regx = /@([^@\s]*)$/;
        const match = regx.exec(content.slice(0, getCursorIndex()));
        if (match && match.length === 2) {
            return match[1];
        }
        return undefined;
    };

    handleKeyUp = (e) => {
        console.log("handleKeyUp")
        if (this.showAt()) {
            const position = this.getRangeRect();
            const user = this.getAtUser();
            this.setState({
                position,
                queryString: user || "",
                showDialog: true
            })
        } else {
            this.setState({
                showDialog: false
            })
        }
    };
}

let editorInstance = null;
export default function Editor() {

    useEffect(() => {
        if (!editorInstance) {
            editorInstance = new EditorJS({
                holder: 'myEdi',
                tools: {
                    header: Header,
                    image: SimpleImage,
                    list: List,
                    checklist: CheckList,
                    quote: Quote,
                    warning: Warning,
                    marker: Marker,
                    code: Code,
                    delimiter: Delimiter,
                    inlineCode: InlineCode,
                    linkTool: LinkTool,
                    embed: Embed,
                    table: Table,
                    mention: {
                        class: MentionTool,
                    },
                },
                placeholder: 'Let`s write an awesome story!',
                readOnly: false,
                onReady: () => { console.log('Editor.js is ready to work!') },
                onChange: (api, event) => {
                    console.log('Now I know that Editor\'s content changed!', event)
                }
            });
        }

        return () => {
            if (editorInstance) {
                console.log("editorInstance.current", editorInstance)
                if (editorInstance.destroy) {
                    editorInstance.destroy();
                }
            }
        };
    }, [])

    const save = () => {
        editorInstance.save().then((outputData) => {
            console.log('Article data: ', outputData)
        }).catch((error) => {
            console.log('Saving failed: ', error)
        });
    }

    return <div className={s.wrapper}>
        <div onClick={save} className={s.btn}>保存</div>
        <div id="myEdi"></div>
    </div>
}