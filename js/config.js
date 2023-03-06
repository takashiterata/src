jQuery.noConflict();

var  listCnt =0;
var  gproperties =[];
const MAX_TAB = 20;
const MIN_TAB = 1;
(function($, PLUGIN_ID) {
  'use strict';

  FncListTable(PLUGIN_ID);  //API呼び出しで、同期解除の為別関数で呼び出し　動的配列も関数内で設定する。

  //固定オブジェクトはここで宣言
  let $form = $('.js-submit-settings');
  let $cancelButton = $('.js-cancel-button');
  //let $message = $('.js-text-message');
  //固定オブジェクト（配列）はここで宣言

  // if (!($form.length > 0 && $cancelButton.length > 0 && $message.length > 0)) {
  //   throw new Error('Required elements do not exist.');
  // }
  let config = kintone.plugin.app.getConfig(PLUGIN_ID);

  if (config.tabselect) {  //格納設定値セット
    //$message.val(config.message);
    // $tabselect.val(config.tabselect);
  }
  $form.on('submit', function(e) {
    var aa = kintone.plugin.app.getConfig(PLUGIN_ID);
  
    e.preventDefault();
    //配列の設定↓ *プラグインの設定値は配列を格納できないので文字列連結でsplit;
    let $tabselect2any = $('.tab-select2');
    let $tabselect2 = "";
    let tabflg =0;
    let $tabCount = JSON.stringify(document.getElementsByClassName('tab-area').length);
    for(let i=0;i<$tabselect2any.length;i++){
      $tabselect2 += $tabselect2any[i].value + '@44';
      tabflg = 1;
    }
    if(tabflg == 0){
      $tabselect2 = '@44';
    }
    const tabAreaCount = document.getElementsByClassName("tab-area").length;
    let tabsetany = [];
    for(let i=0;i<=tabAreaCount;i++){
      let tabboxname='tabbox' + i;
      for(let ii=1;ii<=document.getElementById(tabboxname).childElementCount;ii++){
        let iii = ii-1;
        let i4 = Math.floor(ii / 2)-1;
        if(document.getElementById(tabboxname).children[iii].id.includes("Vitem")){
          continue;
        }
        
        let rowcc = document.getElementById(tabboxname).children[iii].id.replace('item','');
        tabsetany[rowcc] = i+'--'+i4;
      }
    }
    let tabboxname='tabbox999';
    for(let i=1;i<=document.getElementById(tabboxname).childElementCount;i++){
      let ii = i -1;
      let i4 = Math.floor(i / 2)-1;
      if(document.getElementById(tabboxname).children[ii].id.includes("Vitem")){
        continue;
      }
      let rowcc = document.getElementById(tabboxname).children[ii].id.replace('item','');
      tabsetany[rowcc] = '999'+'--'+i4;
    }
    
    let $tabset = "";
    for(let i=1;i<tabsetany.length;i++){
      $tabset += tabsetany[i] + '@44';
    }
    //配列の設定↑
    //Configへ値のセット
    kintone.plugin.app.setConfig({
      tabselect: $tabCount
      ,tabselect2: $tabselect2
      ,tabset: $tabset
    }, function() {
    
      alert('プラグインの設定が保存されました。 アプリの更新をしてください！');
      window.location.href = '../../flow?app=' + kintone.app.getId();
    });
  });
  $cancelButton.on('click', function() {
    window.location.href = '../../' + kintone.app.getId() + '/plugin/';
  });
})(jQuery, kintone.$PLUGIN_ID);


//移動対象のリストを取得
async function FncListTable(PLUGIN_ID){
  try{
    let config = kintone.plugin.app.getConfig(PLUGIN_ID);
    const ListTable = document.getElementById("ListTable");
    //フォームの設定情報
    let { layout } = await kintone.api(
      kintone.api.url('/k/v1/app/form/layout.json', true),
      'GET',
      { app: kintone.app.getId() }
    );
    //フォームの設定情報
    let { properties } = await kintone.api(
      kintone.api.url('/k/v1/app/form/fields.json', true),
      'GET',
      { app: kintone.app.getId() }
    );
    gproperties = properties;

    let devSpace = document.createElement('dev');
    let tabini = 0;
    if(config.tabselect){
      tabini = config.tabselect;
    }

    var isHiddenDelete = '';
    var isHiddenAdd = '';
    if (MAX_TAB === Number(tabini)) {
      isHiddenAdd = 'is-hidden';
    } else if (MIN_TAB === Number(tabini)) {
      var isHiddenDelete = 'is-hidden';
    }


    let HtmlInnerVal='';
    HtmlInnerVal += '<table style="font-size: 16px;width:100%;background-color:#f5f5f5;"><tr><td style="width:50%;">TOP</td><td style="width:50%;" id="tabname">';
    let tabselect2val = [];  //配列戻し用の変数もここで宣言
    //配列戻し
    if(config.tabselect2){
      tabselect2val = config.tabselect2.split('@44');
    }else if(tabselect2val.length == 0){
      for(let i=0;i<tabini;i++){
        tabselect2val[i] = '';
      }
    }

    // タブが一つもない場合
    if (tabini === 0) {
      HtmlInnerVal += '<div id="tab_1" class="tab-area">';
      HtmlInnerVal += '<div><span class="delete-button '+ isHiddenDelete +'" onclick="FncDeleteTab(1)"">ー</span>';
      HtmlInnerVal += '<span class="add-button" onclick="FncAddTab()">＋</span></div>';
      HtmlInnerVal += '<input type="text" id="aaButton_1" class="tab-select2" value="" onclick="FncTabonclick(1)"style="width:70px;border-radius:10px 10px 0px 0px;background-color:#f5f5f5;padding: 1px 6px;text-align:center;" maxlength="20" placeholder="タブ">'
      HtmlInnerVal += '<span id="input-value_1" class="input-value-span"></span></div>';
      HtmlInnerVal += '</div>'
    }

    for(let i=1;i<=tabini;i++){
      let ii=i-1;
      HtmlInnerVal += '<div id="tab_' + i + '" class="tab-area">';
      HtmlInnerVal += '<div><span class="delete-button '+ isHiddenDelete +'" onclick="FncDeleteTab('+ i +')">ー</span>';
      HtmlInnerVal += '<span class="add-button '+ isHiddenAdd +'" onclick="FncAddTab()">＋</span></div>';
      HtmlInnerVal += '<input type="text" id="aaButton_' + i + '" class="tab-select2" value="'+ tabselect2val[ii] +'" onclick="FncTabonclick('+ i +')"style="width:70px;border-radius:10px 10px 0px 0px;background-color:#f5f5f5;padding: 1px 6px;text-align:center;" maxlength="20" size="'+tabselect2val[ii].length+'">'
      HtmlInnerVal += `<span id="input-value_${i}" class="input-value-span">${tabselect2val[ii]}</span></div>`;
      HtmlInnerVal += '</div>'
    }
    HtmlInnerVal += '<input type="text" id="aaButton_0" class="tab-select3" value="ボトム" onclick="FncTabonclick(999)" style="width:70px;border-radius:10px 10px 0px 0px;background-color:#f5f5f5;padding: 1px 6px;text-align:center;" readonly>';
    HtmlInnerVal += '</td></tr>';
    HtmlInnerVal += '<tr><td>';
    HtmlInnerVal += '<div class="grid">';
    HtmlInnerVal += '<div class="box box1" id="tabbox0" style="width:100%;">';

    listCnt =layout.length;

    let tabsetval = [];
    if(config.tabset){
      tabsetval = config.tabset.split('@44');
    }

    let tabsetvalTop =[];
    for(let i =0;i<layout.length;i++){
      if(i>=tabsetval.length-1){
        continue;
      }
      let ii = i +1;
      let tabsetval2 = tabsetval[i].split('--');
      if(tabsetval2[0] == '0'){
        tabsetvalTop[tabsetval2[1]] = '<div class="Vitem" id="Vitem' + ii +'"></div>';
        tabsetvalTop[tabsetval2[1]] += '<div class="item" draggable="true" id="item' + ii +'">' +ii + '行目';
        if(layout[i]['type'] == 'SUBTABLE'){
          tabsetvalTop[tabsetval2[1]] += '<div class="pplb" style="">'+gproperties[layout[i]['code']].label+'<br>';
          for(let i4=0;i4 <layout[i]['fields'].length;i4++){
            tabsetvalTop[tabsetval2[1]] += FncClehtml(layout[i]['fields'][i4],layout[i]['type'],layout[i]['code']);
          }
          tabsetvalTop[tabsetval2[1]] += '</div>';
        }else if(layout[i]['type'] == 'GROUP'){
          tabsetvalTop[tabsetval2[1]] += 'GROUP:'+gproperties[layout[i]['code']]['label'];
          tabsetvalTop[tabsetval2[1]] += '<div class="" style="">';
          for(let i4=0;i4 <layout[i]['layout'].length;i4++){
            for(let i5=0;i5 <layout[i]['layout'][i4]['fields'].length;i5++){
              tabsetvalTop[tabsetval2[1]] += FncClehtml(layout[i]['layout'][i4]['fields'][i5]);
            }
          }
          tabsetvalTop[tabsetval2[1]] += '</div>';
        }else{
          tabsetvalTop[tabsetval2[1]] += '<div class="" style="">';
          for(let i4=0;i4 <layout[i]['fields'].length;i4++){
            tabsetvalTop[tabsetval2[1]] += FncClehtml(layout[i]['fields'][i4]);
          }
          tabsetvalTop[tabsetval2[1]] += '</div>';
        }
        tabsetvalTop[tabsetval2[1]] += '</div>';
      }
    }
    for(let i=0;i<tabsetvalTop.length;i++){
      HtmlInnerVal +=tabsetvalTop[i];
    }

    for(let i =0;i<layout.length;i++){  //未設定の行
      let ii = i +1;
      if(i >=  tabsetval.length-1){
        HtmlInnerVal += '<div class="Vitem" id="Vitem' + ii +'"></div>';
        HtmlInnerVal += '<div class="item" draggable="true" id="item' + ii +'">' +ii + '行目';
        if(layout[i]['type'] == 'SUBTABLE'){
          HtmlInnerVal += '<div class="pplb" style="">'+gproperties[layout[i]['code']].label+'<br>';
          for(let i4=0;i4 <layout[i]['fields'].length;i4++){
            HtmlInnerVal += FncClehtml(layout[i]['fields'][i4],layout[i]['type'],layout[i]['code']);
          }
          HtmlInnerVal += '</div>';
        }else if(layout[i]['type'] == 'GROUP'){
          HtmlInnerVal += 'GROUP:'+gproperties[layout[i]['code']]['label'];
          HtmlInnerVal += '<div class="" style="">';
          for(let i4=0;i4 <layout[i]['layout'].length;i4++){
            for(let i5=0;i5 <layout[i]['layout'][i4]['fields'].length;i5++){
              HtmlInnerVal += FncClehtml(layout[i]['layout'][i4]['fields'][i5]);
            }
          }
          HtmlInnerVal += '</div>';
        }else{
          HtmlInnerVal += '<div class="" style="">';
          for(let i4=0;i4 <layout[i]['fields'].length;i4++){
            HtmlInnerVal += FncClehtml(layout[i]['fields'][i4]);
          }
          HtmlInnerVal += '</div>';
        }
        HtmlInnerVal += '</div>';
      }
    }

    HtmlInnerVal += '</div>';
    HtmlInnerVal += '</div>';
    HtmlInnerVal += '</td><td>';
    HtmlInnerVal += '<div id="movetabbox" class="grid">';

    if (tabini === 0) {
      HtmlInnerVal += '<div class="box box2" id="tabbox1" style="width:100%;"></div>';
    }

    for(let i=1;i<=tabini;i++){
      HtmlInnerVal += '<div class="box box2 tab-box-mid" id="tabbox'+i+'" style="width:100%;">';
      let tabsetvalmid =[];
      for(let ii =0;ii<layout.length;ii++){
        if(ii>=tabsetval.length-1){
          continue;
        }
          let iii = ii +1;
        let tabsetval2 = tabsetval[ii].split('--');
        if(tabsetval2[0] == i){
          tabsetvalmid[tabsetval2[1]] = '<div class="Vitem" id="Vitem' + iii +'"></div>';
          tabsetvalmid[tabsetval2[1]] += '<div class="item" draggable="true" id="item' + iii +'">' +iii + '行目';
          if(layout[ii]['type'] == 'SUBTABLE'){
            tabsetvalmid[tabsetval2[1]] += '<div class="pplb" style="">'+gproperties[layout[ii]['code']].label+'<br>';
            for(let i4=0;i4 <layout[ii]['fields'].length;i4++){
              tabsetvalmid[tabsetval2[1]] += FncClehtml(layout[ii]['fields'][i4],layout[ii]['type'],layout[ii]['code']);
            }
            tabsetvalmid[tabsetval2[1]] += '</div>';
          }else if(layout[ii]['type'] == 'GROUP'){
            tabsetvalmid[tabsetval2[1]] += 'GROUP:'+gproperties[layout[ii]['code']]['label'];
            tabsetvalmid[tabsetval2[1]] += '<div class="" style="">';
            for(let i4=0;i4 <layout[ii]['layout'].length;i4++){
              for(let i5=0;i5 <layout[ii]['layout'][i4]['fields'].length;i5++){
                tabsetvalmid[tabsetval2[1]] += FncClehtml(layout[ii]['layout'][i4]['fields'][i5]);
              }
            }
            tabsetvalmid[tabsetval2[1]] += '</div>';
          }else{
            tabsetvalmid[tabsetval2[1]] += '<div class="" style="">';
            for(let i4=0;i4 <layout[ii]['fields'].length;i4++){
              tabsetvalmid[tabsetval2[1]] += FncClehtml(layout[ii]['fields'][i4]);
            }
            tabsetvalmid[tabsetval2[1]] += '</div>';
          }
          tabsetvalmid[tabsetval2[1]] += '</div>';
        }
      }
      for(let ii=0;ii<tabsetvalmid.length;ii++){
        HtmlInnerVal +=tabsetvalmid[ii];
      }
      HtmlInnerVal += '</div>';
    }
    HtmlInnerVal += '<div class="box box2" id="tabbox999" style="width:100%;">';
    let tabsetvalBtm =[];
    for(let i =0;i<layout.length;i++){
      let ii = i +1;
      if(i>=tabsetval.length-1){
        continue;
      }
      let tabsetval2 = tabsetval[i].split('--');
      if(tabsetval2[0] == '999'){
        tabsetvalBtm[tabsetval2[1]] = '<div class="Vitem" id="Vitem' + ii +'"></div>';
        tabsetvalBtm[tabsetval2[1]] += '<div class="item" draggable="true" id="item' + ii +'">' +ii + '行目';
        if(layout[i]['type'] == 'SUBTABLE'){
          tabsetvalBtm[tabsetval2[1]] += '<div class="pplb" style="">'+gproperties[layout[i]['code']].label+'<br>';
          for(let i4=0;i4 <layout[i]['fields'].length;i4++){
            tabsetvalBtm[tabsetval2[1]] += FncClehtml(layout[i]['fields'][i4],layout[i]['type'],layout[i]['code']);
          }
          tabsetvalBtm[tabsetval2[1]] += '</div>';
        }else if(layout[i]['type'] == 'GROUP'){
          tabsetvalBtm[tabsetval2[1]] += 'GROUP:'+gproperties[layout[i]['code']]['label'];
          tabsetvalBtm[tabsetval2[1]] += '<div class="" style="">';
          for(let i4=0;i4 <layout[i]['layout'].length;i4++){
            for(let i5=0;i5 <layout[i]['layout'][i4]['fields'].length;i5++){
              tabsetvalBtm[tabsetval2[1]] += FncClehtml(layout[i]['layout'][i4]['fields'][i5]);
            }
          }
          tabsetvalBtm[tabsetval2[1]] += '</div>';
        }else{
          tabsetvalBtm[tabsetval2[1]] += '<div class="" style="">';
          for(let i4=0;i4 <layout[i]['fields'].length;i4++){
            tabsetvalBtm[tabsetval2[1]] += FncClehtml(layout[i]['fields'][i4]);
          }
          tabsetvalBtm[tabsetval2[1]] += '</div>';
        }
        tabsetvalBtm[tabsetval2[1]] += '</div>';
      }
    }
    for(let i=0;i<tabsetvalBtm.length;i++){
      HtmlInnerVal +=tabsetvalBtm[i];
    }

    HtmlInnerVal += '</div>';
    HtmlInnerVal += '</div>';
    HtmlInnerVal += '</td></tr>';
    HtmlInnerVal += '</table>';
    devSpace.innerHTML = HtmlInnerVal;
    ListTable.appendChild(devSpace); 

  } catch (error) {  //エラー処理
  
    window.alert("エラーが発生した為、処理をキャンセルしました。\n" + error.message);
  } finally {  //後処理
    FncDragiven();
    FncMoveheight();
    FncTabonclick(1);
    SetTabWidthIni();

    const inputTab = document.getElementsByClassName("tab-select2");
    for (let i = 0;i < inputTab.length; i++) {
      inputTab[i].addEventListener('input', SetTabWidthInput);
    }
  }
}

function FncDragiven(e){
  // アイテムのリストを取得
  const items = [...document.querySelectorAll(".item")];
  // ドラッグ開始イベントを定義
  const handleDragStart = (e) => {
    e.target.classList.add("dragging");
    // ドロップ効果の設定
    e.dataTransfer.effectAllowed = "move";
    // 転送するデータの設定
    const { id } = e.target;
    e.dataTransfer.setData("application/json", JSON.stringify({ id }));
  };

  // ドラッグ終了イベントを定義
  const handleDragEnd = (e) => e.target.classList.remove("dragging");
  // アイテムにイベントを登録
  for (const item of items) {
    item.addEventListener("dragstart", handleDragStart, false);
    item.addEventListener("dragend", handleDragEnd, false);
  }

  // 要素が重なった際のイベントを定義
  const handleDragEnter = (e) => {
    // 子要素へのドラッグを制限
    if ([...e.target.classList].includes("item")) {
      return;
    }
    if(e.target.id.includes("tabbox") || e.target.id.includes("Vitem")){
      e.target.classList.add("over");
    }else{
      return;
    }
  };

  // 要素が離れた際のイベントを定義
  const handleDragLeave = (e) => e.target.classList.remove("over");

  // 要素が重なっている最中のイベントを定義
  const handleDragOver = (e) => {
    // 要素が重なった際のブラウザ既定の処理を変更
    e.preventDefault();
    // 子要素へのドラッグを制限
    if ([...e.target.classList].includes("item")) {
      // ドラッグ不可のドロップ効果を設定
      e.dataTransfer.dropEffect = "none";
      return;
    }
    // ドロップ効果の設定
    e.dataTransfer.dropEffect = "move";
  };

  // 要素がドロップされた際のイベントを定義
  const handleDrop = (e) => {
    // 要素がドロップされた際のブラウザ既定の処理を変更
    e.preventDefault();
    e.target.classList.remove("over");

    // ブラウザ外からのファイルドロップを制限
    if (e.dataTransfer.files.length > 0) {
      return;
    }
    // 転送データの取得
    const { id } = JSON.parse(e.dataTransfer.getData("application/json"));
    if(e.target.id.includes("tabbox")){
    // ドロップ先に要素を追加する
    e.target.appendChild(document.getElementById("V" + id));
    e.target.appendChild(document.getElementById(id));
    }else if(e.target.id.includes("Vitem")){
      let CitmeID = e.target.id;
      let VitmeID = document.getElementById(e.target.id).parentElement.id;
      let Objtabbox = document.getElementById(VitmeID);
      let ObjtabboxC = [];
      let ObjtabboxCnt = Objtabbox.childElementCount;

      for(let i=0;i<Objtabbox.childElementCount;i++){
        ObjtabboxC[i] = Objtabbox.children[i].id;
      }
      for(let i=0;i<ObjtabboxCnt;i++){
        if(id == ObjtabboxC[i]){
          continue;
        }
        if("V" + id == ObjtabboxC[i]){
          continue;
        }

        if(CitmeID == ObjtabboxC[i]){
        Objtabbox.appendChild(document.getElementById("V" + id));
        Objtabbox.appendChild(document.getElementById(id));
        }
        Objtabbox.appendChild(document.getElementById(ObjtabboxC[i]));
      }
    }else{
      return;
    }
    FncMoveheight();
  };

  // ドロップ先のリストを取得
  const boxes = [...document.querySelectorAll(".box")];
  // ドロップ先にイベントを登録
  for (const box of boxes) {
    box.addEventListener("dragenter", handleDragEnter, false);
    box.addEventListener("dragleave", handleDragLeave, false);
    box.addEventListener("dragover", handleDragOver, false);
    box.addEventListener("drop", handleDrop, false);
  }
}

function FncMoveheight(e){
  const tabAreaCount = document.getElementsByClassName("tab-area").length;
  let Objtabbox=[];
  Objtabbox[0] =document.getElementById("tabbox0");
  for(let i=1;i<=tabAreaCount;i++){
    let tabboxname='tabbox' + i;
    Objtabbox[i] = document.getElementById(tabboxname);
  }
  let fincnt = Number(tabAreaCount) + 1;
  Objtabbox[fincnt] =document.getElementById("tabbox999");

  let maxheight =0;
  for(let i=0;i<Objtabbox.length;i++){
    let boxheight=0;
    let dispFlg=0;
    if(Objtabbox[i].style.display == ''){
      dispFlg=1;
    }else{
      Objtabbox[i].style.display = '';      
    }

    for(let ii=0;ii<Objtabbox[i].childElementCount;ii++){
      boxheight += Objtabbox[i].children[ii].clientHeight+1;
    }
    if(dispFlg== 0){
      Objtabbox[i].style.display = 'none';      
    }
    boxheight += 20;
    if(boxheight > maxheight){
      maxheight =boxheight
    }
  }
  for(let i=0;i<Objtabbox.length;i++){
      Objtabbox[i].style.height = maxheight+'px';
  }
}

function FncTabonclick(ini){
  const tabAreaCount = document.getElementsByClassName('tab-area').length;
  let Objtabbox=[];
  Objtabbox[0] =document.getElementById("tabbox0");
  let Objtabbtn=[];
  for(let i=1;i<=tabAreaCount;i++){
    let tabboxname='tabbox' + i;
    let tabboxbtan='aaButton_' + i;
    if(i==ini){
      document.getElementById(tabboxname).style.display='';
      document.getElementById(tabboxbtan).style.background = '#f0f0f0';
    }else{
      document.getElementById(tabboxname).style.display='none';
      document.getElementById(tabboxbtan).style.background = '#969998';
    }
  }
  if(999 == ini || tabAreaCount == '0'){
    document.getElementById('tabbox999').style.display='';
    document.getElementById('aaButton_0').style.background = '#f0f0f0';
  }else{
    document.getElementById('tabbox999').style.display='none';
    document.getElementById('aaButton_0').style.background = '#969998';
  }
}

/**
 * 選択中のタブを削除する
 */
function FncDeleteTab(index) {

  const tabAreaLengthIni = document.getElementsByClassName('tab-area').length;
  const isHideAddButton = (MAX_TAB === tabAreaLengthIni)?? false;

  document.getElementById(`tab_${index}`).remove();
  document.getElementById(`tabbox${index}`).remove();
  
  const tabAreaElements = document.getElementsByClassName('tab-area');
  for (let i = 0; i < tabAreaElements.length; i++) {
    tabAreaElements[i].setAttribute('id', `tab_${i + 1}`);

    var deleteButton = tabAreaElements[i].querySelector('.delete-button');
    deleteButton.setAttribute('onClick', `FncDeleteTab(${i + 1})`);

    var input = tabAreaElements[i].querySelector('input');
    input.setAttribute('onClick', `FncTabonclick(${i + 1})`);
    input.setAttribute('id', `aaButton_${i + 1}`);
  
  }

  const tabBoxMidElements = document.getElementsByClassName('tab-box-mid');
  for (let i = 0; i < tabBoxMidElements.length; i++) {
    tabBoxMidElements[i].setAttribute('id', `tabbox${i + 1}`);
  }

  if (isHideAddButton) {
    const addButtons = document.getElementsByClassName('add-button');
    for (let i = 0; i < addButtons.length; i++) {
      addButtons[i].classList.remove('is-hidden');
    }
  }

  if (MIN_TAB === tabAreaElements.length) {
    displayFirstDeleteBtn(true);
  }

  var focusTabIndex = index > 1 ? index - 1: index;
  FncTabonclick(focusTabIndex);

}

/**
 * 先頭のタブの「ー」ボタンの表示・非表示を切り替える
 * @param {boolean} display 
 */
function displayFirstDeleteBtn(display) {
  const deleteButton = document.getElementById(`tab_${MIN_TAB}`).getElementsByClassName('delete-button')[0]
  if (display) {
    deleteButton.classList.add('is-hidden');
  } else {
    deleteButton.classList.remove('is-hidden');
  }
}

/**
 * 新しいタブを追加する
 */
function FncAddTab() {
  const tabs = document.getElementById('tabname');
  const tabBoxs = document.getElementById('movetabbox');
  // タブの大枠のdiv生成
  var newTab = document.createElement('div');
  // タブを追加・削除するボタンエリア生成
  var newAddDeleteArea = document.createElement('div');
  // タブを削除する「ー」ボタン生成
  var newDeleteTab = document.createElement('span');
  // タブ名部分生成
  var newInput = document.createElement('input');
  
  // ボトムを除いたタブの数を取得
  var tabCount = document.getElementsByClassName('tab-area').length;
  if (MIN_TAB === tabCount) {
    displayFirstDeleteBtn(false);
  }

  var tabIndex = tabCount + 1;
  
  // タブを追加する「＋」ボタン生成
  var newAddTab = document.createElement('span');
  
  // タブを追加する「＋」ボタンに class/イベント を設定
  newAddTab.setAttribute('class', `add-button`);
  newAddTab.textContent = '＋';
  newAddTab.setAttribute('onclick', 'FncAddTab()');

  var newInputValueSpan = document.createElement('span');
  newInputValueSpan.setAttribute('id', `input-value_${tabIndex}`);
  newInputValueSpan.setAttribute('class', 'input-value-span');

  // タブの大枠のdivに class/イベント を設定
  newTab.setAttribute('id', `tab_${tabIndex}`);
  newTab.setAttribute('class', `tab-area`);
  
  // タブを追加する「ー」ボタンに class/イベント を設定
  newDeleteTab.setAttribute('class', `delete-button`);
  newDeleteTab.textContent = 'ー';
  newDeleteTab.setAttribute('onclick', `FncDeleteTab(${tabIndex})`);
  
  // タブ名部分に id/class/style/イベント/input を設定
  newInput.setAttribute('type', 'text');
  newInput.setAttribute('maxlength', '20');
  newInput.setAttribute('id', `aaButton_${tabIndex}`);
  newInput.setAttribute('class', `tab-select2`);
  newInput.setAttribute('onclick', `FncTabonclick(${tabIndex})`);
  newInput.setAttribute('placeholder', `タブ(${tabIndex})`);
  newInput.setAttribute('value', '');
  newInput.setAttribute('style', 'width:70px;border-radius:10px 10px 0px 0px;background-color:#f5f5f5;padding: 1px 6px;text-align:center;');
  
  // タブを追加・削除するボタンエリアにーボタン要素を挿入
  newAddDeleteArea.appendChild(newDeleteTab);
  
  // タブを追加・削除するボタンエリアにーボタン要素を挿入
  newAddDeleteArea.appendChild(newAddTab);
  
  // タブの大枠のdivにボタンエリア要素を挿入
  newTab.appendChild(newAddDeleteArea);
  
  // タブの大枠のdivにタブ名要素を挿入
  newTab.appendChild(newInput);
  newTab.appendChild(newInputValueSpan);
  
  // 追加したタブと対になる設定箇所を生成
  var newTabBox = document.createElement('div');
  var height = getComputedStyle(tabBoxs.lastChild).height;
  // 設定箇所に class/id/style を設定
  newTabBox.setAttribute('class', 'box box2 tab-box-mid');
  newTabBox.setAttribute('id', `tabbox${tabIndex}`);
  newTabBox.setAttribute('style', `width: 100%; height:${height};`);

  if (document.getElementById('tabbox999') != null) {
    // ボトムがある場合、ボトムの一つ前に追加
    tabs.lastElementChild.before(newTab);
    tabBoxs.lastElementChild.before(newTabBox);
  } else {
    // 右端に追加
    tabs.appendChild(newTab);
    tabBoxs.appendChild(newTabBox);
  }

  if (MAX_TAB === tabIndex) {
    const addButtons = document.getElementsByClassName('add-button');
    for (let i = 0; i < addButtons.length; i++) {
      addButtons[i].classList.add('is-hidden');
    }
  }

  FncDragiven();
  FncMoveheight();
  FncTabonclick(tabIndex);
  newInput.addEventListener('input', SetTabWidthInput);
}

/**
 * 初期表示時のタブの幅を設定する
 */
function SetTabWidthIni () {
  const tabs = document.getElementsByClassName('tab-select2');
  for (let i = 0; i < tabs.length; i++) {
    const inputValueSpan = document.getElementById(`input-value_${i + 1}`);
    if (inputValueSpan.clientWidth > 70) tabs[i].style.width = `${inputValueSpan.clientWidth}px`;
  }
}

/**
 * タブ名を入力した際にタブの幅を文字数に合わせて設定する
 */
function SetTabWidthInput (e) {
  const targetIndex = e.target.id.split('_')[1];
  const inputValueSpan = document.getElementById(`input-value_${targetIndex}`);
  inputValueSpan.textContent = e.target.value;

  if (inputValueSpan.clientWidth > 70) e.target.style.width = `${inputValueSpan.clientWidth}px`;
}

function FncClehtml(valhtml,valtype='no',valname='no'){
let htmlaa = '';
if(valhtml['type']=='SPACER'){  //スペース
  htmlaa = '<div class="" style="box-sizing: border-box; min-width: ' + valhtml['size']['width'] + 'px;display:inline-block"><div class="spacer-cybozu">spacer</div></div>';
}else if(valhtml['type']=='LABEL'){  //ラベル
  htmlaa += '<div class="pplb" style="box-sizing: border-box; width: ' + valhtml['size']['width'] + 'px; height: auto;display:inline-block;">';
  htmlaa += '<div class=""><span class="">' + valhtml['label'] + '</span></div></div>';
}else if(valhtml['type']=='HR'){  //罫線
  htmlaa = '<div class="" style="box-sizing: border-box; width: ' + valhtml['size']['width'] + 'px; height: auto;display:inline-block"><hr class=""></div>';
}else if(valhtml['type']=='REFERENCE_TABLE'){  //関連レコード一覧
  htmlaa += '<div class="pplb" style="box-sizing: border-box; height: auto;display:inline-block;">';
  htmlaa += '<div class="" style=""><span class="">' + gproperties[valhtml['code']].label + '</span></div>';
  for(let i=0;i< gproperties[valhtml['code']]['referenceTable']['displayFields'].length;i++){
    htmlaa += '<div class="subtable-label-gaiatab" style="box-sizing:border-box;height:auto;display:inline-block">';
    htmlaa += '<div class="" style=""><span class="">' + gproperties[valhtml['code']]['referenceTable']['displayFields'][i] + '</span></div>';
    htmlaa += '<div class=""></div>';
    htmlaa += '</div>';
  }
  htmlaa += '<div class=""></div>';
  htmlaa += '</div>';
}else if(valtype == 'SUBTABLE'){  //テーブル
  htmlaa += '<div class="subtable-label-gaiatab" style="box-sizing:border-box;width: ' + valhtml['size']['width'] + 'px;height:auto;display:inline-block">';
  htmlaa += '<div class="" style=""><span class="">' + gproperties[valname]['fields'][valhtml['code']].label + '</span></div>';
  htmlaa += '<div class="control-value-gaiatab"><span class="" style="color:#000;">'+ valhtml['code'] +'</span></div>';
  htmlaa += '<div class=""></div>';
  htmlaa += '</div>';

}else{
  htmlaa += '<div class="pplb" style="box-sizing:border-box;width: ' + valhtml['size']['width'] + 'px;height:auto;display:inline-block;">';
  htmlaa += '<div class="" style=""><span class="">' + gproperties[valhtml['code']].label + '</span></div>';
  htmlaa += '<div class="control-value-gaiatab"><span class="">'+ valhtml['code'] +'</span></div>';
  htmlaa += '<div class=""></div>';
  htmlaa += '</div>';
}

return htmlaa;
}
