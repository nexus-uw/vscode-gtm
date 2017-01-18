'use strict';

import * as vscode from 'vscode';
const spawn = require('child_process').spawn;

interface Result {
  code: number;
  output: string;
}

function run_cmd(cmd: string, args: string[]): Promise<Result> {
  const child = spawn(cmd, args);
  let output = "";
  return new Promise((resolve, reject) => {
    child.on('error', (code: number) => {
      console.error('error', output);
      reject(<Result>{ code, output });
    });
    child.stdout.on('data', (buffer) => output += buffer.toString());
    child.stderr.on('data', (buffer) => output += buffer.toString()); // since gtm -v outputs to stderr on ubuntu....
    child.on('close', (code: number) => resolve(<Result>{ code, output }));
  });
}
export function activate(context: vscode.ExtensionContext) {
  // check if gtm is installed + available
  run_cmd('gtm', ['verify', '>= 1.2.1'])
    .then((res: Result) => {
      if (res.output != 'true') {
        vscode.window.showWarningMessage('Installed gtm version is below v1.2.1. Please update your gtm installation.');
      }
    }, (res: Result) => {
      if (res.code < 0) {
        vscode.window.showErrorMessage('gtm is not available on your $PATH. please install it first');
      }
    });
  let subscriptions: vscode.Disposable[] = [];
  let lastUpdated: Date = new Date();
  let lastSavedFileName: string;
  const MIN_UPDATE_FREQUENCE_MS = 30000; // 30 seconds

  let gtmStatusBar = new GTMStatusBar()

  function handleUpdateEvent(fileName: string) {
    const now = new Date();
    // if a new file is being saved OR it have been at least MIN_UPDATE_FREQUENCE_MS, record it
    if (fileName !== lastSavedFileName || (now.getTime() - lastUpdated.getTime()) >= MIN_UPDATE_FREQUENCE_MS) {
      run_cmd('gtm', ['record', '--status', lastSavedFileName])
        .then((res: Result) => gtmStatusBar.updateStatus(res.output));
      lastSavedFileName = fileName;
      lastUpdated = now;
    }
  }

  // report to gtm everytime a file is saved
  vscode.workspace.onDidSaveTextDocument((e: vscode.TextDocument) => handleUpdateEvent(e.fileName), this, subscriptions);

  // report to gtm everytime the user's selection of text changes
  vscode.window.onDidChangeTextEditorSelection((e: vscode.TextEditorSelectionChangeEvent) => {
    if (e && e.textEditor && e.textEditor.document) {
      handleUpdateEvent(e.textEditor.document.fileName);
    }
  }, this, subscriptions);

  // report  to gtm everytime the user switches textEditors
  vscode.window.onDidChangeActiveTextEditor((e: vscode.TextEditor) => {
    // Note that the event also fires when the active editor changes to undefined.
    if (e && e.document) {
      handleUpdateEvent(e.document.fileName);
    }

  }, this, subscriptions);
}

class GTMStatusBar {
  private statusBarItem: vscode.StatusBarItem;

  public updateStatus(statusText: string) {

    // Create as needed
    if (!this.statusBarItem) {
      this.statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
    }

    // Get the current text editor
    let editor = vscode.window.activeTextEditor;
    if (!editor) {
      this.statusBarItem.hide();
      return;
    }

    // Update the status bar
    this.statusBarItem.text = statusText;
    this.statusBarItem.show();
  }
}

// always active, so no need to deactivate
