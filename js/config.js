jQuery.noConflict();

(function($, PLUGIN_ID) {
  'use strict';

  let $form = $('.js-submit-settings');
  let $cancelButton = $('.js-cancel-button');
  let $message = $('.js-text-message');
  let $tabselect = $('.tab-select');

  FncListTable();

  $form.on('submit', function(e) {
    e.preventDefault();

    //配列の設定 *プラグインの設定値は配列を格納できないので文字列連結でsplit;
    let $tabselect2any = $('.tab-select2');
    let $tabselect2 = "";
    for(let i=0;i<$tabselect2any.length;i++){
      $tabselect2 += $tabselect2any[i].value + '@44';
    }
    let $tabsetany = $('.tabset');
    let $tabset = "";
    for(let i=0;i<$tabsetany.length;i++){
      $tabset += $tabsetany[i].value + '@44';m
    }

    kintone.plugin.app.setConfig({
      message: $message.val()
      ,tabselect: $tabselect.val()
      ,tabselect2: $tabselect2
      ,tabset: $tabset
    }, function() {
      alert('The plug-in settings have been saved. Please update the app!');
      window.location.href = '../../flow?app=' + kintone.app.getId();
    });
  });
  $cancelButton.on('click', function() {
    window.location.href = '../../' + kintone.app.getId() + '/plugin/';
  });
})(jQuery, kintone.$PLUGIN_ID);


//移動対象のリストを取得
async  function FncListTable(event){
  try{
    const ListTable = document.getElementById("ListTable");
    //フォームの設定情報
    let { layout } = await kintone.api(
      kintone.api.url('/k/v1/app/form/layout.json', true),
      'GET',
      { app: kintone.app.getId() }
    );

    let devSpace = document.createElement('dev');
    devSpace.innerHTML = '';//タブ位置の調整
    for(let i =0;i<layout.length;i++){
      let ii = i +1;
      devSpace.innerHTML = devSpace.innerHTML + ii + '行目' + layout[i]['type'] + '<select name="pets" class="tabset"><option value="0">0</option><option value="1">1</option><option value="2">2</option><option value="3">3</option></select><br>';
    }
    ListTable.appendChild(devSpace); 
  
    let $tabselect2any = $('.tab-select2');
    let $tabsetany = $('.tabset');

    let $tabselect2val = [];
    let $tabsetanyval = [];
  
    if (!($form.length > 0 && $cancelButton.length > 0 && $message.length > 0)) {
      throw new Error('Required elements do not exist.');
    }
    var config = kintone.plugin.app.getConfig(PLUGIN_ID);
  
    if (config.message) {
      $message.val(config.message);
      $tabselect.val(config.tabselect);
  
      //配列戻し
      $tabselect2val = config.tabselect2.split('@44');
      for(let i=0;i<$tabselect2val.length-1;i++){
        $tabselect2any[i].value = $tabselect2val[i];
      }
  
      $tabsetval = config.tabset.split('@44');
      for(let i=0;i<$tabsetval.length-1;i++){
        $tabsetany[i].value = $tabsetval[i];
      }
  
    }

  } catch (error) {  //エラー処理
    console.log(error.message);
    window.alert("エラーが発生した為、処理をキャンセルしました。\n" + error.message);
  } finally {  //後処理
    return {
      firstName,
      lastName,
    };
  }

}

/*
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

  // ドロップ先に要素を追加する
  e.target.appendChild(document.getElementById(id));
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
*/