export function keepLastIndex(dom) {
  var range;
  if (window.getSelection) {
    //ie11 10 9 ff safari
    dom.focus(); //解决ff不获取焦点无法定位问题
    range = window.getSelection(); //创建range
    range.selectAllChildren(dom); //range 选择obj下所有子内容
    range.collapseToEnd(); //光标移至最后
  } else if (document.selection) {
    range = document.selection.createRange(); //创建选择对象
    range.moveToElementText(dom); //range定位到obj
    range.collapse(false); //光标移至最后
    range.select();
  }
}

export function getCurrentIndex() {
  var range;
  if (window.getSelection) {
    //ie11 10 9 ff safari
    range = window.getSelection(); //创建range
    return range.focusOffset;
  } else if (document.selection) {
    range = document.selection.createRange(); //创建选择对象
    return range.focusOffset;
  }
}

// 获取当前type类型数字的公共方法
export function getCurrentType(type) {
  let res = 0;
  switch (type) {
    case "article":
      res = 1;
      break;
    case "talk":
      res = 2;
      break;
    case "message":
      res = 3;
      break;
    case "comment":
      res = 4;
  }

  return res;
}
