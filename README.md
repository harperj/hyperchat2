# empty-webapp
novice developer builds stack

## setup 

make sure you have `node` and `npm` 

if you don't have gulp, `npm install --global gulp`

then just `npm install` and `coffee server.coffee`!

## directory structure

here are the directories you'll deal with:

```
server.coffee
logs/
dist/
app/ 
    assets/ 
    lib/ 
    index.html
    entry.coffee
```

`server.coffee` is the webserver

`app/` contains all the webapp files - `entry.coffee` is the entrypoint into the app. all other coffee files go in `app/lib/`.

`app/assets/` contains everything the app might need - css, images, etc
