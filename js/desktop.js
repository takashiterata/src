jQuery.noConflict();

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
    messageEl.textContent = 'テスト１２３４５４'+ config.message;
    headingEl.classList.add('plugin-space-heading');
    headingEl.textContent = 'こん kintone plugin!';

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
      devSpace.innerHTML = '　　　　　　　　　　　　　';//タブ位置の調整

//固定tab
      let ButtonAll = document.createElement('button');
      ButtonAll.id = 'eeButton';
      ButtonAll.style.height = '30px';
      ButtonAll.style.width = '120px';
      ButtonAll.innerHTML = ' 全表示 ';
      ButtonAll.onclick = function() { ViewTag(0); };
      ButtonAll.style.borderRadius = '10px 10px 0px 0px';

//設定値によりループする↓
      let ButtonA = document.createElement('button');
      ButtonA.id = 'aaButton';
      ButtonA.style.height = '30px';
      ButtonA.style.width = '120px';
      ButtonA.innerHTML = ' AAAA ';
      ButtonA.onclick = function() { ViewTag(1); };
      ButtonA.style.borderRadius = '10px 10px 0px 0px';

      let ButtonB = document.createElement('button');
      ButtonB.id = 'bbButton';
      ButtonB.style.height = '30px';
      ButtonB.style.width = '120px';
      ButtonB.innerHTML = ' BBBB ';
      ButtonB.onclick = function() { ViewTag(2); };
      ButtonB.style.borderRadius = '10px 10px 0px 0px';
//設定値によりループする↑

      const recordGaia = document.getElementById("record-gaia").children[0];

      //ヘッダー、フッターの位置を作成
      recordGaia.appendChild(hrSpacef1);  //デバッグ用線
      recordGaia.appendChild(devSpaceh);
      recordGaia.appendChild(hrSpacef3);  //デバッグ用線

      recordGaia.appendChild(devSpace);
      devSpace.appendChild(ButtonAll);
//設定値によりループする↓
      devSpace.appendChild(ButtonA);
      devSpace.appendChild(ButtonB);
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

      // for(let i =0;i<prmval.length;i++){
      //   devSpaceh.appendChild(prmval[i][2]);
      // }

      for(let i =5;i<=9;i++){
        devSpaceh.appendChild(prmval[i][2]);
      }
      for(let i =17;i<prmval.length;i++){
        devSpace.appendChild(prmval[i][2]);
        prmval[i][2].className = prmval[i][2].className + ' tabVclass001';
      }
      for(let i =0;i<=4;i++){
        devSpace.appendChild(prmval[i][2]);
        prmval[i][2].className = prmval[i][2].className + ' tabVclass002';
      }
      for(let i =10;i<=16;i++){
        devSpacef.appendChild(prmval[i][2]);
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
  Tagparm[1] = document.getElementsByClassName('tabVclass001');
  Tagparm[2] = document.getElementsByClassName('tabVclass002');

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
