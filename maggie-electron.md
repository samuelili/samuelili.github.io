# 1. Dev Setup:
You'll need node js and to install some packages. The best tool I find for installing *anything* techy is Chocolatey on Windows

1. Open a Powershell prompt with administrator priviliges (Search "Windows Powershell" in the Windows Start Menu)
2. `Set-ExecutionPolicy AllSigned`
3. `Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))`
4. Run `choco` to make sure that it's working properly
5. Next, install NodeJS with `choco install nodejs`
6. Run `node -v` and you should get a version number, like `v22.14.0` or higher

# 2. Prepare the folder

1. Extract `bella-egg-timer-electron.zip` to a folder of your choice. Favorably a new and empty folder
2. Open a terminal in that folder and run: `npm install`
3. Try running `npm run start`, a window should open with ingrid's github page
4. Try making a change inside `files/index.html` the content should automatically refresh
5. Have fun! You should be able to completely copy paste all of your previous code into the `files/` folder

# 3. Distributing

1. run `npm run make`
2. Cry and realize Beba is on Mac so you need to send the files to sam so he can run it on his work laptop
