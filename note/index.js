window.addEventListener('load', function () {
    let add = document.querySelector(".btn_add");
    let clear = document.querySelector(".btn_clear");
    let note_container = document.querySelector(".note_container");
    let noteValues = [];
    let idCounter = 0;
    // 增加新便签
    function addNewNote(value = '', isInit = false) {
        let newNote = document.createElement("textarea");
        newNote.className = 'note';
        newNote.placeholder = "Tap here to edit!";
        newNote.value = value;
        newNote.id = idCounter++;
        if (isInit === false) {
            noteValues = [...noteValues, newNote.value];
            localStorage.setItem("noteValues", noteValues.toString());
        }
        let nodes = document.querySelectorAll(".note");
        newNote.style = 'left:' + (80 * nodes.length) % 800 + 'px; top:' + 20 * nodes.length + 'px';
        // 增加拖动功能
        newNote.addEventListener("mousedown", function (e) {
            let nodes = document.querySelectorAll(".note");
            for (let i = 0; i < nodes.length; i++) {
                nodes[i].style.zIndex = 'auto'
            }
            newNote.style.zIndex = '1'
            let preX = e.pageX; // 获取原来鼠标的 x 轴距离
            let preY = e.pageY; // 获取原来鼠标的 y 轴距离
            let offsetX = parseInt(newNote.style.left); // 获取原来 div 到父容器顶部的 x 轴距离
            let offsetY = parseInt(newNote.style.top); // 获取原来 div 到父容器顶部的 y 轴距离
            if (preY - (offsetY + 120) <= 40) {
                newNote.onmousemove = function (e) {
                    newNote.style.left = offsetX + e.pageX - preX + 'px';
                    newNote.style.top = offsetY + e.pageY - preY + 'px';
                }
                newNote.onmouseup = function () {
                    newNote.onmousemove = null;
                }
            }
        })
        // 增加删除功能
        newNote.addEventListener("dblclick", function (e) {
            let nodes = document.querySelectorAll(".note");
            for (let i = 0; i < nodes.length; i++) {
                nodes[i].style.zIndex = 'auto'
            }
            newNote.style.zIndex = '1'
            let preY = e.pageY; // 获取原来鼠标的 y 轴距离
            let offsetY = parseInt(newNote.style.top); // 获取原来 div 到父容器顶部的 y 轴距离
            if (preY - (offsetY + 120) <= 40) {
                note_container.removeChild(newNote);
                noteValues[newNote.id] = '';
                localStorage.setItem("noteValues", noteValues.toString());
            }
        })
        // 将修改的便签的信息保存到缓存中
        newNote.addEventListener("change", function () {
            noteValues[newNote.id] = newNote.value;
            localStorage.setItem("noteValues", noteValues.toString());
        })
        note_container.appendChild(newNote);
    }
    add.addEventListener("click", function () {
        addNewNote()
    })
    // 清除所有便签
    clear.addEventListener("click", function () {
        let note;
        while (note = document.querySelector(".note")) {
            note_container.removeChild(note)
        }
        noteValues = [];
        localStorage.removeItem("noteValues")
    })
    // 初始化缓存中的便签
    function init() {
        if (localStorage.getItem("noteValues")) {
            noteValues = localStorage.getItem("noteValues").split(",")
            let newNoteValues = [];
            // 过滤掉空便签
            for (let i = 0; i < noteValues.length; i++) {
                if (noteValues[i] === '') { }
                else {
                    newNoteValues = [...newNoteValues, noteValues[i]];
                }
            }
            noteValues = newNoteValues;
            for (let i = 0; i < noteValues.length; i++) {
                addNewNote(noteValues[i], true);
            }
        }
    }
    init();
})