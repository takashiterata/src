jQuery.noConflict();

let listCnt =0;
let propertiesArray =[];
const MAX_TAB = 20;
const MIN_TAB = 1;
(function($, PLUGIN_ID) {
  'use strict';

  //API呼び出しで、同期解除の為別関数で呼び出し　動的配列も関数内で設定する。
  FncCreateTabList(PLUGIN_ID);

  //固定オブジェクトはここで宣言
  let $form = $('.js-submit-settings');
  let $cancelButton = $('.js-cancel-button');

  $form.on('submit', function(e) {
  
    e.preventDefault();
    //配列の設定↓ *プラグインの設定値は配列を格納できないので文字列連結でsplit;
    let $tabSelect2Any = $('.tab-select2');
    let $tabSelect2 = "";
    
    // タブが存在すればtrue,存在しなければfalse
    const isTabFlg = $tabSelect2Any.length > 0 ? true: false;
    let $tabCount = JSON.stringify(document.getElementsByClassName('tab-area').length);
    for(let i=0;i<$tabSelect2Any.length;i++){
      $tabSelect2 += $tabSelect2Any[i].value + '@44';
    }
    if(!isTabFlg){
      $tabSelect2 = '@44';
    }
    const tabAreaCount = document.getElementsByClassName("tab-area").length;
    let tabSetAny = [];
    for(let i=0;i<=tabAreaCount;i++){
      let tabBoxName='tabbox' + i;
      for(let ii=1;ii<=document.getElementById(tabBoxName).childElementCount;ii++){
        let iii = ii-1;
        let i4 = Math.floor(ii / 2)-1;
        if(document.getElementById(tabBoxName).children[iii].id.includes("Vitem_")){
          continue;
        }
        
        let row = document.getElementById(tabBoxName).children[iii].id.split('_')[1];
        tabSetAny[row] = i+'--'+i4;
      }
    }
    let tabBoxName='tabbox999';
    for(let i=1;i<=document.getElementById(tabBoxName).childElementCount;i++){
      let ii = i -1;
      let i4 = Math.floor(i / 2)-1;
      if(document.getElementById(tabBoxName).children[ii].id.includes("Vitem_")){
        continue;
      }
      let row = document.getElementById(tabBoxName).children[ii].id.split('_')[1];
      tabSetAny[row] = '999'+'--'+i4;
    }
    
    let $tabSet = "";
    for(let i=1;i<tabSetAny.length;i++){
      $tabSet += tabSetAny[i] + '@44';
    }
    //配列の設定↑

    //Configへ値のセット
    kintone.plugin.app.setConfig({
      tabselect: $tabCount
      ,tabselect2: $tabSelect2
      ,tabset: $tabSet
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
async function FncCreateTabList(PLUGIN_ID){
  try{
    const config = kintone.plugin.app.getConfig(PLUGIN_ID);
    const listTable = document.getElementById("listTable");
    //フォームの設定情報
    const { layout } = await kintone.api(
      kintone.api.url('/k/v1/app/form/layout.json', true),
      'GET',
      { app: kintone.app.getId() }
    );
    //フォームの設定情報
    const { properties } = await kintone.api(
      kintone.api.url('/k/v1/app/form/fields.json', true),
      'GET',
      { app: kintone.app.getId() }
    );
    propertiesArray = properties;

    let devSpace = document.createElement('dev');
    let tabIni = 0;
    if(config.tabselect){
      tabIni = config.tabselect;
    }

    let isHiddenDelete = '';
    let isHiddenAdd = '';
    if (MAX_TAB === Number(tabIni)) {
      isHiddenAdd = 'is-hidden';
    } else if (MIN_TAB === Number(tabIni)) {
      isHiddenDelete = 'is-hidden';
    }


    let htmlInnerVal='';
    htmlInnerVal += '<table style="font-size: 16px;width:100%;background-color:#f5f5f5;"><tr><td style="width:50%;">TOP</td><td style="width:50%;" id="tabname">';
    //配列戻し用の変数もここで宣言
    let tabSelect2Val = [];
    //配列戻し
    if(config.tabselect2){
      tabSelect2Val = config.tabselect2.split('@44');
    }else if(tabSelect2Val.length == 0){
      for(let i=0;i<tabIni;i++){
        tabSelect2Val[i] = '';
      }
    }

    // タブが一つもない場合
    if (tabIni === 0) {
      htmlInnerVal += '<div id="tab_1" class="tab-area">';
      htmlInnerVal += '<div class="button-area">';
      htmlInnerVal += '<span class="add-button btn btn--circle btn--circle-a btn--shadow" onclick="FncAddTab()">＋</span>';
      htmlInnerVal += '<span class="delete-button btn btn--circle btn--circle-a btn--shadow '+ isHiddenDelete +'" onclick="FncDeleteTab(1)"">ー</span>';
      htmlInnerVal += '</div>';
      htmlInnerVal += '<input type="text" id="aaButton_1" class="tab-select2 not-focus-tab" value="" onclick="FncTabOnClick(1)"style="width:70px;border-radius:10px 10px 0px 0px;padding: 1px 6px;text-align:center;" maxlength="20" placeholder="タブ">'
      htmlInnerVal += '<span id="input-value_1" class="input-value-span"></span></div>';
      htmlInnerVal += '</div>'
    }

    for(let i=1;i<=tabIni;i++){
      let ii=i-1;
      htmlInnerVal += '<div id="tab_' + i + '" class="tab-area">';
      htmlInnerVal += '<div class="button-area">';
      htmlInnerVal += '<span class="add-button btn btn--circle btn--circle-a btn--shadow '+ isHiddenAdd +'" onclick="FncAddTab()">＋</span>';
      htmlInnerVal += '<span class="delete-button btn btn--circle btn--circle-a btn--shadow '+ isHiddenDelete +'" onclick="FncDeleteTab('+ i +')">ー</span>';
      htmlInnerVal += '</div>';
      htmlInnerVal += '<input type="text" id="aaButton_' + i + '" class="tab-select2 not-focus-tab" value="'+ tabSelect2Val[ii] +'" onclick="FncTabOnClick('+ i +')"style="width:70px;border-radius:10px 10px 0px 0px;padding: 1px 6px;text-align:center;" maxlength="20" size="'+tabSelect2Val[ii].length+'">'
      htmlInnerVal += `<span id="input-value_${i}" class="input-value-span">${tabSelect2Val[ii]}</span></div>`;
      htmlInnerVal += '</div>'
    }
    htmlInnerVal += '<input type="text" id="aaButton_0" class="tab-select3 not-focus-tab" value="ボトム" onclick="FncTabOnClick(999)" style="width:70px;border-radius:10px 10px 0px 0px;padding: 1px 6px;text-align:center;" readonly>';
    htmlInnerVal += '</td></tr>';
    htmlInnerVal += '<tr><td>';
    htmlInnerVal += '<div class="grid">';
    htmlInnerVal += '<div class="box box1" id="tabbox0" style="width:100%;">';

    listCnt =layout.length;

    let tabSetVal = [];
    if(config.tabset){
      tabSetVal = config.tabset.split('@44');
    }

    let tabSetValTop =[];
    for(let i =0;i<layout.length;i++){
      if(i>=tabSetVal.length-1){
        continue;
      }
      let ii = i +1;
      let tabSetVal2 = tabSetVal[i].split('--');
      if(tabSetVal2[0] == '0'){
        tabSetValTop[tabSetVal2[1]] = '<div class="Vitem" id="Vitem_' + ii +'"></div>';
        tabSetValTop[tabSetVal2[1]] += '<div class="item" draggable="true" id="item_' + ii +'">' +ii + '行目';
        if(layout[i]['type'] == 'SUBTABLE'){
          tabSetValTop[tabSetVal2[1]] += '<div class="pl-8 pb-5" style="">'+propertiesArray[layout[i]['code']].label+'<br>';
          for(let i4=0;i4 <layout[i]['fields'].length;i4++){
            tabSetValTop[tabSetVal2[1]] += FncCreateFieldHtml(layout[i]['fields'][i4],layout[i]['type'],layout[i]['code']);
          }
          tabSetValTop[tabSetVal2[1]] += '</div>';
        }else if(layout[i]['type'] == 'GROUP'){
          tabSetValTop[tabSetVal2[1]] += 'GROUP:'+propertiesArray[layout[i]['code']]['label'];
          tabSetValTop[tabSetVal2[1]] += '<div class="" style="">';
          for(let i4=0;i4 <layout[i]['layout'].length;i4++){
            for(let i5=0;i5 <layout[i]['layout'][i4]['fields'].length;i5++){
              tabSetValTop[tabSetVal2[1]] += FncCreateFieldHtml(layout[i]['layout'][i4]['fields'][i5]);
            }
          }
          tabSetValTop[tabSetVal2[1]] += '</div>';
        }else{
          tabSetValTop[tabSetVal2[1]] += '<div class="" style="">';
          for(let i4=0;i4 <layout[i]['fields'].length;i4++){
            tabSetValTop[tabSetVal2[1]] += FncCreateFieldHtml(layout[i]['fields'][i4]);
          }
          tabSetValTop[tabSetVal2[1]] += '</div>';
        }
        tabSetValTop[tabSetVal2[1]] += '</div>';
      }
    }
    for(let i=0;i<tabSetValTop.length;i++){
      htmlInnerVal +=tabSetValTop[i];
    }

    //未設定の行
    for(let i =0;i<layout.length;i++){
      let ii = i +1;
      if(i >=  tabSetVal.length-1){
        htmlInnerVal += '<div class="Vitem" id="Vitem_' + ii +'"></div>';
        htmlInnerVal += '<div class="item" draggable="true" id="item_' + ii +'">' +ii + '行目';
        if(layout[i]['type'] == 'SUBTABLE'){
          htmlInnerVal += '<div class="pl-8 pb-5" style="">'+propertiesArray[layout[i]['code']].label+'<br>';
          for(let i4=0;i4 <layout[i]['fields'].length;i4++){
            htmlInnerVal += FncCreateFieldHtml(layout[i]['fields'][i4],layout[i]['type'],layout[i]['code']);
          }
          htmlInnerVal += '</div>';
        }else if(layout[i]['type'] == 'GROUP'){
          htmlInnerVal += 'GROUP:'+propertiesArray[layout[i]['code']]['label'];
          htmlInnerVal += '<div class="" style="">';
          for(let i4=0;i4 <layout[i]['layout'].length;i4++){
            for(let i5=0;i5 <layout[i]['layout'][i4]['fields'].length;i5++){
              htmlInnerVal += FncCreateFieldHtml(layout[i]['layout'][i4]['fields'][i5]);
            }
          }
          htmlInnerVal += '</div>';
        }else{
          htmlInnerVal += '<div class="" style="">';
          for(let i4=0;i4 <layout[i]['fields'].length;i4++){
            htmlInnerVal += FncCreateFieldHtml(layout[i]['fields'][i4]);
          }
          htmlInnerVal += '</div>';
        }
        htmlInnerVal += '</div>';
      }
    }

    htmlInnerVal += '</div>';
    htmlInnerVal += '</div>';
    htmlInnerVal += '</td><td>';
    htmlInnerVal += '<div id="movetabbox" class="grid">';

    if (tabIni === 0) {
      htmlInnerVal += '<div class="box box2" id="tabbox1" style="width:100%;"></div>';
    }

    for(let i=1;i<=tabIni;i++){
      htmlInnerVal += '<div class="box box2 tab-box-mid" id="tabbox'+i+'" style="width:100%;">';
      let tabSetValMid =[];
      for(let ii =0;ii<layout.length;ii++){
        if(ii>=tabSetVal.length-1){
          continue;
        }
          let iii = ii +1;
        let tabSetVal2 = tabSetVal[ii].split('--');
        if(tabSetVal2[0] == i){
          tabSetValMid[tabSetVal2[1]] = '<div class="Vitem" id="Vitem_' + iii +'"></div>';
          tabSetValMid[tabSetVal2[1]] += '<div class="item" draggable="true" id="item_' + iii +'">' +iii + '行目';
          if(layout[ii]['type'] == 'SUBTABLE'){
            tabSetValMid[tabSetVal2[1]] += '<div class="pl-8 pb-5" style="">'+propertiesArray[layout[ii]['code']].label+'<br>';
            for(let i4=0;i4 <layout[ii]['fields'].length;i4++){
              tabSetValMid[tabSetVal2[1]] += FncCreateFieldHtml(layout[ii]['fields'][i4],layout[ii]['type'],layout[ii]['code']);
            }
            tabSetValMid[tabSetVal2[1]] += '</div>';
          }else if(layout[ii]['type'] == 'GROUP'){
            tabSetValMid[tabSetVal2[1]] += 'GROUP:'+propertiesArray[layout[ii]['code']]['label'];
            tabSetValMid[tabSetVal2[1]] += '<div class="" style="">';
            for(let i4=0;i4 <layout[ii]['layout'].length;i4++){
              for(let i5=0;i5 <layout[ii]['layout'][i4]['fields'].length;i5++){
                tabSetValMid[tabSetVal2[1]] += FncCreateFieldHtml(layout[ii]['layout'][i4]['fields'][i5]);
              }
            }
            tabSetValMid[tabSetVal2[1]] += '</div>';
          }else{
            tabSetValMid[tabSetVal2[1]] += '<div class="" style="">';
            for(let i4=0;i4 <layout[ii]['fields'].length;i4++){
              tabSetValMid[tabSetVal2[1]] += FncCreateFieldHtml(layout[ii]['fields'][i4]);
            }
            tabSetValMid[tabSetVal2[1]] += '</div>';
          }
          tabSetValMid[tabSetVal2[1]] += '</div>';
        }
      }
      for(let ii=0;ii<tabSetValMid.length;ii++){
        htmlInnerVal +=tabSetValMid[ii];
      }
      htmlInnerVal += '</div>';
    }
    htmlInnerVal += '<div class="box box2" id="tabbox999" style="width:100%;">';
    let tabSetValBtm =[];
    for(let i =0;i<layout.length;i++){
      let ii = i +1;
      if(i>=tabSetVal.length-1){
        continue;
      }
      let tabSetVal2 = tabSetVal[i].split('--');
      if(tabSetVal2[0] == '999'){
        tabSetValBtm[tabSetVal2[1]] = '<div class="Vitem" id="Vitem_' + ii +'"></div>';
        tabSetValBtm[tabSetVal2[1]] += '<div class="item" draggable="true" id="item_' + ii +'">' +ii + '行目';
        if(layout[i]['type'] == 'SUBTABLE'){
          tabSetValBtm[tabSetVal2[1]] += '<div class="pl-8 pb-5" style="">'+propertiesArray[layout[i]['code']].label+'<br>';
          for(let i4=0;i4 <layout[i]['fields'].length;i4++){
            tabSetValBtm[tabSetVal2[1]] += FncCreateFieldHtml(layout[i]['fields'][i4],layout[i]['type'],layout[i]['code']);
          }
          tabSetValBtm[tabSetVal2[1]] += '</div>';
        }else if(layout[i]['type'] == 'GROUP'){
          tabSetValBtm[tabSetVal2[1]] += 'GROUP:'+propertiesArray[layout[i]['code']]['label'];
          tabSetValBtm[tabSetVal2[1]] += '<div class="" style="">';
          for(let i4=0;i4 <layout[i]['layout'].length;i4++){
            for(let i5=0;i5 <layout[i]['layout'][i4]['fields'].length;i5++){
              tabSetValBtm[tabSetVal2[1]] += FncCreateFieldHtml(layout[i]['layout'][i4]['fields'][i5]);
            }
          }
          tabSetValBtm[tabSetVal2[1]] += '</div>';
        }else{
          tabSetValBtm[tabSetVal2[1]] += '<div class="" style="">';
          for(let i4=0;i4 <layout[i]['fields'].length;i4++){
            tabSetValBtm[tabSetVal2[1]] += FncCreateFieldHtml(layout[i]['fields'][i4]);
          }
          tabSetValBtm[tabSetVal2[1]] += '</div>';
        }
        tabSetValBtm[tabSetVal2[1]] += '</div>';
      }
    }
    for(let i=0;i<tabSetValBtm.length;i++){
      htmlInnerVal +=tabSetValBtm[i];
    }

    htmlInnerVal += '</div>';
    htmlInnerVal += '</div>';
    htmlInnerVal += '</td></tr>';
    htmlInnerVal += '</table>';
    devSpace.innerHTML = htmlInnerVal;
    listTable.appendChild(devSpace); 

  } catch (error) {
    //エラー処理
    window.alert("タブプラグインでエラーが発生しました。");
  } finally {
    //後処理
    FncDragField();
    FncMoveHeight();
    FncTabOnClick(1);
    SetTabWidthIni();

    const inputTab = document.getElementsByClassName("tab-select2");
    for (let i = 0;i < inputTab.length; i++) {
      inputTab[i].addEventListener('input', SetTabWidthInput);
    }
  }
}

function FncDragField(e){
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
    if(e.target.id.includes("tabbox") || e.target.id.includes("Vitem_")){
      e.target.classList.add("over");
    } else if(e.target.id.includes("aaButton")) {
      const drugTargetIndex = e.target.id.split('_')[1];
      const focusTargetIndex = document.getElementsByClassName('focus-tab')[0].id.split('_')[1];
      if (drugTargetIndex !== focusTargetIndex) {
        document.getElementById(`tabbox${focusTargetIndex}`).style.display='none';
      }
      document.getElementById(`tabbox${drugTargetIndex}`).style.display='';
      document.getElementById(`tabbox${drugTargetIndex}`).classList.add("over");
      e.target.classList.add("over");
    } else {
      return;
    }
  };
  // 要素が離れた際のイベントを定義
  const handleDragLeave = (e) => {
    if (e.target.id.includes("aaButton")) {
      const drugLeaveIndex = e.target.id.split('_')[1];
      const focusTargetIndex = document.getElementsByClassName('focus-tab')[0].id.split('_')[1];
      document.getElementById(`tabbox${drugLeaveIndex}`).classList.remove("over");
      e.target.classList.remove("over");
      document.getElementById(`tabbox${drugLeaveIndex}`).style.display='none';
      if (document.getElementsByClassName('over').length < 1) {
        document.getElementById(`tabbox${focusTargetIndex}`).style.display='';
      }
    } else {
      e.target.classList.remove("over");
    }
  }


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
    }else if(e.target.id.includes("Vitem_")){
      const cItemID = e.target.id;
      const vItemID = document.getElementById(e.target.id).parentElement.id;
      let objTabBox = document.getElementById(vItemID);
      let objTabBoxC = [];
      const objTabBoxCnt = objTabBox.childElementCount;

      for(let i=0;i<objTabBox.childElementCount;i++){
        objTabBoxC[i] = objTabBox.children[i].id;
      }
      for(let i=0;i<objTabBoxCnt;i++){
        if(id == objTabBoxC[i]){
          continue;
        }
        if("V" + id == objTabBoxC[i]){
          continue;
        }

        if(cItemID == objTabBoxC[i]){
        objTabBox.appendChild(document.getElementById("V" + id));
        objTabBox.appendChild(document.getElementById(id));
        }
        objTabBox.appendChild(document.getElementById(objTabBoxC[i]));
      }
    } else if(e.target.id.includes("aaButton")) {
      // ドロップ先のタブと相対するタブボックスに要素を追加する
      const dropIndex = e.target.id.split('_')[1];
      document.getElementById(`tabbox${dropIndex}`).appendChild(document.getElementById("V" + id));
      document.getElementById(`tabbox${dropIndex}`).appendChild(document.getElementById(id));
      document.getElementById(`tabbox${dropIndex}`).style.display='none';
      const displayTargetIndex = document.getElementsByClassName('focus-tab')[0].id.split('_')[1];
      document.getElementById(`tabbox${displayTargetIndex}`).style.display='';
      const overs = document.getElementsByClassName('over');
      for(let i = 0; i < overs.length; i++){
        overs[i].classList.remove("over");
      } 
    } else {
      return;
    }
    FncMoveHeight();
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

  const tabs = [...document.querySelectorAll(".tab-select2")];
  for (const tab of tabs) {
    tab.addEventListener("dragenter", handleDragEnter, false);
    tab.addEventListener("dragleave", handleDragLeave, false);
    tab.addEventListener("dragover", handleDragOver, false);
    tab.addEventListener("drop", handleDrop, false);
  }
}

function FncMoveHeight(e){
  const tabAreaCount = document.getElementsByClassName("tab-area").length;
  let objTabBox=[];
  objTabBox[0] =document.getElementById("tabbox0");
  for(let i=1;i<=tabAreaCount;i++){
    let tabBoxName='tabbox' + i;
    objTabBox[i] = document.getElementById(tabBoxName);
  }
  const finCnt = Number(tabAreaCount) + 1;
  objTabBox[finCnt] =document.getElementById("tabbox999");

  let maxheight =0;
  for(let i=0;i<objTabBox.length;i++){
    let boxHeight=0;
    let displayFlg=0;
    if(objTabBox[i].style.display == ''){
      displayFlg=1;
    }else{
      objTabBox[i].style.display = '';
    }

    for(let ii=0;ii<objTabBox[i].childElementCount;ii++){
      boxHeight += objTabBox[i].children[ii].clientHeight+1;
    }
    if(displayFlg== 0){
      objTabBox[i].style.display = 'none';      
    }
    boxHeight += 20;
    if(boxHeight > maxheight){
      maxheight =boxHeight
    }
  }
  for(let i=0;i<objTabBox.length;i++){
      objTabBox[i].style.height = maxheight+'px';
  }
}

function FncTabOnClick(ini){
  const tabAreaCount = document.getElementsByClassName('tab-area').length;
  let objTabBox=[];
  objTabBox[0] =document.getElementById("tabbox0");
  for(let i=1;i<=tabAreaCount;i++){
    let tabBoxName='tabbox' + i;
    let tabBoxBtn='aaButton_' + i;
    if(i==ini){
      document.getElementById(tabBoxName).style.display='';
      changeBackgroundColorTab(true, tabBoxBtn);
    }else{
      document.getElementById(tabBoxName).style.display='none';
      changeBackgroundColorTab(false, tabBoxBtn);
    }
  }
  if(999 == ini || tabAreaCount == '0'){
    document.getElementById('tabbox999').style.display='';
    changeBackgroundColorTab(true, 'aaButton_0');
  }else{
    document.getElementById('tabbox999').style.display='none';
    changeBackgroundColorTab(false, 'aaButton_0');
  }
}

/**
 * タブの背景色を変更する
 */
function changeBackgroundColorTab(focus, targetId) {
  const removeClass = focus ? 'not-focus-tab': 'focus-tab';
  const addClass = focus ? 'focus-tab': 'not-focus-tab';
  document.getElementById(targetId).classList.remove(removeClass);
  document.getElementById(targetId).classList.add(addClass);
}

/**
 * 選択中のタブを削除する
 */
function FncDeleteTab(index) {

  const tabAreaLengthIni = document.getElementsByClassName('tab-area').length;
  const isHiddenAddButton = (MAX_TAB === tabAreaLengthIni)?? false;

  // 削除するタブ
  const deleteTabBoxItems = document.getElementById(`tabbox${index}`).getElementsByClassName('item');

  // フィールド移動先（トップ）
  const tabBoxTop = document.getElementById('tabbox0');
  const tabBoxTopVItems = tabBoxTop.getElementsByClassName('Vitem');

  const deleteTabBoxItemsArray = [...deleteTabBoxItems];
  const tabBoxTopVItemsArray = [...tabBoxTopVItems];

  // 削除タブに設定されているフィールドをTOPに戻す
  for (let itemKey = 0; itemKey < deleteTabBoxItemsArray.length; itemKey++) {
    let moveItemIndex = Number(deleteTabBoxItemsArray[itemKey].id.split('_')[1]);

    for (let vItemKey = 0; vItemKey < tabBoxTopVItemsArray.length; vItemKey++) {
      let tabBoxIndex = Number(tabBoxTopVItemsArray[vItemKey].id.split('_')[1]);
      const moveVItem = document.getElementById(`Vitem_${moveItemIndex}`);
      const insertBeforeItem = document.getElementById(`item_${moveItemIndex}`);

      if (moveItemIndex < tabBoxIndex) {
        tabBoxTop.insertBefore(deleteTabBoxItemsArray[itemKey], tabBoxTopVItemsArray[vItemKey]);
        tabBoxTop.insertBefore(moveVItem, insertBeforeItem);
        break;
      }
      if (vItemKey + 1 === tabBoxTopVItemsArray.length) {
        tabBoxTop.appendChild(moveVItem);
        tabBoxTop.appendChild(deleteTabBoxItemsArray[itemKey]);
      } 
    }
  }

  // タブとタプ設定箇所を削除
  document.getElementById(`tab_${index}`).remove();
  document.getElementById(`tabbox${index}`).remove();
  
  const tabAreaElements = document.getElementsByClassName('tab-area');
  // タブのid,クリックイベントを振り直し
  for (let i = 0; i < tabAreaElements.length; i++) {
    tabAreaElements[i].setAttribute('id', `tab_${i + 1}`);

    let deleteButton = tabAreaElements[i].querySelector('.delete-button');
    deleteButton.setAttribute('onClick', `FncDeleteTab(${i + 1})`);

    let input = tabAreaElements[i].querySelector('input');
    let inputSpan = tabAreaElements[i].querySelector('.input-value-span');
    input.setAttribute('onClick', `FncTabOnClick(${i + 1})`);
    input.setAttribute('id', `aaButton_${i + 1}`);
    inputSpan.setAttribute('id', `input-value_${i + 1}`);
  
  }
  // タブ設定箇所のidを振り直し
  const tabBoxMidElements = document.getElementsByClassName('tab-box-mid');
  for (let i = 0; i < tabBoxMidElements.length; i++) {
    tabBoxMidElements[i].setAttribute('id', `tabbox${i + 1}`);
  }
  // タブが20個未満の場合「＋」ボタンを表示にする
  if (isHiddenAddButton) {
    const addButtons = document.getElementsByClassName('add-button');
    for (let i = 0; i < addButtons.length; i++) {
      addButtons[i].classList.remove('is-hidden');
    }
  }
  // タブが1個の場合「ー」ボタンを非表示にする
  if (MIN_TAB === tabAreaElements.length) {
    displayFirstDeleteBtn(true);
  }

  const focusTabIndex = index > 1 ? index - 1: index;
  FncTabOnClick(focusTabIndex);
  FncMoveHeight();
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
  const tabBoxes = document.getElementById('movetabbox');
  // タブの大枠のdiv生成
  let newTab = document.createElement('div');
  // タブを追加・削除するボタンエリア生成
  let newAddDeleteArea = document.createElement('div');
  newAddDeleteArea.setAttribute('class', `button-area`);

  // タブを削除する「ー」ボタン生成
  let newDeleteTab = document.createElement('span');
  // タブ名部分生成
  let newInput = document.createElement('input');
  
  // ボトムを除いたタブの数を取得
  const tabCount = document.getElementsByClassName('tab-area').length;
  if (MIN_TAB === tabCount) {
    displayFirstDeleteBtn(false);
  }

  let tabIndex = tabCount + 1;
  
  // タブを追加する「＋」ボタン生成
  let newAddTab = document.createElement('span');
  
  // タブを追加する「＋」ボタンに class/イベント を設定
  newAddTab.setAttribute('class', `add-button btn btn--circle btn--circle-a btn--shadow`);
  newAddTab.textContent = '＋';
  newAddTab.setAttribute('onclick', 'FncAddTab()');

  let newInputValueSpan = document.createElement('span');
  newInputValueSpan.setAttribute('id', `input-value_${tabIndex}`);
  newInputValueSpan.setAttribute('class', 'input-value-span');

  // タブの大枠のdivに class/イベント を設定
  newTab.setAttribute('id', `tab_${tabIndex}`);
  newTab.setAttribute('class', `tab-area`);
  
  // タブを追加する「ー」ボタンに class/イベント を設定
  newDeleteTab.setAttribute('class', `delete-button btn btn--circle btn--circle-a btn--shadow`);
  newDeleteTab.textContent = 'ー';
  newDeleteTab.setAttribute('onclick', `FncDeleteTab(${tabIndex})`);
  
  // タブ名部分に id/class/style/イベント/input を設定
  newInput.setAttribute('type', 'text');
  newInput.setAttribute('maxlength', '20');
  newInput.setAttribute('id', `aaButton_${tabIndex}`);
  newInput.setAttribute('class', `tab-select2 not-focus-tab`);
  newInput.setAttribute('onclick', `FncTabOnClick(${tabIndex})`);
  newInput.setAttribute('placeholder', `タブ(${tabIndex})`);
  newInput.setAttribute('value', '');
  newInput.setAttribute('style', 'width:70px;border-radius:10px 10px 0px 0px;padding: 1px 6px;text-align:center;');

  // タブを追加・削除するボタンエリアに＋ボタン要素を挿入
  newAddDeleteArea.appendChild(newAddTab);
  
  // タブを追加・削除するボタンエリアにーボタン要素を挿入
  newAddDeleteArea.appendChild(newDeleteTab);
  
  // タブの大枠のdivにボタンエリア要素を挿入
  newTab.appendChild(newAddDeleteArea);
  
  // タブの大枠のdivにタブ名要素を挿入
  newTab.appendChild(newInput);
  newTab.appendChild(newInputValueSpan);
  
  // 追加したタブと対になる設定箇所を生成
  let newTabBox = document.createElement('div');
  const height = getComputedStyle(tabBoxes.lastChild).height;
  // 設定箇所に class/id/style を設定
  newTabBox.setAttribute('class', 'box box2 tab-box-mid');
  newTabBox.setAttribute('id', `tabbox${tabIndex}`);
  newTabBox.setAttribute('style', `width: 100%; height:${height};`);

  if (document.getElementById('tabbox999') != null) {
    // ボトムがある場合、ボトムの一つ前に追加
    tabs.lastElementChild.before(newTab);
    tabBoxes.lastElementChild.before(newTabBox);
  } else {
    // 右端に追加
    tabs.appendChild(newTab);
    tabBoxes.appendChild(newTabBox);
  }

  if (MAX_TAB === tabIndex) {
    const addButtons = document.getElementsByClassName('add-button');
    for (let i = 0; i < addButtons.length; i++) {
      addButtons[i].classList.add('is-hidden');
    }
  }

  FncDragField();
  FncMoveHeight();
  FncTabOnClick(tabIndex);
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

function FncCreateFieldHtml(valHtml, valType='no', valName='no'){
let newFieldHtml = '';
if(valHtml['type']=='SPACER'){
  //スペース
  newFieldHtml = '<div class="" style="box-sizing: border-box; min-width: ' + valHtml['size']['width'] + 'px;display:inline-block"><div class="spacer-cybozu">spacer</div></div>';
}else if(valHtml['type']=='LABEL'){
  //ラベル
  newFieldHtml += '<div class="pl-8 pb-5" style="box-sizing: border-box; width: ' + valHtml['size']['width'] + 'px; height: auto;display:inline-block;">';
  newFieldHtml += '<div class=""><span class="">' + valHtml['label'] + '</span></div></div>';
}else if(valHtml['type']=='HR'){
  //罫線
  newFieldHtml = '<div class="" style="box-sizing: border-box; width: ' + valHtml['size']['width'] + 'px; height: auto;display:inline-block"><hr class=""></div>';
}else if(valHtml['type']=='REFERENCE_TABLE'){
  //関連レコード一覧
  newFieldHtml += '<div class="pl-8 pb-5" style="box-sizing: border-box; height: auto;display:inline-block;">';
  newFieldHtml += '<div class="" style=""><span class="">' + propertiesArray[valHtml['code']].label + '</span></div>';
  for(let i=0;i< propertiesArray[valHtml['code']]['referenceTable']['displayFields'].length;i++){
    newFieldHtml += '<div class="subtable-label-gaiatab" style="box-sizing:border-box;height:auto;display:inline-block">';
    newFieldHtml += '<div class="" style=""><span class="">' + propertiesArray[valHtml['code']]['referenceTable']['displayFields'][i] + '</span></div>';
    newFieldHtml += '<div class=""></div>';
    newFieldHtml += '</div>';
  }
  newFieldHtml += '<div class=""></div>';
  newFieldHtml += '</div>';
}else if(valType == 'SUBTABLE'){
  //テーブル
  newFieldHtml += '<div class="subtable-label-gaiatab" style="box-sizing:border-box;width: ' + valHtml['size']['width'] + 'px;height:auto;display:inline-block">';
  newFieldHtml += '<div class="" style=""><span class="">' + propertiesArray[valName]['fields'][valHtml['code']].label + '</span></div>';
  newFieldHtml += '<div class="control-value-gaiatab"><span class="" style="color:#000;">'+ valHtml['code'] +'</span></div>';
  newFieldHtml += '<div class=""></div>';
  newFieldHtml += '</div>';

}else{
  newFieldHtml += '<div class="pl-8 pb-5" style="box-sizing:border-box;width: ' + valHtml['size']['width'] + 'px;height:auto;display:inline-block;">';
  newFieldHtml += '<div class="" style=""><span class="">' + propertiesArray[valHtml['code']].label + '</span></div>';
  newFieldHtml += '<div class="control-value-gaiatab"><span class="">'+ valHtml['code'] +'</span></div>';
  newFieldHtml += '<div class=""></div>';
  newFieldHtml += '</div>';
}

return newFieldHtml;
}
