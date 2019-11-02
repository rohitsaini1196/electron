const electron = require("electron");
const url = require("url");
const path = require("path");

const { app, BrowserWindow, Menu, ipcMain } = electron;

//process.env.NODE_ENV = "production";

let mainWindow;
let AddWindow;

app.on("ready", function() {
  mainWindow = new BrowserWindow({});
  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "mainWindow.html"),
      protocol: "file:",
      slashes: true
    })
  );

  mainWindow.on("closed", function() {
    app.quit();
  });

  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
  Menu.setApplicationMenu(mainMenu);
});

function createAddWindow() {
  AddWindow = new BrowserWindow({
    width: 300,
    height: 200,
    title: "Add shopping list item"
  });
  AddWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "addWindow.html"),
      protocol: "file:",
      slashes: true
    })
  );

  AddWindow.on("close", function() {
    AddWindow = null;
  });
}

ipcMain.on("item:add", function(e, item) {
  console.log(item);

  mainWindow.webContents.send("item:add", item);
  AddWindow.close();
});

const mainMenuTemplate = [
  {
    label: "File",
    submenu: [
      {
        label: "Add Item",
        click() {
          createAddWindow();
        }
      },
      {
        label: "Clear Item",
        click() {
          mainWindow.webContents.send("item:clear");
        }
      },
      {
        label: "Quit",
        accelerator: "Ctrl+Q",
        click() {
          app.quit();
        }
      }
    ]
  }
];

if (process.platform == "darwin") {
  mainMenuTemplate.unshift({});
}

if (process.env.NODE_ENV !== "production") {
  mainMenuTemplate.push({
    label: "Developer tools",
    submenu: [
      {
        label: "Toggle DevTools",
        accelerator: "Ctrl+I",
        click(item, focusedWindow) {
          focusedWindow.toggleDevTools();
        }
      },
      {
        role: "reload"
      }
    ]
  });
}
