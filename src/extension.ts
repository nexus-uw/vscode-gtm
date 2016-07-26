'use strict';
import * as vscode from 'vscode';
var spawn = require('child_process').spawn;

function run_cmd(cmd, args, callBack) {
  var child = spawn(cmd, args);
  var resp = "";
  child.on('error', function (code) { console.error('error', resp); callBack(code) });
  child.stdout.on('data', function (buffer) { resp += buffer.toString() });
  child.on('close', function (code) {console.log(resp) ;callBack(code) });
}

export function activate(context: vscode.ExtensionContext) {
  // check if gtm is installed + avaliable
  run_cmd('gtm', [], (res) => {
    if (res < 0) {
      vscode.window.showErrorMessage('gtm is not avaliable on your $PATH. please install it first');
    }
  });
  let subscriptions: vscode.Disposable[] = [];


  let lastUpdated: Date = new Date();
  let lastSavedFileName: string;
  const MIN_UPDATE_FREQUENCE_MS = 30000; // 30 seconds

  function handleUpdateEvent(fileName: string){
    const now = new Date();
    // if a new file is being saved OR it have been at least MIN_UPDATE_FREQUENCE_MS, record it
    if (fileName !== lastSavedFileName || (now.getTime() - lastUpdated.getTime()) >= MIN_UPDATE_FREQUENCE_MS) {
      run_cmd('gtm', ['record', lastSavedFileName], () => { });
      lastSavedFileName = fileName;
      lastUpdated = now;
    }
  }

  // report to gtm everytime a file is saved
  vscode.workspace.onDidSaveTextDocument((e: vscode.TextDocument) => handleUpdateEvent(e.fileName), this, subscriptions);

  // report to gtm everytime the user's selection of text changes
  vscode.window.onDidChangeTextEditorSelection((e:vscode.TextEditorSelectionChangeEvent) => handleUpdateEvent(e.textEditor.document.fileName), this, subscriptions);

  // report  to gtm everytime the user switches textEditors
  vscode.window.onDidChangeActiveTextEditor((e:vscode.TextEditor) => handleUpdateEvent(e.document.fileName), this, subscriptions);
}

// always active, so no need to deactivate