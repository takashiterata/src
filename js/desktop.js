jQuery.noConflict();

var  listCnt =0;
(function($, PLUGIN_ID) {
  'use strict';

  kintone.events.on('app.record.index.show', function() {
    var config = kintone.plugin.app.getConfig(PLUGIN_ID);

    var spaceElement = kintone.app.getHeaderSpaceElement();
    if (spaceElement === null) {
      throw new Error('The header element is unavailable on this page');
    }
    var fragment = document.createDocumentFragment();
    var headingEl = document.createElement('h3');
    var messageEl = document.createElement('p');

    messageEl.classList.add('plugin-space-message');
    messageEl.textContent = '入力メッセージ：'+ config.message;
    headingEl.classList.add('plugin-space-heading');
    headingEl.textContent = 'タブ数：'+ config.tabselect;

    fragment.appendChild(headingEl);
    fragment.appendChild(messageEl);
    spaceElement.appendChild(fragment);
  });

  const appId = kintone.app.getId();
  kintone.events.on(['app.record.detail.show','app.record.edit.show','app.record.create.show'], function(event) {
    DeleteList(event);
  });

  //移動対象のリストを取得
  async  function DeleteList(event){
    try {
      let config = kintone.plugin.app.getConfig(PLUGIN_ID);

      //タブの箱作成
      //箱はフォームの最も下に配置する

      let hrSpacef1 = document.createElement('hr');
      let hrSpacef2 = document.createElement('hr');
      let hrSpacef3 = document.createElement('hr');

//ヘッダースペース
      let devSpaceh = document.createElement('dev');
      devSpaceh.id = 'tabDivH';


//フッタースペース
      let devSpacef = document.createElement('dev');
      devSpacef.id = 'tabDivF';

//tab用の箱
      let devSpace = document.createElement('dev');
      devSpace.innerHTML = '　';//タブ位置の調整

//固定tab
      let ButtonAll = document.createElement('button');
      ButtonAll.id = 'eeButton';
      ButtonAll.style.height = '30px';
      ButtonAll.style.width = '120px';
      ButtonAll.innerHTML = ' 全表示 ';
      ButtonAll.onclick = function() { ViewTag(0); };
      ButtonAll.style.borderRadius = '10px 10px 0px 0px';

//設定値によりループする↓
      listCnt = config.tabselect;
      let ButtonTab = [];
      let tabname = config.tabselect2.split('@44');
      for(let i=0;i<config.tabselect;i++){
        let ii=i+1;
        ButtonTab[i] = document.createElement('button');
        ButtonTab[i].id = 'aaButton' + i;
        ButtonTab[i].style.height = '30px';
        ButtonTab[i].style.width = '120px';
        ButtonTab[i].innerHTML = tabname[i];
        ButtonTab[i].onclick = function() { ViewTag(ii); };
        ButtonTab[i].style.borderRadius = '10px 10px 0px 0px';
      }
//設定値によりループする↑
      const recordGaia = document.getElementById("record-gaia").children[0];

      //ヘッダー、フッターの位置を作成
      recordGaia.appendChild(hrSpacef1);  //デバッグ用線
      recordGaia.appendChild(devSpaceh);
      recordGaia.appendChild(hrSpacef3);  //デバッグ用線

      recordGaia.appendChild(devSpace);
      devSpace.appendChild(ButtonAll);
//設定値によりループする↓
      for(let i=0;i<ButtonTab.length;i++){
        devSpace.appendChild(ButtonTab[i]);
      }
//設定値によりループする↑

      recordGaia.appendChild(hrSpacef2);  //デバッグ用線
      recordGaia.appendChild(devSpacef);

      //オブジェクトの一覧取得
      //レコード情報
      let record = event.record;

      //フォームの設定情報
      let { layout } = await kintone.api(
        kintone.api.url('/k/v1/app/form/layout.json', true),
        'GET',
        { app: kintone.app.getId() }
      );

      let rowgaia = document.getElementsByClassName('row-gaia');
      let subtablerowgaia = document.getElementsByClassName('subtable-row-gaia');

      let cntRowgaia = 0;
      let cntSubtablerowgaia = 0;
      let prmval=[];
      for(let i =0;i<layout.length;i++){
        prmval[i]=[];
        if(layout[i]['type'] == 'SUBTABLE'){
          prmval[i][0] = 'SUBTABLE';
          prmval[i][1] = cntSubtablerowgaia;
          prmval[i][2] = subtablerowgaia[cntSubtablerowgaia];
          cntSubtablerowgaia = cntSubtablerowgaia + 1;
        }else if(layout[i]['type'] == 'GROUP'){
          prmval[i][0] = 'ROW';
          prmval[i][1] = cntRowgaia;
          prmval[i][2] = rowgaia[cntRowgaia];
          cntRowgaia = cntRowgaia + layout[i]['layout'].length + 1;
        }else{
          prmval[i][0] = 'ROW';
          prmval[i][1] = cntRowgaia;
          prmval[i][2] = rowgaia[cntRowgaia];
          cntRowgaia = cntRowgaia + 1;
        }
      }

      let tabsetval = [];
      if(config.tabset){
        tabsetval = config.tabset.split('@44');
      }
      //TOP
      let tabsetvalTop =[];
      let iicnt = 0;
      for(let i =0;i<layout.length;i++){
        let ii = i +1;
        if(i<tabsetval.length-1){
          let tabsetval2 = tabsetval[i].split('--');
          if(tabsetval2[0] == '0'){
            tabsetvalTop[tabsetval2[1]] = prmval[i];
            iicnt = iicnt + 1;
          }
        }else{
          tabsetvalTop[iicnt] = prmval[i];
          iicnt = iicnt + 1;
        }
      }
      for(let i =0;i<tabsetvalTop.length;i++){
        devSpaceh.appendChild(tabsetvalTop[i][2]);
      }
      //MID
      for(let i=1;i<=config.tabselect;i++){
        let tabsetvalmid =[];
        for(let ii =0;ii<layout.length;ii++){
          let iii = ii +1;
          let tabsetval2 = tabsetval[ii].split('--');
          if(tabsetval2[0] == i){
            tabsetvalmid[tabsetval2[1]]= prmval[ii];
          }
        }
        for(let ii=0;ii<tabsetvalmid.length;ii++){
          devSpace.appendChild(tabsetvalmid[ii][2]);
          tabsetvalmid[ii][2].className = tabsetvalmid[ii][2].className + ' tabVclass' +i;
        }
      }
      //BTM
      let tabsetvalBtm =[];
      for(let i =0;i<layout.length;i++){
        let ii = i +1;
        let tabsetval2 = tabsetval[i].split('--');
        if(tabsetval2[0] == '999'){
          tabsetvalBtm[tabsetval2[1]] = prmval[i];
        }
      }
      for(let i =0;i<tabsetvalBtm.length;i++){
        devSpacef.appendChild(tabsetvalBtm[i][2]);
      }
  
//      window.alert("完了しました。");
    } catch (error) {  //エラー処理
      console.log(error.message);
      window.alert("エラーが発生した為、処理をキャンセルしました。\n" + error.message);
    } finally {  //後処理
    }
  }  
})(jQuery, kintone.$PLUGIN_ID);


function ViewTag(ViewType){
  let Tagparm = [];
  //設定値でループになる
  for(let i =1;i<=listCnt;i++){
    let tabboxname = 'tabVclass' + i;
    Tagparm[i] = document.getElementsByClassName(tabboxname);
  }

  for(let i=1;i<Tagparm.length;i++){
    for(let ii=0;ii<Tagparm[i].length;ii++){
      if(ViewType == 0 || ViewType == i){
        Tagparm[i][ii].style.display = '';
      }else{
        Tagparm[i][ii].style.display = 'none';
      }
      
    }
  }
}
