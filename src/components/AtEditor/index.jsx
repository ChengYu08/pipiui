
import { useEffect, useRef, useState } from "react";

import s from "./index.module.scss";
const mockData = [
    {
        name: "张一鸣",
        id: "zhangyiming"
    },
    {
        name: "张一鸣",
        id: "whatthehell"
    },
    {
        name: "马化腾",
        id: "ponyma"
    },
    {
        name: "马云",
        id: "jackmasb"
    }
];
export default function AtEditor() {
    const divRef = useRef(null);

    const [queryString, setQueryString] = useState("");

    const [queryUsersList, setQueryUsersList] = useState([]);
    const [showDialog, setShowDialog] = useState(false);
    const [position, setPosition] = useState({
        x: 0,
        y: 0,
    });

    // 是否展示 @
    const showAt = () => {
        const node = getRangeNode();
        console.log("node",node)
        if (!node || node.nodeType !== Node.TEXT_NODE) return false;
        const content = node.textContent || "";
        const regx = /@([^@\s]*)$/;
        const match = regx.exec(content.slice(0, getCursorIndex()));
        // 正则来匹配是否输入的 包含@ 
        return match && match.length === 2;
    };


    // 获取节点
    const getRangeNode = () => {
        const selection = window.getSelection();
        console.log("is ",selection ,divRef.current);
        return divRef.current.lastChild;
        // return selection?.focusNode;
    };

    // 获取光标位置
    const getCursorIndex = () => {
        const selection = window.getSelection();
        return selection?.focusOffset;
    };

    // 返回 弹窗的位置
    const getRangeRect = () => {
        const selection = window.getSelection();
        const range = selection?.getRangeAt(0);
        const rect = range.getClientRects()[0];
        const LINE_HEIGHT = 30;
        return {
            x: rect.x,
            y: rect.y + LINE_HEIGHT
        };
    };

    useEffect(() => {
        if (queryString.length > 0) {
            setQueryUsersList(mockData.filter((v) => {
                return v.name.indexOf(queryString) != -1;
            }))
        } else {
            setQueryUsersList([])
        }
    }, [queryString]);

    const handleKeyUp = (e) => {
        console.log("handleKeyUp")
        if (showAt()) {
            const position = getRangeRect();
            setPosition(position);
            const user = getAtUser();
            setQueryString(user || "");
            setShowDialog(true);
        } else {
            setShowDialog(false);
        }
    };

    const replaceString = (raw, replacer) => {
        return raw.replace(/@([^@\s]*)$/, replacer);
    };

    // 创建标签
    const createAtButton = (user) => {
        const btn = document.createElement("span");
        btn.style.display = "inline-block";
        btn.dataset.user = JSON.stringify(user);
        btn.className = "at-button";
        btn.contentEditable = "false";
        btn.textContent = `@${user.name}`;
        const wrapper = document.createElement("span");
        wrapper.style.display = "inline-block";
        wrapper.contentEditable = "false";
        const spaceElem = document.createElement("span");
        spaceElem.style.whiteSpace = "pre";
        spaceElem.textContent = "\u200b";
        spaceElem.contentEditable = "false";
        const clonedSpaceElem = spaceElem.cloneNode(true);
        wrapper.appendChild(spaceElem);
        wrapper.appendChild(btn);
        wrapper.appendChild(clonedSpaceElem);
        return wrapper;
    };

    const replaceAtUser = (user) => {
        const node = getRangeNode();
        console.log("node",node)
        if (node) {
            const content = node?.textContent || "";
            const endIndex = getCursorIndex();
            const preSlice = replaceString(content.slice(0, endIndex), "");
            console.log("endIndex",endIndex);
            const restSlice = content.slice(endIndex);
            const parentNode = node?.parentNode;
            const nextNode = node?.nextSibling;
            const previousTextNode = new Text(preSlice);
            const nextTextNode = new Text("\u200b" + restSlice);
            const atButton = createAtButton(user);
            parentNode.removeChild(node);
            if (nextNode) {
                parentNode.insertBefore(previousTextNode, nextNode);
                parentNode.insertBefore(atButton, nextNode);
                parentNode.insertBefore(nextTextNode, nextNode);
            } else {
                parentNode.appendChild(previousTextNode);
                parentNode.appendChild(atButton);
                parentNode.appendChild(nextTextNode);
            }

            //  指向最后
            const range = new Range();
            range.setStart(nextTextNode, 0);
            range.setEnd(nextTextNode, 0);
            const selection = window.getSelection();
            selection?.removeAllRanges();
            selection?.addRange(range);
            console.log("执行了")
        }
    };

    // 获取 @ 用户
    const getAtUser = () => {
        const content = getRangeNode()?.textContent || "";
        const regx = /@([^@\s]*)$/;
        const match = regx.exec(content.slice(0, getCursorIndex()));
        if (match && match.length === 2) {
            return match[1];
        }
        return undefined;
    };

    const handleKeyDown = (e) => {
        console.log("showDialog", showDialog)
        if (showDialog) {
            if (
                e.code === "ArrowUp" ||
                e.code === "ArrowDown" ||
                e.code === "Enter"
            ) {
                e.preventDefault();
            }
        }
    };

    // 失去焦点事件
    const handleBlur = (e) => {
        console.log("失去焦点",e.relatedTarget);
    }

    return (
        <div>
            <AtDialog users={queryUsersList}

                chooseItem={(user) => {
                    if (user) {
                        replaceAtUser(user);
                        setQueryUsersList([]);
                    }
                }} />
            <div
                ref={divRef}
                className={s.editor}
                contentEditable={true}
                onBlur={handleBlur}
                onKeyUp={handleKeyUp}
                onKeyDown={handleKeyDown}
            > </div>
        </div>
    );
}


function AtDialog(props) {
    const { users = [] } = props;
    return <div className={s.wrapper}>
        {
            users.length > 0 &&
            users.map((user, i) => {
                return (
                    <div
                        key={user.id}
                        className={s.userItem}
                        onClick={() => {
                            props.chooseItem && props.chooseItem(user);
                        }}
                    >
                        <div className="name">{user.name}</div>
                        <div className="id">{user.id}</div>
                    </div>
                );
            })

        }
    </div>

}