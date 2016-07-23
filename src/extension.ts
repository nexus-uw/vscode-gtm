'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';


function run_cmd(cmd, args, callBack) {
      var spawn = require('child_process').spawn;
      var child = spawn(cmd, args);
      var resp = "";
      child.on('error', function (code) { console.log('error');callBack(code) });

      child.stdout.on('data', function (buffer) { resp += buffer.toString() });
      child.on('close', function (code) {  console.log(resp); callBack(code) });

    }

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "vscode-gtm" is now active!');

  // check gtm exists + initd/

      run_cmd('gtm',[], (res) => {
        if (res < 0){
          vscode.window.showErrorMessage('gtm is not avaliable on your $PATH. please install it first');
        }
      });



  //}

  let subscriptions: vscode.Disposable[] = [];

  vscode.workspace.onDidSaveTextDocument((e: vscode.TextDocument) => {


    run_cmd('gtm', ['record', e.fileName], (res) => console.log(res))

  }, this, subscriptions);
}

// this method is called when your extension is deactivated
export function deactivate() {
}