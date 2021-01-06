importScripts('./statics/ffmpeg.js');

function print(text) {
    postMessage({
        type: 'stdout',
        data: text
    });
}

self.onmessage = function (ev) {
    let module = {
        files: ev.data.files || [],
        arguments: ev.data.arguments || [],
        print: print,
        printErr: print
    }
    postMessage({
        type: 'start',
        data: module.arguments
    });
    let result = ffmpeg_run(module);
    postMessage({
        type: "done",
        data: result
    })
}

postMessage({
    type: 'ready'
})