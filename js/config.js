jQuery.noConflict();

var  listCnt =0;
var  gproperties =[];
(function($, PLUGIN_ID) {
  'use strict';

  FncListTable(PLUGIN_ID);  //API呼び出しで、同期解除の為別関数で呼び出し　動的配列も関数内で設定する。

  //固定オブジェクトはここで宣言
  let $form = $('.js-submit-settings');
  let $cancelButton = $('.js-cancel-button');
  //let $message = $('.js-text-message');
  let $tabselect = $('.tab-select');
  //固定オブジェクト（配列）はここで宣言

  // if (!($form.length > 0 && $cancelButton.length > 0 && $message.length > 0)) {
  //   throw new Error('Required elements do not exist.');
  // }
  let config = kintone.plugin.app.getConfig(PLUGIN_ID);

  if (config.tabselect) {  //格納設定値セット
    //$message.val(config.message);
    $tabselect.val(config.tabselect);
  }
  $form.on('submit', function(e) {
    e.preventDefault();
    //配列の設定↓ *プラグインの設定値は配列を格納できないので文字列連結でsplit;
    let $tabselect2any = $('.tab-select2');
    let $tabselect2 = "";
    let tabflg =0;
    for(let i=0;i<$tabselect2any.length;i++){
      $tabselect2 += $tabselect2any[i].value + '@44';
      tabflg = 1;
    }
    if(tabflg == 0){
      $tabselect2 = '@44';
    }
    const tabselectini = document.getElementById("tabselectini");
    let tabsetany = [];
    for(let i=0;i<=tabselectini.value;i++){
      let tabboxname='tabbox' + i;
      for(let ii=1;ii<=document.getElementById(tabboxname).childElementCount;ii++){
        let iii = ii-1;
        let rowcc = document.getElementById(tabboxname).children[iii].id.replace('item','');
        tabsetany[rowcc] = i+'--'+iii;
      }
    }
    let tabboxname='tabbox999';
    for(let i=1;i<=document.getElementById(tabboxname).childElementCount;i++){
      let ii = i-1;
      let rowcc = document.getElementById(tabboxname).children[ii].id.replace('item','');
      tabsetany[rowcc] = '999'+'--'+ii;
    }

    let $tabset = "";
    for(let i=1;i<tabsetany.length;i++){
      $tabset += tabsetany[i] + '@44';
    }
    //配列の設定↑

    //Configへ値のセット
    kintone.plugin.app.setConfig({
      tabselect: $tabselect.val()
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
    devSpace.innerHTML = '';//タブ位置の調整
    let tabini = 0;
    if(config.tabselect){
      tabini = config.tabselect;
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
    for(let i=1;i<=tabini;i++){
      let ii=i-1;
      HtmlInnerVal += '<input type="text" id="aaButton' + i + '" class="tab-select2" value="'+ tabselect2val[ii] +'" onclick="FncTabonclick('+ i +')" style="width:96px;border-radius:10px 10px 0px 0px;background-color:#f5f5f5;padding: 1px 6px;text-align:center;">';
    }
    HtmlInnerVal += '<input type="text" id="aaButton0" class="tab-select3" value="ボトム" onclick="FncTabonclick(999)" style="width:96px;border-radius:10px 10px 0px 0px;background-color:#f5f5f5;padding: 1px 6px;text-align:center;" readonly>';
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
        tabsetvalTop[tabsetval2[1]] = '<div class="item" draggable="true" id="item' + ii +'">' +ii + '行目';
        if(layout[i]['type'] == 'SUBTABLE'){
          tabsetvalTop[tabsetval2[1]] += '<div class="pplb" style="">'+gproperties[layout[i]['code']].label+'<br>';
          for(let i4=0;i4 <layout[i]['fields'].length;i4++){
            tabsetvalTop[tabsetval2[1]] += FncClehtml(layout[i]['fields'][i4],layout[i]['type'],layout[i]['code']);
          }
          tabsetvalTop[tabsetval2[1]] += '</div>';
        }else if(layout[i]['type'] == 'GROUP'){
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
        //HtmlInnerVal += '<div class="item" draggable="true" id="item' + ii +'">' +ii + '行目' + layout[i]['type'] + ii +'</div>';
        HtmlInnerVal += '<div class="item" draggable="true" id="item' + ii +'">' +ii + '行目';
        if(layout[i]['type'] == 'SUBTABLE'){
          HtmlInnerVal += '<div class="pplb" style="">'+gproperties[layout[i]['code']].label+'<br>';
          for(let i4=0;i4 <layout[i]['fields'].length;i4++){
            HtmlInnerVal += FncClehtml(layout[i]['fields'][i4],layout[i]['type'],layout[i]['code']);
          }
          HtmlInnerVal += '</div>';
        }else if(layout[i]['type'] == 'GROUP'){
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

    for(let i=1;i<=tabini;i++){
      HtmlInnerVal += '<div class="box box2" id="tabbox'+i+'" style="width:100%;">';
      let tabsetvalmid =[];
      for(let ii =0;ii<layout.length;ii++){
        if(ii>=tabsetval.length-1){
          continue;
        }
          let iii = ii +1;
        let tabsetval2 = tabsetval[ii].split('--');
        if(tabsetval2[0] == i){
          tabsetvalmid[tabsetval2[1]] = '<div class="item" draggable="true" id="item' + iii +'">' +iii + '行目';
          if(layout[ii]['type'] == 'SUBTABLE'){
            tabsetvalmid[tabsetval2[1]] += '<div class="pplb" style="">'+gproperties[layout[ii]['code']].label+'<br>';
            for(let i4=0;i4 <layout[ii]['fields'].length;i4++){
              tabsetvalmid[tabsetval2[1]] += FncClehtml(layout[ii]['fields'][i4],layout[ii]['type'],layout[ii]['code']);
            }
            tabsetvalmid[tabsetval2[1]] += '</div>';
          }else if(layout[ii]['type'] == 'GROUP'){
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
        tabsetvalBtm[tabsetval2[1]] = '<div class="item" draggable="true" id="item' + ii +'">' +ii + '行目';
        if(layout[i]['type'] == 'SUBTABLE'){
          tabsetvalBtm[tabsetval2[1]] += '<div class="pplb" style="">'+gproperties[layout[i]['code']].label+'<br>';
          for(let i4=0;i4 <layout[i]['fields'].length;i4++){
            tabsetvalBtm[tabsetval2[1]] += FncClehtml(layout[i]['fields'][i4],layout[i]['type'],layout[i]['code']);
          }
          tabsetvalBtm[tabsetval2[1]] += '</div>';
        }else if(layout[i]['type'] == 'GROUP'){
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
    console.log(error.message);
    window.alert("エラーが発生した為、処理をキャンセルしました。\n" + error.message);
  } finally {  //後処理
    FncDragiven();
    FncMoveheight();
    FncTabonclick(1);
    const tabselectini = document.getElementById("tabselectini");
    tabselectini.onchange =function() { FnccngTabini(); };
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
    if(!e.target.id.includes("tabbox")){
      return;
    }
    e.target.classList.add("over");
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
    if(!e.target.id.includes("tabbox")){
      return;
    }
    // ドロップ先に要素を追加する
    e.target.appendChild(document.getElementById(id));
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
  const tabselectini = document.getElementById("tabselectini");
  let Objtabbox=[];
  Objtabbox[0] =document.getElementById("tabbox0");
  for(let i=1;i<=tabselectini.value;i++){
    let tabboxname='tabbox' + i;
    Objtabbox[i] = document.getElementById(tabboxname);
  }
  let fincnt = Number(tabselectini.value) + 1;
  Objtabbox[fincnt] =document.getElementById("tabbox999");

  let maxheight =0;
  for(let i=0;i<Objtabbox.length;i++){
    let boxheight=0;
    for(let ii=0;ii<Objtabbox[i].childElementCount;ii++){
      boxheight += Objtabbox[i].children[ii].clientHeight+11;
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

function FnccngTabini(e){
  const tabselectini = document.getElementById("tabselectini");

  //初期化
  let Objtabbox =document.getElementById("tabbox0");
  for(let i=1;i<=listCnt;i++){
  let tabboxname='item' + i;
    Objtabbox.appendChild(document.getElementById(tabboxname));
  }
  let fincnt = Number(tabselectini.value) + 1;
  Objtabbox[fincnt] =document.getElementById("tabbox999");

  const tabname = document.getElementById("tabname");
  let HtmlInnerVal ="";
  for(let i=1;i<=tabselectini.value;i++){
    HtmlInnerVal += '<input type="text" id="aaButton' + i + '" class="tab-select2" value="" onclick="FncTabonclick('+ i +')" style="width:96px;border-radius:10px 10px 0px 0px;padding: 1px 6px;text-align:center;">';
  }
  HtmlInnerVal += '<input type="text" id="aaButton0" class="tab-select3" value="ボトム" onclick="FncTabonclick(999)" style="width:96px;border-radius:10px 10px 0px 0px;padding: 1px 6px;text-align:center;" readonly>';
  tabname.innerHTML=HtmlInnerVal;

  const movetabbox = document.getElementById("movetabbox");
  HtmlInnerVal ="";
  for(let i=1;i<=tabselectini.value;i++){
    HtmlInnerVal += '<div class="box box2" id="tabbox'+i+'" style="width:100%;"></div>';
  }
  HtmlInnerVal += '<div class="box box2" id="tabbox999" style="width:100%;"></div>';
  movetabbox.innerHTML=HtmlInnerVal;

  FncTabonclick(1);
  FncDragiven();
  FncMoveheight();
}

function FncTabonclick(ini){
  const tabselectini = document.getElementById("tabselectini");
  let Objtabbox=[];
  Objtabbox[0] =document.getElementById("tabbox0");
  let Objtabbtn=[];

  for(let i=1;i<=tabselectini.value;i++){
    let tabboxname='tabbox' + i;
    let tabboxbtan='aaButton' + i;
    if(i==ini){
      document.getElementById(tabboxname).style.display='';
      document.getElementById(tabboxbtan).style.background = '#f0f0f0';
    }else{
      document.getElementById(tabboxname).style.display='none';
      document.getElementById(tabboxbtan).style.background = '#969998';
    }
  }
  if(999 == ini || tabselectini.value == '0'){
    document.getElementById('tabbox999').style.display='';
    document.getElementById('aaButton0').style.background = '#f0f0f0';
  }else{
    document.getElementById('tabbox999').style.display='none';
    document.getElementById('aaButton0').style.background = '#969998';
  }
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
