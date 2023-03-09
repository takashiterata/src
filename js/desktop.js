jQuery.noConflict();

let listCnt =0;
(function($, PLUGIN_ID) {
  'use strict';
  
  kintone.events.on(['app.record.detail.show','app.record.edit.show','app.record.create.show'], function(event) {
    DeleteList(event);
  });

  //移動対象のリストを取得
  async  function DeleteList(event){
    try {
      const config = kintone.plugin.app.getConfig(PLUGIN_ID);

      //ヘッダースペース
      let devSpaceHeader = document.createElement('dev');
      devSpaceHeader.id = 'tabDivH';

      //フッタースペース
      let devSpaceFooter = document.createElement('dev');
      devSpaceFooter.id = 'tabDivF';

      //tab用の箱
      let devSpaceTab = document.createElement('dev');
      devSpaceTab.id = 'record-tab-area';
      let devSpaceBottom = document.createElement('dev');

      //固定tab
      let buttonAll = document.createElement('button');
      buttonAll.id = 'aaButton0';
      buttonAll.style.height = '30px';
      buttonAll.innerHTML = ' 全表示 ';
      buttonAll.className = "tabbottnname";
      buttonAll.onclick = function() { ViewTag(0); };
      buttonAll.style.borderRadius = '10px 10px 0px 0px';

      //設定値によりループする↓
      listCnt = config.tabselect;
      let buttonTab = [];
      const tabName = config.tabselect2.split('@44');
      for(let i=0;i<config.tabselect;i++){
        let ii=i+1;
        buttonTab[i] = document.createElement('button');
        buttonTab[i].id = 'aaButton' + ii;
        buttonTab[i].style.height = '30px';
        buttonTab[i].style.overflow = 'hidden';
        buttonTab[i].innerHTML = tabName[i];
        buttonTab[i].onclick = function() { ViewTag(ii); };
        buttonTab[i].style.borderRadius = '10px 10px 0px 0px';
      }
      //設定値によりループする↑

      const recordGaia = document.getElementById("record-gaia").children[0];
      //ヘッダー、フッターの位置を作成
      recordGaia.appendChild(devSpaceHeader);

      recordGaia.appendChild(devSpaceTab);

      //設定値によりループする↓
      for(let i=0;i<buttonTab.length;i++){
        devSpaceTab.appendChild(buttonTab[i]);
      }
      //設定値によりループする↑

      //全表示タブ
      if(2<=config.tabselect){
        devSpaceTab.appendChild(buttonAll);
      }
      recordGaia.appendChild(devSpaceBottom); 

      recordGaia.appendChild(devSpaceFooter);

      //オブジェクトの一覧取得

      //フォームの設定情報
      const { layout } = await kintone.api(
        kintone.api.url('/k/v1/app/form/layout.json', true),
        'GET',
        { app: kintone.app.getId() }
      );

      const rowGaia = document.getElementsByClassName('row-gaia');
      const subTableRowGaia = document.getElementsByClassName('subtable-row-gaia');

      let cntRowGaia = 0;
      if(rowGaia[0].children[0].children[0].className == 'gaia-app-statusbar'){
        cntRowGaia = 1; //ステータスバーを飛ばす
      }
      let cntSubTableRowGaia = 0;
      let layoutValues=[];
      for(let i =0;i<layout.length;i++){
        layoutValues[i]=[];
        if(layout[i]['type'] == 'SUBTABLE'){
          layoutValues[i][0] = 'SUBTABLE';
          layoutValues[i][1] = cntSubTableRowGaia;
          layoutValues[i][2] = subTableRowGaia[cntSubTableRowGaia];
          cntSubTableRowGaia = cntSubTableRowGaia + 1;
        }else if(layout[i]['type'] == 'GROUP'){
          layoutValues[i][0] = 'ROW';
          layoutValues[i][1] = cntRowGaia;
          layoutValues[i][2] = rowGaia[cntRowGaia];
          cntRowGaia = cntRowGaia + layout[i]['layout'].length + 1;
        }else{
          layoutValues[i][0] = 'ROW';
          layoutValues[i][1] = cntRowGaia;
          layoutValues[i][2] = rowGaia[cntRowGaia];
          cntRowGaia = cntRowGaia + 1;
        }
      }

      let tabSetVal = [];
      if(config.tabset){
        tabSetVal = config.tabset.split('@44');
      }
      //TOP
      let tabSetValTop =[];
      let iiCnt = 0;
      for(let i =0;i<layout.length;i++){
        if(i<tabSetVal.length-1){
          let tabSetVal2 = tabSetVal[i].split('--');
          if(tabSetVal2[0] == '0'){
            tabSetValTop[tabSetVal2[1]] = layoutValues[i];
            iiCnt = iiCnt + 1;
          }
        }else{
          tabSetValTop[iiCnt] = layoutValues[i];
          iiCnt = iiCnt + 1;
        }
      }
      for(let i =0;i<tabSetValTop.length;i++){
        devSpaceHeader.appendChild(tabSetValTop[i][2]);
      }
      //MID
      for(let i=1;i<=config.tabselect;i++){
        let tabSetValMid =[];
        for(let ii =0;ii<layout.length;ii++){
          if(ii>=tabSetVal.length-1){
            continue;
          }
          let tabSetVal2 = tabSetVal[ii].split('--');
          if(tabSetVal2[0] == i){
            tabSetValMid[tabSetVal2[1]]= layoutValues[ii];
          }
        }
        for(let ii=0;ii<tabSetValMid.length;ii++){
          devSpaceBottom.appendChild(tabSetValMid[ii][2]);
          tabSetValMid[ii][2].className = tabSetValMid[ii][2].className + ' tabVclass' +i;
        }
      }
      //BTM
      let tabSetValBtm =[];
      for(let i =0;i<layout.length;i++){
        if(i>=tabSetVal.length-1){
          continue;
        }
        let tabSetVal2 = tabSetVal[i].split('--');
        if(tabSetVal2[0] == '999'){
          tabSetValBtm[tabSetVal2[1]] = layoutValues[i];
        }
      }
      for(let i =0;i<tabSetValBtm.length;i++){
        devSpaceFooter.appendChild(tabSetValBtm[i][2]);
      }
    } catch (error) {  //エラー処理
      window.alert("タブプラグインでエラーが発生しました。");
    } finally {  //後処理
      let strInt=1;

      const r = document.cookie.split(';');//split(';')を使用しデータを1つずつに分ける
      r.forEach(function(value) {
        let content = value.split('=');//split('=')を使用しcookie名と値に分ける
        if(content[0] == 'Tagiji'){
          strInt = content[1];
        }
      })

      ViewTag(strInt);
    }
  }  
})(jQuery, kintone.$PLUGIN_ID);


function ViewTag(ViewType){
  document.cookie = 'Tagiji=' + ViewType;
  let tagArray = [];
  let tagParmTab = [];
  //設定値でループになる
  for(let i =1;i<=listCnt;i++){
    let tabBoxName = 'tabVclass' + i;
    tagArray[i] = document.getElementsByClassName(tabBoxName);
  }
  let strInt=1;
  if(2<=listCnt){
    tagParmTab[0] = document.getElementById('aaButton0');
    strInt=0;
  }
  for(let i =1;i<=listCnt;i++){
    let tabBoxName = 'aaButton' + i;
    tagParmTab[i] = document.getElementById(tabBoxName);
  }
  for(let i=strInt;i<tagParmTab.length;i++){
    if(ViewType == i){
      tagParmTab[i].style.background = '#f0f0f0';
    }else{
      tagParmTab[i].style.background = '#969998';
    }
  }
  for(let i=1;i<tagArray.length;i++){
    for(let ii=0;ii<tagArray[i].length;ii++){
      if(ViewType == 0 || ViewType == i){
        tagArray[i][ii].style.display = '';
      }else{
        tagArray[i][ii].style.display = 'none';
      }
    }
  }
}
