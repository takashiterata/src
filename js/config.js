jQuery.noConflict();

(function($, PLUGIN_ID) {
  'use strict';

  var $form = $('.js-submit-settings');
  var $cancelButton = $('.js-cancel-button');
  var $message = $('.js-text-message');
  var $tabselect = $('.tab-select');
  var $tabselect2 = $('.tab-select2');
  
  if (!($form.length > 0 && $cancelButton.length > 0 && $message.length > 0)) {
    throw new Error('Required elements do not exist.');
  }
  var config = kintone.plugin.app.getConfig(PLUGIN_ID);

  if (config.message) {
    $message.val(config.message);
    $tabselect.val(config.tabselect);
  }
  $form.on('submit', function(e) {
    e.preventDefault();

    kintone.plugin.app.setConfig({
      message: $message.val()
      ,tabselect: $tabselect.val()
      ,tabselect2: $tabselect2.val()
    }, function() {
      alert('The plug-in settings have been saved. Please update the app!');
      window.location.href = '../../flow?app=' + kintone.app.getId();
    });
  });
  $cancelButton.on('click', function() {
    window.location.href = '../../' + kintone.app.getId() + '/plugin/';
  });
})(jQuery, kintone.$PLUGIN_ID);
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