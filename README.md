# hyperchat2

a p2p messageboard around a distributed, append-only data store.

see [swarmlog](https://github.com/substack/swarmlog)

# building a board for your friends

        npm install
        ./build "My cool board"

this will generate `dist/index.html`. give this to your friends!

you may want to [sign](http://www.sanface.com/pgphtml.html) the generated webpage. 

you may also want to generate a [checksum](https://www.npmjs.com/package/checksum) of the html file, so others can know they are getting an ok file

# developing

        npm install
        ./build "Board name"
        npm run dev

go to localhost:9999/

you can live code index.js + render.js

## license

BSD
