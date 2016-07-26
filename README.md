# vscode-gtm README
[![Build Status](https://travis-ci.org/nexus-uw/vscode-gtm.svg?branch=travis-ci)](https://travis-ci.org/nexus-uw/vscode-gtm)

![](./GTMLogo-128.png)

Visual Studio Code plugin to support Git Time Metrics

From [git-time-metric/gtm](https://github.com/git-time-metric/gtm)
>Git Time Metrics (GTM) is a tool to automatically track time spent reading and working on code that you store in a Git repository. By installing GTM and using supported plug-ins for your favorite editors, you can immediately realize better insight into how you are spending your time and on what files.
>GTM is automatic, seamless and lightweight. There is no need to remember to start and stop timers. It's a process that only runs on occasion to capture edit events triggered by the editor. It does not require a background process or any file system monitoring.
>Your time metrics are stored locally with the repository as Git notes. If you want to share your data, it can be pushed and fetched to and from the remote repository. Other GTM users on your team can do the same. This provides you the ability to see time metrics for the entire team.
## Features
- auto updates gtm everytime a file is saved

## Requirements

1. ```gtm``` must be installed locally and accessible on the ```$PATH``` ([installation instructions](https://github.com/git-time-metric/gtm#install-the-latest-gtm-release))
2. In VSCode, open the command pallet, and type ```>ext install vscode-gtm```

## Extension Settings

none currently

## Known Issues

only tested on Ubuntu, so may not work on OSX, other Linuxs, and/or Windows

## Release Notes

### 0.0.1

Initial release of vscode-gtm


### Notes
Logo belongs to https://github.com/git-time-metric/gtm
