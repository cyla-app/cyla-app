
const libthemisFn = require('./libthemis.js')

const e = {
    
}

e.initialize = wasmPath => new Promise(function (resolve) {
   libthemisFn({
        onRuntimeInitialized: function () {
            
        },
        locateFile: function () {
            return wasmPath
        }
    }).then(r => {
       e["libthemis"] = r
       resolve()
       
    })
})

module.exports = e
