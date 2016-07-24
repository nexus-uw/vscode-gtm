'use strict';
import * as vscode from 'vscode';
var spawn = require('child_process').spawn;

function run_cmd(cmd, args, callBack) {
  var child = spawn(cmd, args);
  var resp = "";
  child.on('error', function (code) { console.error('error', resp); callBack(code) });
  child.stdout.on('data', function (buffer) { resp += buffer.toString() });
  child.on('close', function (code) { callBack(code) });
}

export function activate(context: vscode.ExtensionContext) {
  // check if gtm is installed + avaliable
  run_cmd('gtm', [], (res) => {
    if (res < 0) {
      vscode.window.showErrorMessage('gtm is not avaliable on your $PATH. please install it first');
    }
  });
  let subscriptions: vscode.Disposable[] = [];

  // report time every time a file is saved
  vscode.workspace.onDidSaveTextDocument((e: vscode.TextDocument) => {
    run_cmd('gtm', ['record', e.fileName], (res) => console.log(res));
  }, this, subscriptions);
}

// always active, so no need to deactivate