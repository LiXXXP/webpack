// import _ from 'lodash';
import './css/index.css';
// import './css/style.less';
document.querySelector('#app').innerHTML='aaa';
import logo from './images/confirm.png';
import x from './images/close.png';
// import $ from 'jquery';
require("expose-loader?$!jquery");
console.log($(window));
let img=new Image();
img.src=logo;
document.body.appendChild(img);
if (module.hot) {
    module.hot.accept();
}